import { createClient } from "@supabase/supabase-js";

/**
 * Enrich bulk-imported SWIFT records in Supabase with verified street addresses:
 *   1. GLEIF Public API by 11-char BIC (exact match)
 *   2. FDIC BankFind API by bank name + state/city (for US banks)
 *   3. GLEIF Public API by legal entity name + country (fallback)
 *
 * Usage:
 *   node --env-file=.env.local scripts/enrich-swift-addresses.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function formatGleifAddress(hq) {
  if (!hq || !Array.isArray(hq.addressLines) || hq.addressLines.length === 0) {
    return null;
  }
  const street = hq.addressLines.filter(Boolean).join(", ").trim();
  if (!street) return null;

  const regionPart = hq.region ? hq.region.split("-").pop() : "";
  const cityLine = [hq.city, regionPart, hq.postalCode]
    .filter(Boolean)
    .join(", ");

  return [street, cityLine, hq.country].filter(Boolean).join(", ");
}

function isAlreadyEnriched(address, city) {
  if (!address) return false;
  const cleanAddr = address.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanCity = (city || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!cleanAddr || cleanAddr === cleanCity) return false;
  if (cleanCity && cleanAddr.startsWith(cleanCity) && cleanAddr.length - cleanCity.length < 18) {
    return false;
  }
  return true;
}

async function lookupGleifByBic(swiftCode) {
  const code = (swiftCode || "").trim().toUpperCase();
  if (!code) return null;
  const bic11 = code.length === 8 ? `${code}XXX` : code;

  try {
    const res = await fetch(
      `https://api.gleif.org/api/v1/lei-records?filter[bic]=${encodeURIComponent(bic11)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const hq = json?.data?.[0]?.attributes?.entity?.headquartersAddress;
    return formatGleifAddress(hq);
  } catch {
    return null;
  }
}

async function lookupFdicUsBank(bankName, city) {
  const cleanName = (bankName || "")
    .replace(/,?\s*(N\.?A\.?|LLC|INC\.?|CORP\.?|CORPORATION)$/i, "")
    .trim();
  if (!cleanName) return null;

  try {
    const res = await fetch(
      `https://banks.data.fdic.gov/api/institutions?search=${encodeURIComponent(cleanName)}&fields=NAME,ADDRESS,CITY,STALP,ZIP&limit=5`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const items = (json?.data || []).map((d) => d.data).filter(Boolean);
    if (items.length === 0) return null;

    const cityFirstWord = (city || "").split(",")[0].trim().toLowerCase();
    const exact =
      items.find(
        (it) =>
          it.CITY &&
          cityFirstWord &&
          it.CITY.toLowerCase() === cityFirstWord &&
          it.NAME?.toLowerCase().includes(cleanName.split(" ")[0].toLowerCase())
      ) ||
      items.find((it) =>
        it.NAME?.toLowerCase().startsWith(cleanName.slice(0, 10).toLowerCase())
      );

    if (!exact || !exact.ADDRESS) return null;
    return [exact.ADDRESS, exact.CITY, exact.STALP, exact.ZIP, "US"]
      .filter(Boolean)
      .join(", ");
  } catch {
    return null;
  }
}

async function lookupGleifByName(bankName, countrySlug) {
  const iso = countrySlug === "uk" ? "GB" : (countrySlug || "").toUpperCase();
  const cleanName = (bankName || "")
    .replace(/\(.*?\)/g, "")
    .replace(/,?\s*(LLC|PLC|LTD\.?|LIMITED|INC\.?|N\.?A\.?)$/i, "")
    .trim();
  if (cleanName.length < 4) return null;

  try {
    const res = await fetch(
      `https://api.gleif.org/api/v1/lei-records?filter[entity.names]=${encodeURIComponent(cleanName)}&filter[entity.legalAddress.country]=${encodeURIComponent(iso)}&page[size]=3`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const match = (json?.data || []).find((rec) => {
      const legalName = rec?.attributes?.entity?.legalName?.name || "";
      return legalName.toLowerCase().includes(cleanName.split(" ")[0].toLowerCase());
    });
    const hq = match?.attributes?.entity?.headquartersAddress;
    return formatGleifAddress(hq);
  } catch {
    return null;
  }
}

async function main() {
  const { data: rows, error } = await supabase
    .from("swift_codes")
    .select("id, bank_name, swift_code, country, city, address")
    .is("guide_html", null)
    .limit(500);

  if (error) {
    console.error("Failed to fetch swift_codes:", error.message);
    process.exit(1);
  }

  const remaining = rows.filter((r) => !isAlreadyEnriched(r.address, r.city));
  console.log(
    `Total null-guide: ${rows.length} | Already enriched: ${rows.length - remaining.length} | Checking remaining: ${remaining.length}`
  );

  let updated = 0;

  for (let i = 0; i < remaining.length; i += 4) {
    const chunk = remaining.slice(i, i + 4);
    await Promise.all(
      chunk.map(async (row) => {
        let verifiedAddr = await lookupGleifByBic(row.swift_code);
        if (!verifiedAddr && row.country === "us") {
          verifiedAddr = await lookupFdicUsBank(row.bank_name, row.city);
        }
        if (!verifiedAddr) {
          verifiedAddr = await lookupGleifByName(row.bank_name, row.country);
        }

        if (verifiedAddr && verifiedAddr !== row.address) {
          const { error: upErr } = await supabase
            .from("swift_codes")
            .update({ address: verifiedAddr })
            .eq("id", row.id);
          if (!upErr) {
            updated++;
            console.log(`Updated [${row.swift_code}] -> ${verifiedAddr}`);
          }
        }
      })
    );
    await sleep(300);
  }

  console.log(`Done. Newly enriched ${updated} more records.`);
}

main();
