import { notFound } from "next/navigation";
import { getPosts } from "@/lib/data";
import { CATEGORIES } from "@/lib/seed-data";
import ArticleCard from "@/components/ArticleCard";
import AdSlot from "@/components/AdSlot";

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) return {};
  return {
    title: `${cat.label} — News & Advisories`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) return notFound();

  const posts = await getPosts({ category, limit: 24 });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="border-b border-gray-300 pb-5 mb-8">
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-0.5 border rounded-sm mb-3 ${cat.accent}`}
        >
          Coverage Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950">
          {cat.label}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
          {cat.description}
        </p>
      </div>

      <AdSlot className="mb-8" />

      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-sm text-gray-600">
          No dispatches have been filed under {cat.label} yet. Check back shortly.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
