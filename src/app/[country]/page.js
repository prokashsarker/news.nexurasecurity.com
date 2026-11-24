import { notFound } from "next/navigation";
import Link from "next/link";
import { getPosts, getSwiftCodes } from "@/lib/data";
import { COUNTRIES } from "@/lib/seed-data";
import ArticleCard from "@/components/ArticleCard";
import SwiftQuickLookup from "@/components/SwiftQuickLookup";
import AdSlot from "@/components/AdSlot";

const VALID_COUNTRIES = ["us", "uk", "ca", "au"];

export function generateStaticParams() {
  return VALID_COUNTRIES.map((country) => ({ country }));
}

export async function generateMetadata({ params }) {
  const { country } = await params;
  const info = COUNTRIES[country];
  if (!info || !VALID_COUNTRIES.includes(country)) return {};
  return {
    title: `${info.name} Banking, Breach & Settlement Advisories`,
    description: `Latest verified financial notices, consumer settlements, data breach alerts, and bank wire codes for ${info.name}.`,
  };
}

export default async function CountryEditionPage({ params }) {
  const { country } = await params;
  if (!VALID_COUNTRIES.includes(country)) return notFound();

  const info = COUNTRIES[country];
  const [posts, swiftCodes] = await Promise.all([
    getPosts({ country, limit: 24 }),
    getSwiftCodes({ country }),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="border-b border-gray-300 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
            Regional Edition • {info.currency}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mt-1">
            {info.name} Dispatches
          </h1>
          <p className="text-gray-600 text-sm mt-2 max-w-2xl">
            Banking notices, interest rate changes, security alerts, and
            consumer claim updates affecting residents in {info.name}.
          </p>
        </div>
        <Link
          href="/swift"
          className="text-xs font-semibold px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded-sm self-start"
        >
          View {info.short} SWIFT Codes &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {posts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-sm text-gray-600">
              No dispatches published for {info.name} yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <SwiftQuickLookup codes={swiftCodes} />
          <AdSlot />
        </aside>
      </div>
    </main>
  );
}
