import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSwiftBySlug, getSwiftCodes, getPosts } from "@/lib/data";
import {
  getCountryDisplayName,
  findMatchingPostsForSwift,
} from "@/lib/seed-data";
import CopyButton from "@/components/CopyButton";
import AdSlot from "@/components/AdSlot";

export async function generateStaticParams() {
  const codes = await getSwiftCodes({ limit: 100 });
  return codes.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getSwiftBySlug(slug);
  if (!data) return {};
  return {
    title: `${data.bank_name} SWIFT Code (${data.swift_code}) & Wire Guide`,
    description: `Official SWIFT/BIC code ${data.swift_code} for ${data.bank_name} in ${data.city}. Includes BIC breakdown, routing details, and wire transfer checklist.`,
  };
}

function buildDynamicGuideHtml(data, countryName) {
  const code = (data.swift_code || "").toUpperCase();
  const bankChars = code.slice(0, 4);
  const countryChars = code.slice(4, 6);
  const locationChars = code.slice(6, 8);
  const branchChars = code.length === 11 ? code.slice(8, 11) : "XXX (Primary Office)";

  return `
    <h2>How to Use ${code} for International Wires</h2>
    <p>When sending or receiving an international wire transfer with <strong>${data.bank_name}</strong> in ${data.city}, ${countryName}, provide the sending institution with the SWIFT/BIC code <strong>${code}</strong> alongside the beneficiary's full legal name and account number (or IBAN where applicable).</p>
    <h2>SWIFT / BIC Code Structure Breakdown</h2>
    <ul>
      <li><strong>Bank Code (${bankChars}):</strong> Identifies ${data.bank_name} on the global SWIFT network.</li>
      <li><strong>Country Code (${countryChars}):</strong> Represents ${countryName}.</li>
      <li><strong>Location Code (${locationChars}):</strong> Designates the primary clearing hub (${data.city}).</li>
      <li><strong>Branch Code (${branchChars}):</strong> Identifies the specific branch or head office.</li>
    </ul>
    <h2>Frequently Asked Questions</h2>
    <h3>Should I use an 8-character or 11-character SWIFT code?</h3>
    <p>If a transfer form requires 11 characters and your code is 8 characters, append <code>XXX</code> to target the institution's primary head office (${code.length === 8 ? code + "XXX" : code}).</p>
    <h3>How long do international wires to ${data.bank_name} take?</h3>
    <p>Most SWIFT transfers settle within 1 to 3 business days depending on intermediary correspondent banks, currency conversion cutoffs, and compliance screening.</p>
  `;
}

export default async function SwiftDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-sm text-gray-600">
          Loading SWIFT reference...
        </main>
      }
    >
      <SwiftDetailContent params={params} />
    </Suspense>
  );
}

function formatCityName(city) {
  return (city || "").replace(/,([A-Za-z]{2})\b/g, (_, st) => `, ${st.toUpperCase()}`).trim();
}

function isRealStreetAddress(address, city) {
  if (!address) return false;
  const cleanAddr = address.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanCity = (city || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!cleanAddr || cleanAddr === cleanCity) return false;
  if (cleanCity && cleanAddr.startsWith(cleanCity) && cleanAddr.length - cleanCity.length < 18) {
    return false;
  }
  return true;
}

async function SwiftDetailContent({ params }) {
  const { slug } = await params;
  const [data, recentPosts] = await Promise.all([
    getSwiftBySlug(slug),
    getPosts({ limit: 40 }),
  ]);
  if (!data) return notFound();

  const countryName = getCountryDisplayName(data.country);
  const displayCity = formatCityName(data.city);
  const hasStreetAddress = isRealStreetAddress(data.address, data.city);
  const isHeadOffice =
    (data.swift_code || "").length === 8 ||
    (data.swift_code || "").toUpperCase().endsWith("XXX");
  const guideHtml = data.guide_html || buildDynamicGuideHtml(data, countryName);
  const relatedNews = findMatchingPostsForSwift(data, recentPosts);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex flex-wrap gap-2">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/swift" className="hover:text-gray-900">
          SWIFT Directory
        </Link>
        <span>/</span>
        <Link href={`/swift/country/${data.country}`} className="hover:text-gray-900">
          {countryName}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{data.swift_code}</span>
      </nav>

      <article className="bg-white border border-gray-200 rounded-sm p-6 sm:p-10">
        <span className="font-mono text-xs uppercase tracking-widest text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-sm">
          {countryName} • Wire Reference
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
              {displayCity}, {countryName}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-3 gap-2">
            <span className="text-gray-600 font-medium">
              {hasStreetAddress ? "Head Office Address" : "Office Type"}
            </span>
            <span className="text-gray-900 text-right">
              {hasStreetAddress
                ? data.address
                : isHeadOffice
                  ? "Primary / Head Office"
                  : "Registered Branch Office"}
            </span>
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
          dangerouslySetInnerHTML={{ __html: guideHtml }}
        />

        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-600">
          Note: Always confirm branch-specific wire instructions and intermediary
          bank requirements inside your online banking portal before sending funds.
        </div>

        {relatedNews.length > 0 && (
          <section className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="font-serif text-xl font-bold text-gray-950 mb-4">
              Recent Banking &amp; Security Dispatches ({countryName})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedNews.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.country}/${item.slug}`}
                  className="p-4 border border-gray-200 bg-[#faf9f6] hover:border-gray-400 rounded-sm transition-colors block"
                >
                  <span className="font-mono text-[11px] uppercase text-gray-600">
                    {item.bank_or_entity}
                  </span>
                  <h3 className="font-serif text-base font-bold text-gray-950 mt-1 leading-snug">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
