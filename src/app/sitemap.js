import { getPosts, getSwiftCodes, getSwiftCountries } from "@/lib/data";
import { CATEGORIES } from "@/lib/seed-data";

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://news.nexurasecurity.com";

  const [posts, swiftCodes, swiftCountries] = await Promise.all([
    getPosts({ limit: 500 }),
    getSwiftCodes({ limit: 5000 }),
    getSwiftCountries(),
  ]);

  const staticRoutes = [
    "",
    "/us",
    "/uk",
    "/ca",
    "/au",
    "/swift",
    "/about",
    "/contact",
    "/privacy-policy",
    "/disclaimer",
    ...Object.keys(CATEGORIES).map((c) => `/category/${c}`),
    ...swiftCountries.map((c) => `/swift/country/${c.code}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "hourly" : "daily",
    priority: route === "" ? 1.0 : 0.7,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/${post.country}/${post.slug}`,
    lastModified: new Date(post.created_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const swiftRoutes = swiftCodes.map((item) => ({
    url: `${baseUrl}/swift/${item.slug}`,
    lastModified: new Date(item.created_at || Date.now()),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes, ...swiftRoutes];
}
