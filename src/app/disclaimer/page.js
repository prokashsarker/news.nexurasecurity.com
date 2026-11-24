export const metadata = {
  title: "Financial & Legal Disclaimer",
  description:
    "Important informational disclaimer for Nexura Dispatch articles, settlement summaries, and SWIFT wire codes.",
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <article className="bg-white border border-gray-200 rounded-sm p-6 sm:p-10 editorial-prose">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Notice
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mt-1 mb-6">
          Financial &amp; Legal Disclaimer
        </h1>

        <p>
          All content published on <strong>Nexura Dispatch</strong>{" "}
          (news.nexurasecurity.com) is provided strictly for general
          informational and educational purposes. Nothing on this website
          constitutes financial, investment, tax, legal, or cybersecurity
          advice.
        </p>

        <h2>No Institutional Affiliation</h2>
        <p>
          Nexura Dispatch is an independent publication. References to banks,
          insurers, software vendors, or settlement administrators do not imply
          endorsement or partnership.
        </p>

        <h2>Verify Before Acting</h2>
        <p>
          Interest rates, wire transfer fees, SWIFT/BIC codes, and class-action
          claim deadlines change frequently. Always confirm details directly on
          the official institution&apos;s website or with a licensed
          professional before making financial or legal decisions.
        </p>
      </article>
    </main>
  );
}
