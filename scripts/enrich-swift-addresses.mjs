import { createClient } from "@supabase/supabase-js";

/**
 * Enrich bulk-imported SWIFT records in Supabase with official street addresses
 * from the free GLEIF Legal Entity Identifier (LEI) Public API using 11-char BIC lookup.
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

async function lookupByBic(swiftCode) {
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

async function main() {
  const { data: rows, error } = await supabase
    .from("swift_codes")
    .select("id, bank_name, swift_code, address")
    .is("guide_html", null)
    .limit(500);

  if (error) {
    console.error("Failed to fetch swift_codes:", error.message);
    process.exit(1);
  }

  console.log(`Checking ${rows.length} SWIFT records against GLEIF API...`);
  let updated = 0;

  for (let i = 0; i < rows.length; i += 5) {
    const chunk = rows.slice(i, i + 5);
    await Promise.all(
      chunk.map(async (row) => {
        const verifiedAddr = await lookupByBic(row.swift_code);
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
    await sleep(250);
  }

  console.log(`Done. Updated ${updated} of ${rows.length} records with verified GLEIF street addresses.`);
}

main();
