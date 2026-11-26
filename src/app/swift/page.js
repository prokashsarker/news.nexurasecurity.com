import Link from "next/link";
import { getSwiftCodes, getSwiftCountries } from "@/lib/data";
import { getCountryDisplayName } from "@/lib/seed-data";
import SwiftDirectoryTable from "@/components/SwiftDirectoryTable";
import AdSlot from "@/components/AdSlot";

export const metadata = {
  title: "SWIFT / BIC & Routing Code Directory (US, UK, Canada, Australia)",
  description:
    "Verified SWIFT/BIC codes, ABA wire routing numbers, UK sort codes, and international transfer fees for major retail banks.",
};

export default async function SwiftDirectoryPage() {
  const [codes, countries] = await Promise.all([
    getSwiftCodes({ limit: 2000 }),
    getSwiftCountries(),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="border-b border-gray-300 pb-5 mb-6">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-600">
          Reference Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mt-1">
          International SWIFT / BIC &amp; Wire Directory
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
          Verify official SWIFT/BIC codes, domestic wire routing numbers, and
          standard transfer fees before initiating cross-border payments.
        </p>
      </div>

      {/* Country Hub Links */}
      {countries.length > 0 && (
        <section aria-label="Browse by Country" className="mb-8">
          <h2 className="text-xs font-mono uppercase tracking-wider text-gray-600 mb-3">
            Browse Banks by Country
          </h2>
          <div className="flex flex-wrap gap-2">
            {countries.map((c) => (
              <Link
                key={c.code}
                href={`/swift/country/${c.code}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 hover:border-slate-900 rounded-sm text-gray-800 transition-colors"
              >
                <span>{getCountryDisplayName(c.code)}</span>
                <span className="font-mono text-[11px] text-gray-500">
                  ({c.count})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <AdSlot className="mb-8" />

      <SwiftDirectoryTable codes={codes} showCountryColumn={true} />
    </main>
  );
}
