import Link from "next/link";
import { getSwiftCodes } from "@/lib/data";
import CopyButton from "@/components/CopyButton";
import AdSlot from "@/components/AdSlot";

export const metadata = {
  title: "SWIFT / BIC & Routing Code Directory (US, UK, Canada, Australia)",
  description:
    "Verified SWIFT/BIC codes, ABA wire routing numbers, UK sort codes, and international transfer fees for major retail banks.",
};

export default async function SwiftDirectoryPage() {
  const codes = await getSwiftCodes();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="border-b border-gray-300 pb-5 mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
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

      <AdSlot className="mb-8" />

      <div className="bg-white border border-gray-200 rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-[#f7f6f2] text-xs font-mono uppercase tracking-wider text-gray-600">
              <th className="py-3.5 px-4">Bank</th>
              <th className="py-3.5 px-4">Country</th>
              <th className="py-3.5 px-4">SWIFT / BIC</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Routing / Local ID</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Typical Wire Fee</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {codes.map((item) => (
              <tr key={item.slug} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4">
                  <Link
                    href={`/swift/${item.slug}`}
                    className="font-semibold text-gray-950 hover:underline"
                  >
                    {item.bank_name}
                  </Link>
                  <div className="text-xs text-gray-500">{item.city}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs uppercase text-gray-600">
                  {item.country}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                  {item.swift_code}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-gray-600 hidden md:table-cell">
                  {item.routing_number || "—"}
                </td>
                <td className="py-3.5 px-4 text-xs text-gray-600 hidden lg:table-cell">
                  {item.wire_fee || "Varies by tier"}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <CopyButton text={item.swift_code} label="Copy" />
                    <Link
                      href={`/swift/${item.slug}`}
                      className="text-xs font-medium text-slate-700 hover:text-slate-950 px-2 py-1"
                    >
                      Guide &rarr;
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
