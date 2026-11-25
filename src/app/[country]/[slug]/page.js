import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { getPostBySlug, getPosts, getSwiftCodes } from "@/lib/data";
import {
  CATEGORIES,
  COUNTRIES,
  findMatchingSwiftForPost,
  getPostOgImageUrl,
} from "@/lib/seed-data";
import { DESK_BYLINES, formatDispatchDate } from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";

export async function generateStaticParams() {
  const posts = await getPosts({ limit: 50 });
  return posts.map((post) => ({
    country: post.country,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { country, slug } = await params;
  const post = await getPostBySlug(country, slug);
  if (!post) return {};
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://news.nexurasecurity.com";
  const absoluteImageUrl = `${siteUrl}${getPostOgImageUrl(post)}`;

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.created_at,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 675,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [absoluteImageUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-sm text-gray-500">
          Loading dispatch...
        </main>
      }
    >
      <ArticleDetailContent params={params} />
    </Suspense>
  );
}

async function ArticleDetailContent({ params }) {
  const { country, slug } = await params;
  const post = await getPostBySlug(country, slug);
  if (!post) return notFound();

  const category = CATEGORIES[post.category] || CATEGORIES.bank_alert;
  const countryInfo = COUNTRIES[post.country] || COUNTRIES.global;
  const deskName = DESK_BYLINES[post.category] || "Nexura Research Desk";
  const [relatedRaw, allSwift] = await Promise.all([
    getPosts({ category: post.category, limit: 4 }),
    getSwiftCodes({ limit: 250 }),
  ]);
  const related = relatedRaw.filter((p) => p.slug !== post.slug).slice(0, 3);
  const matchedSwift = findMatchingSwiftForPost(post, allSwift);

  const takeaways = Array.isArray(post.key_takeaways) ? post.key_takeaways : [];

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://news.nexurasecurity.com";
  const ogImagePath = getPostOgImageUrl(post);
  const absoluteImageUrl = `${siteUrl}${ogImagePath}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.summary,
    image: [absoluteImageUrl],
    datePublished: post.created_at,
    dateModified: post.created_at,
    author: {
      "@type": "Organization",
      name: deskName,
    },
    publisher: {
      "@type": "Organization",
      name: "Nexura Dispatch",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-xs text-gray-500 mb-6 flex items-center gap-2"
      >
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span>/</span>
        <Link href={`/category/${post.category}`} className="hover:text-gray-900">
          {category.label}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium uppercase">
          {countryInfo.short}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <article className="lg:col-span-8 bg-white border border-gray-200 rounded-sm p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2.5 text-xs mb-4">
            <span
              className={`px-2.5 py-0.5 font-semibold border rounded-sm ${category.accent}`}
            >
              {category.label}
            </span>
            <span className="font-mono text-gray-500 uppercase">
              {countryInfo.name} • {post.bank_or_entity}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mt-4 leading-relaxed">
            {post.summary}
          </p>

          <div className="mt-5 pb-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>
              By <strong className="text-gray-800">{deskName}</strong>{" "}
              • Published {formatDispatchDate(post.created_at)}
            </span>
            <span className="font-mono">{post.read_time || "3 min read"}</span>
          </div>

          {/* Editorial Graphic */}
          <div className="my-6 border border-gray-200 rounded-sm overflow-hidden bg-slate-950">
            <img
              src={ogImagePath}
              alt={post.title}
              className="w-full aspect-[16/9] object-contain"
            />
          </div>

          {/* Key Takeaways Box */}
          {takeaways.length > 0 && (
            <div className="my-6 bg-[#f7f6f2] border-l-4 border-slate-900 p-5 rounded-r-sm">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-800 font-bold mb-2.5">
                Key Takeaways
              </h2>
              <ul className="space-y-2 text-sm text-gray-800 list-disc pl-4">
                {takeaways.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AdSlot className="my-6" />

          {/* Article Body */}
          <div
            className="editorial-prose mt-6"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />

          {/* Official Source & Disclaimer */}
          <div className="mt-10 pt-6 border-t border-gray-200 space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
                  Primary Reference
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {post.source_name || post.bank_or_entity}
                </p>
              </div>
              <a
                href={post.source_url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-sm transition-colors self-start sm:self-auto"
              >
                View Official Notice <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-gray-500 bg-[#faf9f6] border border-gray-200 p-4 rounded-sm leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Editorial Disclaimer:</strong> This report is published
                for informational purposes only and does not constitute
                financial, legal, or security advice. Nexura Dispatch is not
                affiliated with {post.bank_or_entity}. Verify current rates,
                claim eligibility, and security instructions directly with the
                official institution.
              </p>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <AdSlot label="Advertisement" />

          {related.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <h3 className="font-serif text-lg font-bold text-gray-950 mb-4">
                Related in {category.label}
              </h3>
              <div className="divide-y divide-gray-100">
                {related.map((item) => (
                  <div key={item.slug} className="py-3 first:pt-0 last:pb-0">
                    <span className="text-[11px] font-mono uppercase text-gray-500">
                      {item.country} • {item.bank_or_entity}
                    </span>
                    <Link
                      href={`/${item.country}/${item.slug}`}
                      className="block text-sm font-serif font-bold text-gray-900 hover:underline mt-0.5 leading-snug"
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedSwift.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <h3 className="font-serif text-base font-bold text-gray-950 mb-3">
                Related Bank Wire Codes
              </h3>
              <div className="divide-y divide-gray-100">
                {matchedSwift.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/swift/${item.slug}`}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2 hover:underline"
                  >
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {item.bank_name}
                    </span>
                    <span className="font-mono text-xs font-bold text-teal-800 shrink-0">
                      {item.swift_code}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-sm p-5">
            <h3 className="font-serif text-base font-bold text-gray-900">
              Need a Bank Wire Code?
            </h3>
            <p className="text-xs text-gray-600 mt-1.5 mb-3">
              Look up verified SWIFT/BIC codes, ABA routing numbers, and wire
              transfer fees.
            </p>
            <Link
              href="/swift"
              className="inline-block text-xs font-semibold px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-sm"
            >
              Open SWIFT Directory &rarr;
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
