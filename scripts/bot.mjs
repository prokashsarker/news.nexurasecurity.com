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
  bank_alert: "/images/bank-alert.svg",
  data_breach: "/images/data-breach.svg",
  settlement: "/images/settlement.svg",
  insurance: "/images/insurance.svg",
  saas: "/images/saas.svg",
};

const SOURCES = [
  {
    country: "us",
    category: "bank_alert",
    label: "US Retail Banking",
    url: 'https://news.google.com/rss/search?q=(Chase+OR+"Bank+of+America"+OR+"Wells+Fargo"+OR+Citibank)+(rate+OR+mortgage+OR+scam+OR+wire+OR+alert)&hl=en-US&gl=US&ceid=US:en',
  },
  {
    country: "us",
    category: "data_breach",
    label: "US Data Breaches & CISA",
    url: 'https://news.google.com/rss/search?q=("data+breach"+OR+"unauthorized+access"+OR+"phishing+alert")+(bank+OR+financial+OR+customers)&hl=en-US&gl=US&ceid=US:en',
  },
  {
    country: "us",
    category: "settlement",
    label: "US Class Action Settlements",
    url: 'https://news.google.com/rss/search?q=("class+action+settlement"+OR+"settlement+claim")+(bank+OR+"data+breach"+OR+fee+OR+deadline)&hl=en-US&gl=US&ceid=US:en',
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

async function generateArticle(source, item) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const rawText = (item.contentSnippet || item.content || item.title || "")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .slice(0, 3500);

  const prompt = `
You are a senior financial and cybersecurity reporter writing for Nexura Dispatch, an independent newsroom covering US, UK, Canadian, and Australian banking, breaches, settlements, insurance, and SaaS.

Rewrite the following dispatch into a crisp, authoritative, human-sounding news report.

Category: ${source.category}
Country/Edition: ${source.country.toUpperCase()}
Original Headline: ${item.title}
Source Snippet: ${rawText}

Strict Editorial Rules:
1. ZERO HALLUCINATION: Use only facts present in the Original Headline and Source Snippet. Do NOT invent dollar amounts, dates, percentages, interest rates, or quotes that are not in the source.
2. NATURAL JOURNALISTIC TONE: Write like a Reuters or KrebsOnSecurity reporter. Never use AI clichés such as "In today's fast-paced digital landscape", "delve", "tapestry", "crucial to note", or "stay vigilant in an ever-evolving world".
3. STRUCTURE:
   - Identify the specific bank, company, or agency in "bank_or_entity" (e.g., "JPMorgan Chase", "HSBC UK", "Cloudflare").
   - Write a tight, factual "title" (max 95 characters, no clickbait).
   - Write a 1-2 sentence "summary" (max 190 characters).
   - Provide 3 concise, factual "key_takeaways" strings.
   - Write "content_html" (400-600 words) using only <p>, <h2>, <ul>, <li>, and <strong> tags. Use 2 or 3 clear <h2> subheadings and practical bullet points for affected customers.
4. Return ONLY valid JSON with keys: "title", "bank_or_entity", "summary", "key_takeaways", "content_html", "source_name".
`;

  const result = await model.generateContent(prompt);
  const rawJson = result.response
    .text()
    .replace(/```json|```/g, "")
    .trim();

  return JSON.parse(rawJson);
}

async function runBot() {
  let publishedCount = 0;

  // Rotate sources slightly each day so all niches get balanced coverage
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

        const baseSlug = slugify(article.title, { lower: true, strict: true });
        const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
        const wordCount = article.content_html.replace(/<[^>]+>/g, " ").split(/\s+/).length;
        const readTime = `${Math.max(2, Math.round(wordCount / 180))} min read`;

        const { error } = await supabase.from("posts").insert({
          title: article.title,
          slug: uniqueSlug,
          category: source.category,
          country: source.country,
          bank_or_entity: article.bank_or_entity || source.label,
          summary: article.summary,
          key_takeaways: article.key_takeaways || [],
          content_html: article.content_html,
          source_url: item.link,
          source_name: article.source_name || "Official Newsroom",
          image_url: CATEGORY_IMAGES[source.category] || "/images/bank-alert.svg",
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
      }
    } catch (err) {
      console.error(`Error processing ${source.label}:`, err.message);
    }
  }

  console.log(`Run complete. Total published: ${publishedCount}`);
}

runBot();
