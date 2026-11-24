import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://news.nexurasecurity.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexura Dispatch | Banking, Data Breaches, Settlements & Cyber Risk",
    template: "%s | Nexura Dispatch",
  },
  description:
    "Independent reporting and verified advisories covering US, UK, Canadian, and Australian banking updates, data breaches, consumer settlements, insurance, and SaaS risk.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nexura Dispatch",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-gray-900">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
