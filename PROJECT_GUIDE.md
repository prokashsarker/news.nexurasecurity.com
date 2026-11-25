# Nexura Dispatch (`news.nexurasecurity.com`) — Project & Architecture Guide

This document is the single source of truth for the architecture, database schema, automation bot, SEO/Discover setup, and operational workflows of **Nexura Dispatch**.

---

## 1. Overview & Live Infrastructure

- **Production Domain:** `https://news.nexurasecurity.com` (Cloudflare DNS `CNAME` with Proxy disabled / `DNS only` -> Vercel)
- **GitHub Repository:** `https://github.com/prokashsarker/news.nexurasecurity.com.git` (`main` branch)
- **Framework:** Next.js `16.4.6` (App Router, `cacheComponents: true` in `next.config.mjs`), React `19.3.0`, Tailwind CSS `4.3.3`
- **Database:** Supabase (`nexurasecurity news` project)
- **AI Engine:** Google Gemini API (`@google/generative-ai`)
- **Automation:** GitHub Actions (`.github/workflows/daily-bot.yml`)

---

## 2. Next.js 16 Architecture & Important Rules

1. **Caching (`cacheComponents: true`):**
   - Do **not** use legacy `export const revalidate = ...` in page/layout files; it is incompatible with `cacheComponents: true`.
   - Data fetching in `src/lib/data.js` uses `'use cache'` with `cacheLife("minutes")` (`getPosts`), `cacheLife("hours")` (`getPostBySlug`), `cacheLife("days")` (`getSwiftCountries`), and `cacheLife("weeks")` (`getSwiftCodes`, `getSwiftBySlug`).
2. **Dynamic Routes & `<Suspense>`:**
   - Next.js 16 passes `params` as a `Promise` (`await params`).
   - Dynamic routes (`src/app/[country]/[slug]/page.js`, `src/app/swift/[slug]/page.js`, `src/app/swift/country/[country]/page.js`) wrap async content in `<Suspense>` so newly published bot posts and newly imported SWIFT codes render at request time without waiting for a rebuild.
3. **Local Windows Build:**
   - Run `npx next build --webpack` locally on Windows (and `npm run lint` to verify). Vercel runs standard `next build` on Linux.

---

## 3. Supabase Database (`supabase/schema.sql`)

Tables in `public` schema:
- **`posts`**: Automated news dispatches (`id`, `title`, `slug`, `category`, `country`, `bank_or_entity`, `summary`, `key_takeaways`, `content_html`, `source_url`, `source_name`, `image_url`, `read_time`, `created_at`).
- **`swift_codes`**: Global SWIFT/BIC directory (`id`, `bank_name`, `swift_code`, `routing_number`, `country`, `city`, `address`, `wire_fee`, `slug`, `guide_html`, `created_at`).
  - `country` accepts any 2-letter lowercase code (`us`, `uk`, `ca`, `au`, `de`, `sg`, etc.).
  - `guide_html` is nullable so bulk-imported banks store compact metadata only (~250 bytes/row) and `/swift/[slug]` dynamically generates the wire transfer guide, BIC breakdown, and FAQ.
- **Permissions:** Public `SELECT` RLS policies + `GRANT SELECT` to `anon, authenticated` and `GRANT ALL` to `service_role`.

---

## 4. Automated Editorial Bot (`scripts/bot.mjs` & `.github/workflows/daily-bot.yml`)

- **Schedule (Node.js 22+ required for `@supabase/supabase-js`):**
  - Primary cron: `23 13 * * *` (13:23 UTC / 7:23 PM BST)
  - Backup cron: `41 19 * * *` (19:41 UTC / 1:41 AM BST)
  - Manual trigger: `workflow_dispatch`
- **Daily Cap Guard:** At startup, `runBot()` counts rows in `posts` created since `00:00:00 UTC` of the current day. Once `MAX_POSTS_PER_RUN` (`3`) is reached, backup runs exit immediately without duplicate posting.
- **Models & JSON Mode:** Uses `MODEL_CANDIDATES` (`gemini-3.5-flash`, `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.5-flash-lite`) with `responseMimeType: "application/json"` and `temperature: 0.4`.
- **Manual Extra Posts:** Run `node --env-file=.env.local scripts/bot.mjs --extra=2` to publish extra posts on demand without bypassing normal daily cron caps.
- **Categories & Rich Feeds:** Covers `bank_alert`, `data_breach` (BleepingComputer, CISA, The Hacker News, SecurityWeek), `web_security` (Wordfence, Patchstack), `settlement` (Top Class Actions), `insurance`, and `saas`.
- **Editorial & AdSense Safety Rules:**
  - Enforces zero fabrication, varied sentence rhythm, active voice, and bans common AI clichés.
  - Strict AdSense anti-exploit guard: never includes exploit code, attack payloads, shell commands, or how-to-hack instructions; focuses strictly on factual incident reporting and defensive mitigation.
  - Filters out off-topic items (`{"skip": true}`) and assigns beat desk bylines (`DESK_BYLINES` in `src/components/ArticleCard.js`).

---

## 5. Phased Global SWIFT Directory (`scripts/import-swift.mjs`)

- **Source:** `PeterNotenboom/SwiftCodes` (`master/AllCountries/<ISO>.json` on GitHub).
- **Phase 1 (Completed):** 200 Tier-1 head-office banks (50 each for `US`, `GB`->`uk`, `CA`, `AU`) + 12 curated banks (`scripts/seed-swift.mjs`).
- **Phase 2/3 Expansion Command (run locally after indexing grows):**
  ```bash
  node --env-file=.env.local scripts/import-swift.mjs --countries=DE,FR,NL,CH,SG,AE,IN,BD --limit=100
  ```
- **Country Hubs & Directory UI:** `/swift` and `/swift/country/[country]` (supports both 2-letter codes like `/us` and full-name aliases like `/united-states` via `resolveCountryCode` in `src/lib/seed-data.js`), powered by `SwiftDirectoryTable.js` with instant search and 25-per-page pagination.
- **Bidirectional Internal Linking:** `findMatchingSwiftForPost` and `findMatchingPostsForSwift` (`src/lib/seed-data.js`) automatically cross-link news articles (`src/app/[country]/[slug]/page.js`) and SWIFT pages (`src/app/swift/[slug]/page.js`).

---

## 6. SEO, Google Discover, AdSense & Accessibility

- **Dynamic `1200x675` Covers (`/api/og`):** `src/app/api/og/route.js` generates a unique, cached (`immutable`) `1200x675` PNG cover per article using its headline, entity, country, and category theme (`getPostOgImageUrl` in `src/lib/seed-data.js`).
- **Google Discover & Webmasters:** `max-image-preview: "large"` + Bing `msvalidate.01` verification in `src/app/layout.js`, `openGraph.images` + `twitter.images` + `NewsArticle` JSON-LD (`image`, `datePublished`, `author`, `publisher.logo`) in `src/app/[country]/[slug]/page.js`.
- **Favicons:** `48x48` (`public/icon-48.png`) and `192x192` (`public/icon-192.png`, `src/app/icon.png`) square PNGs + `WebSite` JSON-LD in `src/app/layout.js`.
- **Sitemaps & Discovery:** `/sitemap.xml` (`src/app/sitemap.js`), `/robots.txt` (`src/app/robots.txt`), `public/.well-known/ai-catalog.json`, `public/ai-catalog.json`.
- **AdSense Readiness:** `/about`, `/contact`, `/privacy-policy`, `/disclaimer`, `public/ads.txt`, and `src/components/AdSlot.js`.
- **UI & Accessibility:** Desktop editorial masthead + mobile slide-out drawer (`src/components/MobileNavDrawer.js`), labeled inputs (`LoanCalculator.js`, `SwiftQuickLookup.js`), and WCAG-compliant text contrast.

---

## 7. Required Environment Variables & Secrets

*(Store actual values only in `.env.local`, Vercel Environment Variables, and GitHub Repository Secrets — never commit secrets to Git.)*

- **Vercel (Config):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (`https://news.nexurasecurity.com`)
- **GitHub Actions Secrets:** `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
