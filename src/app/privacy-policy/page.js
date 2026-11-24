export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy, cookie usage, and Google AdSense advertising disclosures for Nexura Dispatch.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <article className="bg-white border border-gray-200 rounded-sm p-6 sm:p-10 editorial-prose">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Legal &amp; Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mt-1 mb-6">
          Privacy Policy
        </h1>

        <p>
          This Privacy Policy explains how <strong>Nexura Dispatch</strong>{" "}
          (news.nexurasecurity.com) handles visitor information, cookies, and
          third-party advertising services.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We do not require user registration to read articles or use our SWIFT
          code and loan estimator tools. Standard server logs (such as browser
          type, referring page, and anonymized IP metadata) may be processed by
          our hosting provider for security and performance monitoring.
        </p>

        <h2>Google AdSense &amp; Advertising Cookies</h2>
        <p>
          We use Google AdSense to display advertisements. Third-party vendors,
          including Google, use cookies to serve ads based on a visitor&apos;s
          prior visits to this website or other websites on the internet.
        </p>
        <ul>
          <li>
            Google&apos;s use of advertising cookies enables it and its partners
            to serve ads based on your visit to this site and/or other sites.
          </li>
          <li>
            Users may opt out of personalized advertising by visiting Google Ads
            Settings (adssettings.google.com) or aboutads.info.
          </li>
        </ul>

        <h2>External Links</h2>
        <p>
          Articles include links to official bank websites, regulatory portals,
          and settlement administrators. We are not responsible for the privacy
          practices of external websites.
        </p>
      </article>
    </main>
  );
}
