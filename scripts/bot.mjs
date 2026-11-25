import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import slugify from "slugify";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GEMINI_API_KEY) {
  console.error(
    "Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY"
  );
  process.exit(1);
}

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "NexuraDispatchBot/1.0 (+https://news.nexurasecurity.com)",
  },
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const MAX_POSTS_PER_RUN = 3;

const CATEGORY_IMAGES = {
  bank_alert: "/images/bank-alert.png",
  data_breach: "/images/data-breach.png",
  settlement: "/images/settlement.png",
  insurance: "/images/insurance.png",
  saas: "/images/saas.png",
};

// Rich official/editorial RSS feeds + targeted Google News feeds
const SOURCES = [
  {
    country: "us",
    category: "settlement",
    label: "US Class Action Settlements",
    url: "https://topclassactions.com/feed/",
  },
  {
    country: "us",
    category: "data_breach",
    label: "Cybersecurity & Data Breaches",
    url: "https://www.bleepingcomputer.com/feed/",
  },
  {
    country: "us",
    category: "data_breach",
    label: "CISA Security Advisories",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
  },
  {
    country: "us",
    category: "bank_alert",
    label: "US Retail Banking",
    url: 'https://news.google.com/rss/search?q=(Chase+OR+"Bank+of+America"+OR+"Wells+Fargo"+OR+Citibank)+(rate+OR+mortgage+OR+scam+OR+wire+OR+alert)&hl=en-US&gl=US&ceid=US:en',
  },
  {
    country: "uk",
    category: "bank_alert",
    label: "UK Banking & Fraud Alerts",
    url: 'https://news.google.com/rss/search?q=(HSBC+OR+Barclays+OR+Lloyds+OR+NatWest)+(scam+OR+rate+OR+mortgage+OR+alert)&hl=en-GB&gl=GB&ceid=GB:en',
  },
  {
    country: "us",
    category: "insurance",
    label: "Insurance & Cyber Risk",
    url: 'https://news.google.com/rss/search?q=("cyber+insurance"+OR+"auto+insurance+rates"+OR+"home+insurance")+(underwriting+OR+premium+OR+update)&hl=en-US&gl=US&ceid=US:en',
  },
  {
    country: "ca",
    category: "bank_alert",
    label: "Canada Banking & Mortgages",
    url: 'https://news.google.com/rss/search?q=(RBC+OR+"TD+Bank"+OR+Scotiabank+OR+BMO)+(mortgage+OR+rate+OR+alert+OR+fraud)&hl=en-CA&gl=CA&ceid=CA:en',
  },
  {
    country: "au",
    category: "bank_alert",
    label: "Australia Banking & Scams",
    url: 'https://news.google.com/rss/search?q=(CommBank+OR+Westpac+OR+ANZ+OR+NAB)+("home+loan"+OR+rate+OR+scam+OR+alert)&hl=en-AU&gl=AU&ceid=AU:en',
  },
  {
    country: "global",
    category: "saas",
    label: "SaaS & Cloud Infrastructure",
    url: 'https://news.google.com/rss/search?q=(Cloudflare+OR+AWS+OR+Stripe+OR+Okta)+(outage+OR+security+advisory+OR+vulnerability)&hl=en-US&gl=US&ceid=US:en',
  },
];

// Verified models on this project's Gemini API key with fallback
const MODEL_CANDIDATES = [
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function extractPublisher(rawTitle) {
  const parts = rawTitle.split(" - ");
  if (parts.length > 1) {
    const publisher = parts.pop().trim();
    return { cleanTitle: parts.join(" - ").trim(), publisher };
  }
  return { cleanTitle: rawTitle.trim(), publisher: "" };
}

async function generateArticle(source, item) {
  const { cleanTitle, publisher } = extractPublisher(item.title || "");
  const rawText = (
    item["content:encoded"] ||
    item.contentSnippet ||
    item.content ||
    cleanTitle
  )
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);

  const prompt = `
You are a veteran beat reporter for Nexura Dispatch, an independent financial and security newsroom covering the US, UK, Canada, and Australia.

Write a factual, practical news report based on the source material below.

Category: ${source.category}
Country/Edition: ${source.country.toUpperCase()}
Original Headline: ${cleanTitle}
Publisher Hint: ${publisher || source.label}
Source Details: ${rawText}

Strict Editorial & Anti-AI Rules:
1. ZERO FABRICATION: Never invent fake dollar figures, fake claim deadlines, fake interest rates, or fake quotes. Stick strictly to the verified facts in the source. If the source snippet is brief, add genuinely helpful, factual consumer guidance (e.g., how customers verify official bank notices, standard steps to protect accounts, or what terms in the announcement mean) rather than repeating the headline.
2. HUMAN NEWSROOM TONE:
   - Open directly with the concrete news (the bank, company, agency, or action). Never start with "In today's digital world..." or "As cyber threats grow...".
   - Mix crisp 8-12 word sentences with 16-22 word sentences. Use active voice.
   - FORBIDDEN WORDS: delve, tapestry, landscape, underscore, crucial, vital, pivotal, moreover, furthermore, additionally, in conclusion, it is worth noting, importantly, navigate, robust, comprehensive, seamlessly, foster, empower, ever-evolving, game-changer, testament, stay vigilant.
   - Use specific, story-driven <h2> headings (never generic "Overview" or "Conclusion").
3. OUTPUT FIELDS:
   - "bank_or_entity": Specific bank, company, or agency name (e.g., "Bank of America", "CISA", "HSBC UK").
   - "title": Tight, factual headline (max 90 chars, no clickbait).
   - "summary": 1-2 direct sentences summarizing the news (max 185 chars).
   - "key_takeaways": 3 short, actionable bullet strings.
   - "content_html": 380-520 words formatted cleanly with ONLY <p>, <h2>, <ul>, <li>, and <strong> tags.
   - "source_name": Name of the original reporting outlet or agency.
4. RELEVANCE FILTER: If the story is unrelated to banking, personal finance, cybersecurity, data breaches, consumer settlements, insurance, or SaaS infrastructure, return ONLY {"skip": true}.
`;

  let lastError;
  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });
      const result = await model.generateContent(prompt);
      const rawJson = result.response.text().trim();
      return JSON.parse(rawJson);
    } catch (err) {
      lastError = err;
      console.warn(
        `Model ${modelName} failed (${err.message.slice(0, 80)}), trying fallback...`
      );
      await sleep(1500);
    }
  }
  throw lastError;
}

async function runBot() {
  // Check how many posts were already published today (UTC) so backup cron runs never exceed 3/day
  const startOfUtcDay = new Date();
  startOfUtcDay.setUTCHours(0, 0, 0, 0);
  const { count: todayCount, error: countError } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startOfUtcDay.toISOString());

  if (!countError && (todayCount ?? 0) >= MAX_POSTS_PER_RUN) {
    console.log(
      `Daily limit (${MAX_POSTS_PER_RUN} posts) already reached today (${todayCount}). Skipping run.`
    );
    return;
  }

  let publishedCount = todayCount ?? 0;

  // Rotate sources daily so all niches get balanced coverage
  const dayOffset = new Date().getUTCDate() % SOURCES.length;
  const orderedSources = [
    ...SOURCES.slice(dayOffset),
    ...SOURCES.slice(0, dayOffset),
  ];

  for (const source of orderedSources) {
    if (publishedCount >= MAX_POSTS_PER_RUN) break;

    try {
      const feed = await parser.parseURL(source.url);
      const candidates = (feed.items || []).slice(0, 4);

      for (const item of candidates) {
        if (publishedCount >= MAX_POSTS_PER_RUN) break;
        if (!item.link || !item.title) continue;

        // Check if already published
        const { data: existing } = await supabase
          .from("posts")
          .select("id")
          .eq("source_url", item.link)
          .maybeSingle();

        if (existing) continue;

        console.log(`[${source.label}] Generating: ${item.title}`);
        const article = await generateArticle(source, item);
        if (article?.skip) {
          console.log(`Skipped off-topic item: ${item.title}`);
          continue;
        }
        if (!article?.title || !article?.content_html || !article?.summary) {
          console.warn(`Incomplete article JSON for: ${item.title}`);
          continue;
        }

        const baseSlug =
          slugify(article.title, { lower: true, strict: true }) ||
          "nexura-alert";
        const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        const wordCount = article.content_html
          .replace(/<[^>]+>/g, " ")
          .split(/\s+/).length;
        const readTime = `${Math.max(2, Math.round(wordCount / 180))} min read`;

        const { error } = await supabase.from("posts").insert({
          title: article.title,
          slug: uniqueSlug,
          category: source.category,
          country: source.country,
          bank_or_entity: article.bank_or_entity || source.label,
          summary: article.summary,
          key_takeaways: Array.isArray(article.key_takeaways)
            ? article.key_takeaways
            : [],
          content_html: article.content_html,
          source_url: item.link,
          source_name: article.source_name || source.label,
          image_url:
            CATEGORY_IMAGES[source.category] || "/images/bank-alert.png",
          read_time: readTime,
        });

        if (error) {
          console.error(`Insert error for ${uniqueSlug}:`, error.message);
          continue;
        }

        publishedCount++;
        console.log(
          `Published (${publishedCount}/${MAX_POSTS_PER_RUN}): ${article.title}`
        );
        break; // Move to next niche/country source for diverse daily coverage
      }
    } catch (err) {
      console.error(`Error processing ${source.label}:`, err.message);
    }
  }

  console.log(`Run complete. Total published: ${publishedCount}`);
}

runBot();
