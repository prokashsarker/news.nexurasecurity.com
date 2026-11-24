import { notFound } from "next/navigation";
import Link from "next/link";
import { getSwiftBySlug, getSwiftCodes } from "@/lib/data";
import { COUNTRIES } from "@/lib/seed-data";
import CopyButton from "@/components/CopyButton";
import AdSlot from "@/components/AdSlot";

export async function generateStaticParams() {
  const codes = await getSwiftCodes();
  return codes.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getSwiftBySlug(slug);
  if (!data) return {};
  return {
    title: `${data.bank_name} SWIFT Code (${data.swift_code}) & Wire Guide`,
    description: `Official SWIFT/BIC code ${data.swift_code} for ${data.bank_name} in ${data.city}. Includes routing details, wire fees, and transfer checklist.`,
  };
}

export default async function SwiftDetailPage({ params }) {
  const { slug } = await params;
  const data = await getSwiftBySlug(slug);
  if (!data) return notFound();

  const countryInfo = COUNTRIES[data.country] || COUNTRIES.us;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-6 flex gap-2">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/swift" className="hover:text-gray-900">
          SWIFT Directory
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{data.swift_code}</span>
      </nav>

      <article className="bg-white border border-gray-200 rounded-sm p-6 sm:p-10">
        <span className="font-mono text-xs uppercase tracking-widest text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-sm">
          {countryInfo.name} • Wire Reference
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mt-3">
          {data.bank_name} SWIFT / BIC Code:{" "}
          <span className="font-mono text-slate-900">{data.swift_code}</span>
        </h1>

        <div className="my-6 border border-gray-200 bg-[#f7f6f2] rounded-sm p-5 space-y-3 text-sm">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 gap-2">
            <span className="text-gray-600 font-medium">SWIFT / BIC Code</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-bold text-slate-950">
                {data.swift_code}
              </span>
              <CopyButton text={data.swift_code} label="Copy Code" />
            </div>
          </div>

          {data.routing_number && (
            <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 gap-2">
              <span className="text-gray-600 font-medium">
                Routing / Local Code
              </span>
              <span className="font-mono font-semibold text-gray-900">
                {data.routing_number}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 gap-2">
            <span className="text-gray-600 font-medium">City &amp; Country</span>
            <span className="text-gray-900">
              {data.city}, {countryInfo.name}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 gap-2">
            <span className="text-gray-600 font-medium">Head Office Address</span>
            <span className="text-gray-900 text-right">{data.address}</span>
          </div>

          {data.wire_fee && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-gray-600 font-medium">
                Standard Wire Fees
              </span>
              <span className="text-gray-900 font-medium">{data.wire_fee}</span>
            </div>
          )}
        </div>

        <AdSlot className="my-6" />

        <div
          className="editorial-prose"
          dangerouslySetInnerHTML={{ __html: data.guide_html }}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
          Note: Always confirm branch-specific wire instructions and intermediary
          bank requirements inside your online banking portal before sending funds.
        </div>
      </article>
    </main>
  );
}
