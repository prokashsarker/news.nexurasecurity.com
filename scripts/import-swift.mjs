import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";

/**
 * Phased Global SWIFT/BIC Importer
 *
 * Usage:
 *   Phase 1 (Tier-1 default: US, GB, CA, AU - 50 per country = ~200 banks):
 *     node --env-file=.env.local scripts/import-swift.mjs
 *
 *   Phase 2 (Europe & Asia hubs):
 *     node --env-file=.env.local scripts/import-swift.mjs --countries=DE,FR,NL,CH,SG,AE,IN,BD --limit=100
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const args = process.argv.slice(2);
const countriesArg = args.find((a) => a.startsWith("--countries="));
const limitArg = args.find((a) => a.startsWith("--limit="));

const TARGET_COUNTRIES = countriesArg
  ? countriesArg.replace("--countries=", "").split(",").map((c) => c.trim().toUpperCase())
  : ["US", "GB", "CA", "AU"];

const PER_COUNTRY_LIMIT = limitArg
  ? Math.max(1, parseInt(limitArg.replace("--limit=", ""), 10) || 50)
  : 50;

const BASE_RAW_URL =
  "https://raw.githubusercontent.com/PeterNotenboom/SwiftCodes/master/AllCountries";

function mapCountrySlug(isoCode) {
  const lower = isoCode.toLowerCase();
  return lower === "gb" ? "uk" : lower;
}

const ACRONYMS = new Set([
  "HSBC",
  "RBC",
  "BMO",
  "TD",
  "ANZ",
  "NAB",
  "UBS",
  "ING",
  "BNP",
  "BBVA",
  "DBS",
  "OCBC",
  "UOB",
  "ICBC",
  "SBI",
  "HDFC",
  "ICICI",
  "LLC",
  "PLC",
  "USA",
  "UK",
  "N.A.",
]);

function toTitleCase(str) {
  return (str || "")
    .trim()
    .split(/\s+/)
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) return upper;
      return word.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    })
    .join(" ");
}

const POPULAR_BANK_KEYWORDS = [
  "CAPITAL ONE",
  "PNC",
  "U.S. BANK",
  "US BANK",
  "TRUIST",
  "GOLDMAN SACHS",
  "MORGAN STANLEY",
  "AMERICAN EXPRESS",
  "NATWEST",
  "SANTANDER",
  "MONZO",
  "STARLING",
  "REVOLUT",
  "NATIONWIDE",
  "CIBC",
  "NATIONAL BANK OF CANADA",
  "SCOTIABANK",
  "DESJARDINS",
  "NATIONAL AUSTRALIA BANK",
  "NAB",
  "MACQUARIE",
  "DEUTSCHE BANK",
  "COMMERZBANK",
  "BNP PARIBAS",
  "SOCIETE GENERALE",
  "ING",
  "UBS",
  "DBS",
  "OCBC",
  "UOB",
  "EMIRATES NBD",
  "FIRST ABU DHABI",
  "HDFC",
  "ICICI",
  "STATE BANK OF INDIA",
  "BRAC BANK",
  "DUTCH-BANGLA",
  "SONALI BANK",
  "ISLAMI BANK",
];

function isPopularBank(bankName) {
  const upper = (bankName || "").toUpperCase();
  return POPULAR_BANK_KEYWORDS.some((kw) => upper.includes(kw));
}

async function importCountry(isoCode) {
  const url = `${BASE_RAW_URL}/${isoCode}.json`;
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`Skipping ${isoCode}: HTTP ${res.status}`);
    return 0;
  }

  const json = await res.json();
  const list = Array.isArray(json.list) ? json.list : [];
  const countrySlug = mapCountrySlug(isoCode);

  // Prioritize popular retail banks + primary 8-char / XXX head-office SWIFT codes first
  const isPrimary = (b) =>
    !b.branch ||
    (b.swift_code || "").endsWith("XXX") ||
    (b.swift_code || "").length === 8;

  const prioritized = [...list].sort((a, b) => {
    const popDiff = Number(isPopularBank(b.bank)) - Number(isPopularBank(a.bank));
    if (popDiff !== 0) return popDiff;
    return Number(isPrimary(b)) - Number(isPrimary(a));
  });

  // Fetch already-imported SWIFT codes for this country to avoid duplicates/conflicts
  const { data: existingRows } = await supabase
    .from("swift_codes")
    .select("swift_code")
    .eq("country", countrySlug);

  const seen = new Set(
    (existingRows || []).map((r) => (r.swift_code || "").trim().toUpperCase())
  );
  const batch = [];
  for (const row of prioritized) {
    if (batch.length >= PER_COUNTRY_LIMIT) break;
    const swift = (row.swift_code || "").trim().toUpperCase();
    const bankName = (row.bank || "").trim();
    if (!swift || !bankName || seen.has(swift)) continue;
    seen.add(swift);

    const cleanBank = toTitleCase(bankName);
    const cleanCity = toTitleCase(row.city || json.country || isoCode);
    const cleanSlugPart =
      slugify(cleanBank, { lower: true, strict: true })
        .slice(0, 45)
        .replace(/-+$/, "") || "bank";
    const slug = `${cleanSlugPart}-${countrySlug}-${swift.toLowerCase()}`;

    batch.push({
      bank_name: cleanBank,
      swift_code: swift,
      country: countrySlug,
      city: cleanCity,
      address: row.branch
        ? `${toTitleCase(row.branch)}, ${cleanCity}`
        : `${cleanCity}, ${json.country || isoCode}`,
      slug,
      guide_html: null, // Rendered dynamically by /swift/[slug] to keep DB under ~25 MB
    });
  }

  if (batch.length === 0) return 0;

  const { error } = await supabase
    .from("swift_codes")
    .upsert(batch, { onConflict: "slug", ignoreDuplicates: true });

  if (error) {
    console.error(`Upsert error for ${isoCode}:`, error.message);
    return 0;
  }

  console.log(`Imported ${batch.length} SWIFT records for ${isoCode} (${countrySlug}).`);
  return batch.length;
}

async function main() {
  let total = 0;
  for (const iso of TARGET_COUNTRIES) {
    total += await importCountry(iso);
  }
  console.log(`Done. Total processed across ${TARGET_COUNTRIES.join(", ")}: ${total}`);
}

main();
