import { cacheLife } from "next/cache";
import { supabase, isSupabaseConfigured } from "./supabase";
import { SEED_POSTS, SEED_SWIFT_CODES } from "./seed-data";

export async function getPosts({ category, country, limit = 30 } = {}) {
  "use cache";
  cacheLife("minutes");

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (category) {
        query = query.eq("category", category);
      }
      if (country) {
        query = query.eq("country", country);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback gracefully to editorial seed data when database is not yet populated
    }
  }

  let filtered = [...SEED_POSTS];
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (country) {
    filtered = filtered.filter((p) => p.country === country);
  }
  return filtered.slice(0, limit);
}

export async function getPostBySlug(country, slug) {
  "use cache";
  cacheLife("hours");

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("country", country)
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data;
      }
    } catch {
      // Fall through to seed lookup
    }
  }

  return (
    SEED_POSTS.find((p) => p.country === country && p.slug === slug) || null
  );
}

export async function getSwiftCodes({ country, limit = 500 } = {}) {
  "use cache";
  cacheLife("weeks");

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("swift_codes")
        .select("*")
        .order("bank_name", { ascending: true })
        .limit(limit);

      if (country) {
        query = query.eq("country", country);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback to seed SWIFT directory
    }
  }

  if (country) {
    return SEED_SWIFT_CODES.filter((s) => s.country === country);
  }
  return SEED_SWIFT_CODES;
}

export async function getSwiftCountries() {
  "use cache";
  cacheLife("days");

  const codes = await getSwiftCodes({ limit: 5000 });
  const counts = {};
  for (const item of codes) {
    const code = (item.country || "").toLowerCase();
    if (!code) continue;
    counts[code] = (counts[code] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getSwiftBySlug(slug) {
  "use cache";
  cacheLife("weeks");

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("swift_codes")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data;
      }
    } catch {
      // Fallback to seed
    }
  }

  return SEED_SWIFT_CODES.find((s) => s.slug === slug) || null;
}
