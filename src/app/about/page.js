export const metadata = {
  title: "About & Editorial Standards",
  description:
    "Learn how Nexura Dispatch verifies banking notices, data breach advisories, and consumer class-action settlement filings.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <article className="bg-white border border-gray-200 rounded-sm p-6 sm:p-10 editorial-prose">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Publication Profile
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mt-1 mb-6">
          About Nexura Dispatch
        </h1>

        <p>
          <strong>Nexura Dispatch</strong> (news.nexurasecurity.com) is an
          independent financial and security publication covering retail banking
          updates, disclosed data breaches, consumer class-action settlements,
          insurance underwriting shifts, and cloud service disruptions across the
          United States, United Kingdom, Canada, and Australia.
        </p>

        <h2>Editorial &amp; Verification Standards</h2>
        <p>
          Financial and security reporting requires precision. Every advisory
          published on Nexura Dispatch is anchored to primary public records,
          including:
        </p>
        <ul>
          <li>Official bank newsrooms, rate bulletins, and security centers</li>
          <li>
            Regulatory disclosures from CISA, state attorneys general, and
            financial conduct authorities
          </li>
          <li>
            Preliminary and final court filings for consumer class-action
            settlements
          </li>
          <li>Publicly verifiable SWIFT/BIC and wire routing directories</li>
        </ul>

        <h2>Corrections Policy</h2>
        <p>
          When an institution updates a filing deadline, wire fee, or breach
          scope, we update our report and link directly to the primary notice.
          Readers who spot an outdated figure are encouraged to contact our
          editorial desk.
        </p>
      </article>
    </main>
  );
}
