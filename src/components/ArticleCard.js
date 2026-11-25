import Link from "next/link";
import { CATEGORIES, COUNTRIES, getPostOgImageUrl } from "@/lib/seed-data";

export const DESK_BYLINES = {
  bank_alert: "Retail Banking Desk",
  data_breach: "Cyber & Breach Desk",
  web_security: "Web & WP Security Desk",
  settlement: "Consumer Claims Desk",
  insurance: "Insurance & Risk Desk",
  saas: "Cloud & Infrastructure Desk",
};

export function formatDispatchDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return "";
  }
}

export default function ArticleCard({ post, featured = false }) {
  const category = CATEGORIES[post.category] || CATEGORIES.bank_alert;
  const country = COUNTRIES[post.country] || COUNTRIES.global;
  const href = `/${post.country}/${post.slug}`;
  const coverUrl = getPostOgImageUrl(post, { compact: !featured });

  if (featured) {
    return (
      <article className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="grid md:grid-cols-12">
          <div className="md:col-span-6 bg-slate-950 flex items-center justify-center">
            <img
              src={coverUrl}
              alt={post.title}
              width={1200}
              height={675}
              fetchPriority="high"
              className="w-full aspect-[16/9] object-contain"
            />
          </div>
          <div className="md:col-span-6 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                <span
                  className={`px-2 py-0.5 font-semibold border rounded-sm ${category.accent}`}
                >
                  {category.label}
                </span>
                <span className="font-mono text-gray-500 uppercase">
                  {country.short} • {post.bank_or_entity}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950 leading-tight">
                <Link href={href} className="hover:underline decoration-1 underline-offset-4">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
                {post.summary}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>
                By {DESK_BYLINES[post.category] || "Nexura Research Desk"} • {formatDispatchDate(post.created_at)}
              </span>
              <span className="font-mono">{post.read_time || "3 min read"}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors">
      <div>
        <Link href={href} className="block bg-slate-900 aspect-[16/9] overflow-hidden border-b border-gray-100">
          <img
            src={coverUrl}
            alt={post.title}
            width={640}
            height={360}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="p-5">
          <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
            <span
              className={`px-2 py-0.5 font-semibold border rounded-sm ${category.accent}`}
            >
              {category.shortLabel}
            </span>
            <span className="font-mono text-gray-500 uppercase text-[11px]">
              {country.short}
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-950 leading-snug">
            <Link href={href} className="hover:underline decoration-1 underline-offset-4">
              {post.title}
            </Link>
          </h3>
          <p className="text-gray-600 text-sm mt-2 leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        </div>
      </div>
      <div className="px-5 pb-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="truncate max-w-[180px]">{post.bank_or_entity}</span>
        <span>{formatDispatchDate(post.created_at)}</span>
      </div>
    </article>
  );
}
