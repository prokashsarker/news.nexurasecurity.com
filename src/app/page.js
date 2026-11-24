import Link from "next/link";
import { getPosts, getSwiftCodes } from "@/lib/data";
import { CATEGORIES } from "@/lib/seed-data";
import ArticleCard from "@/components/ArticleCard";
import SwiftQuickLookup from "@/components/SwiftQuickLookup";
import LoanCalculator from "@/components/LoanCalculator";
import AdSlot from "@/components/AdSlot";

export default async function HomePage() {
  const [posts, swiftCodes] = await Promise.all([
    getPosts({ limit: 15 }),
    getSwiftCodes(),
  ]);

  const leadStory = posts[0];
  const secondaryStories = posts.slice(1, 7);
  const archiveStories = posts.slice(7, 13);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top AdSlot */}
      <AdSlot className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Editorial Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Lead Story */}
          {leadStory && (
            <section aria-labelledby="lead-story-heading">
              <div className="flex items-center justify-between border-b border-gray-900 pb-2 mb-4">
                <h1
                  id="lead-story-heading"
                  className="text-xs font-mono uppercase tracking-widest text-gray-900 font-semibold"
                >
                  Lead Dispatch
                </h1>
                <span className="text-xs text-gray-500">
                  Verified Advisories &amp; Filings
                </span>
              </div>
              <ArticleCard post={leadStory} featured />
            </section>
          )}

          {/* Recent Dispatches Grid */}
          <section aria-labelledby="recent-dispatches-heading">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
              <h2
                id="recent-dispatches-heading"
                className="font-serif text-xl font-bold text-gray-950"
              >
                Latest Advisories &amp; Coverage
              </h2>
              <Link
                href="/us"
                className="text-xs font-medium text-slate-700 hover:text-slate-950"
              >
                Browse US Edition &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {secondaryStories.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

          {/* Category Quick Index */}
          <section className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="font-serif text-lg font-bold text-gray-950 mb-4">
              Coverage Desks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(CATEGORIES).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="p-3.5 border border-gray-100 hover:border-gray-300 rounded-sm transition-colors block"
                >
                  <span
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 border rounded-sm mb-1.5 ${cat.accent}`}
                  >
                    {cat.label}
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {archiveStories.length > 0 && (
            <section>
              <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
                <h2 className="font-serif text-xl font-bold text-gray-950">
                  Earlier Reports
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {archiveStories.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Utility & Reference Rail */}
        <aside className="lg:col-span-4 space-y-6">
          <SwiftQuickLookup codes={swiftCodes} />
          <AdSlot label="Sponsored" />
          <LoanCalculator />

          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="font-serif text-base font-bold text-gray-900">
              How We Verify Reports
            </h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Every banking notice, breach advisory, and class-action settlement
              published on Nexura Dispatch links directly to primary regulatory
              filings, court dockets, or official bank security centers.
            </p>
            <Link
              href="/about"
              className="inline-block mt-3 text-xs font-semibold text-slate-900 hover:underline"
            >
              Read Editorial Policy &rarr;
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
