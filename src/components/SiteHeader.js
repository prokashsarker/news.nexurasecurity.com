import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "All Dispatches" },
  { href: "/category/bank_alert", label: "Banking & Rates" },
  { href: "/category/data_breach", label: "Data Breaches" },
  { href: "/category/settlement", label: "Settlements" },
  { href: "/category/insurance", label: "Insurance" },
  { href: "/category/saas", label: "SaaS & Cloud" },
  { href: "/swift", label: "SWIFT Directory" },
];

const REGION_LINKS = [
  { href: "/us", label: "US" },
  { href: "/uk", label: "UK" },
  { href: "/ca", label: "Canada" },
  { href: "/au", label: "Australia" },
];

export default function SiteHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top utility bar */}
      <div className="border-b border-gray-100 bg-[#f5f4f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-gray-500">
              Edition:
            </span>
            <nav aria-label="Regional Editions" className="flex items-center gap-2.5">
              {REGION_LINKS.map((region) => (
                <Link
                  key={region.href}
                  href={region.href}
                  className="font-medium hover:text-gray-900 transition-colors"
                >
                  {region.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/about" className="hover:text-gray-900 transition-colors">
              Editorial Standards
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">
              News Desk
            </Link>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-sm">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Nexura Dispatch
            </span>
          </Link>
          <p className="text-xs text-gray-500 mt-1 tracking-wide">
            Independent Financial Advisories, Breach Intelligence &amp; Consumer Claims
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" />
          <span>US • UK • CA • AU COVERAGE</span>
        </div>
      </div>

      {/* Primary Category Navigation */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav
            aria-label="Primary Categories"
            className="flex items-center gap-6 overflow-x-auto py-3 text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-slate-950 transition-colors shrink-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
