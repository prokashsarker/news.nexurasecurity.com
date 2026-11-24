import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="font-serif text-xl font-bold text-white">
            Nexura Dispatch
          </p>
          <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
            An independent publication tracking retail banking notices, data
            breaches, consumer class-action settlements, insurance underwriting
            shifts, and cloud risk across North America, the UK, and Australia.
          </p>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-md">
            Disclaimer: Nexura Dispatch is an independent informational portal
            and is not affiliated with any bank, court, or government agency.
            Always confirm rates, settlement deadlines, and wire instructions
            directly with the official institution.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Coverage &amp; Tools
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/category/bank_alert" className="hover:text-white transition-colors">
                Banking &amp; Rates
              </Link>
            </li>
            <li>
              <Link href="/category/data_breach" className="hover:text-white transition-colors">
                Data Breach Advisories
              </Link>
            </li>
            <li>
              <Link href="/category/settlement" className="hover:text-white transition-colors">
                Class-Action Settlements
              </Link>
            </li>
            <li>
              <Link href="/category/insurance" className="hover:text-white transition-colors">
                Insurance Market
              </Link>
            </li>
            <li>
              <Link href="/swift" className="hover:text-white transition-colors">
                SWIFT / BIC Directory
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Publication &amp; Policies
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About &amp; Editorial Standards
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact News Desk
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className="hover:text-white transition-colors">
                Financial &amp; Legal Disclaimer
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                XML Sitemap
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            &copy; 2026 Nexura Dispatch (news.nexurasecurity.com). All rights reserved.
          </span>
          <span>Published from the Financial &amp; Security Research Desk</span>
        </div>
      </div>
    </footer>
  );
}
