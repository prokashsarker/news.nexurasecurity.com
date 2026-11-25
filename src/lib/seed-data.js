export const CATEGORIES = {
  bank_alert: {
    id: "bank_alert",
    label: "Banking & Rates",
    shortLabel: "Banking",
    accent: "text-teal-800 bg-teal-50 border-teal-200",
    description:
      "Verified rate adjustments, mortgage policy changes, and customer advisories across major US, UK, Canadian, and Australian banks.",
  },
  data_breach: {
    id: "data_breach",
    label: "Data Breaches",
    shortLabel: "Cyber & Breaches",
    accent: "text-red-800 bg-red-50 border-red-200",
    description:
      "Active phishing campaigns, disclosed corporate data breaches, and critical financial security vulnerabilities.",
  },
  settlement: {
    id: "settlement",
    label: "Settlements",
    shortLabel: "Settlements",
    accent: "text-amber-900 bg-amber-50 border-amber-200",
    description:
      "Approved consumer class-action settlements, filing deadlines, and verified claim eligibility notices.",
  },
  insurance: {
    id: "insurance",
    label: "Insurance",
    shortLabel: "Insurance",
    accent: "text-indigo-800 bg-indigo-50 border-indigo-200",
    description:
      "Auto, property, and cyber insurance underwriting shifts, premium adjustments, and regulatory updates.",
  },
  saas: {
    id: "saas",
    label: "SaaS & Cloud",
    shortLabel: "SaaS & Cloud",
    accent: "text-slate-800 bg-slate-100 border-slate-300",
    description:
      "Enterprise cloud service disruptions, payment gateway outages, and critical SaaS security advisories.",
  },
};

export const COUNTRIES = {
  us: { code: "us", name: "United States", short: "US", currency: "USD" },
  uk: { code: "uk", name: "United Kingdom", short: "UK", currency: "GBP" },
  ca: { code: "ca", name: "Canada", short: "CA", currency: "CAD" },
  au: { code: "au", name: "Australia", short: "AU", currency: "AUD" },
  global: { code: "global", name: "Global", short: "Global", currency: "USD" },
};

const regionDisplay = new Intl.DisplayNames(["en"], { type: "region" });

export function getCountryDisplayName(code) {
  const normalized = (code || "").toLowerCase();
  if (COUNTRIES[normalized]) return COUNTRIES[normalized].name;
  const iso = normalized === "uk" ? "GB" : normalized.toUpperCase();
  try {
    return regionDisplay.of(iso) || normalized.toUpperCase();
  } catch {
    return normalized.toUpperCase();
  }
}

const COUNTRY_SLUG_ALIASES = {
  "united-states": "us",
  usa: "us",
  "united-kingdom": "uk",
  gb: "uk",
  canada: "ca",
  australia: "au",
  germany: "de",
  france: "fr",
  netherlands: "nl",
  switzerland: "ch",
  singapore: "sg",
  "united-arab-emirates": "ae",
  uae: "ae",
  india: "in",
  bangladesh: "bd",
};

export function resolveCountryCode(input) {
  const normalized = (input || "").toLowerCase().trim();
  return COUNTRY_SLUG_ALIASES[normalized] || normalized;
}

export const SEED_POSTS = [
  {
    id: 1,
    title: "Chase Updates Wire Transfer Verification Rules for High-Value Personal Accounts",
    slug: "chase-updates-wire-transfer-verification-rules-personal-accounts",
    category: "bank_alert",
    country: "us",
    bank_or_entity: "JPMorgan Chase",
    summary:
      "Chase has introduced mandatory two-step callback verification for outgoing domestic and international wire transfers exceeding $10,000.",
    key_takeaways: [
      "Outgoing wire transfers above $10,000 now trigger an automated security hold pending voice or app confirmation.",
      "Customers should verify their primary mobile number in the Chase Mobile app before scheduling closing or escrow wires.",
      "Same-day wire cutoff remains 4:00 PM ET for online submissions.",
    ],
    content_html: `
      <p>JPMorgan Chase has updated its retail wire transfer security protocols to curb authorized push payment (APP) fraud and business email compromise scams targeting retail banking customers.</p>
      <h2>What Changed for Account Holders</h2>
      <p>Effective this month, personal checking and private client accounts initiating a domestic or international wire above <strong>$10,000</strong> may encounter an automatic secondary verification prompt. In cases flagged by behavioral risk scoring, a specialist from the Chase Fraud Operations desk will place a verification call to the customer's registered phone number.</p>
      <h2>Impact on Real Estate & Escrow Transfers</h2>
      <p>Homebuyers scheduling closing wires are advised to initiate transfers at least 24 hours ahead of settlement deadlines. Unanswered verification callbacks can delay same-day Federal Reserve Fedwire settlement until the next business day.</p>
      <h2>How to Avoid Delays</h2>
      <ul>
        <li>Confirm your primary phone number and push notification settings inside the Chase Mobile app.</li>
        <li>Never alter wire instructions received solely via email without calling the recipient at a previously verified number.</li>
        <li>Keep your transaction reference number accessible if contacted by Chase Fraud Operations.</li>
      </ul>
    `,
    source_url: "https://www.chase.com/personal/checking",
    source_name: "Chase Customer Advisory",
    image_url: "/images/bank-alert.png",
    read_time: "3 min read",
    created_at: "2026-11-24T09:30:00Z",
  },
  {
    id: 2,
    title: "Major US Financial Services Vendor Discloses Unauthorized Access Affecting 420,000 Customers",
    slug: "us-financial-services-vendor-discloses-unauthorized-access-420000",
    category: "data_breach",
    country: "us",
    bank_or_entity: "Financial Data Vendor",
    summary:
      "A third-party document processing provider notified state attorneys general after an exposed SFTP credential allowed unauthorized downloads.",
    key_takeaways: [
      "Exposed records include names, mailing addresses, and partial loan account numbers.",
      "Impacted individuals are being offered 24 months of complimentary credit monitoring.",
      "Customers should place a free security freeze with Equifax, Experian, and TransUnion.",
    ],
    content_html: `
      <p>A third-party mortgage and loan servicing vendor has filed breach notifications with multiple US state attorneys general following an investigation into unauthorized access to its document transfer environment.</p>
      <h2>Timeline of the Incident</h2>
      <p>According to regulatory filings, suspicious activity was first detected on an external SFTP server used to exchange loan statements with regional lenders. Forensic investigators determined that an unrotated service credential was used to access archived PDF statements over a four-day window before access was revoked.</p>
      <h2>What Information Was Exposed</h2>
      <p>The vendor confirmed that affected files contained full names, residential addresses, and masked account identifiers. In a smaller subset of records, Social Security numbers were also present on tax-related escrow forms.</p>
      <h2>Recommended Steps for Affected Consumers</h2>
      <ul>
        <li>Watch for an official notification letter containing an enrollment code for complimentary credit monitoring.</li>
        <li>Place a free credit freeze at all three major US bureaus rather than relying solely on fraud alerts.</li>
        <li>Enable transaction alerts for any linked checking or HELOC accounts.</li>
      </ul>
    `,
    source_url: "https://www.cisa.gov/news-events/cybersecurity-advisories",
    source_name: "CISA & State Filings",
    image_url: "/images/data-breach.png",
    read_time: "4 min read",
    created_at: "2026-11-24T08:15:00Z",
  },
  {
    id: 3,
    title: "HSBC UK Warns Customers Over Surge in Impersonation Calls Targeting Savings Accounts",
    slug: "hsbc-uk-warns-customers-impersonation-calls-savings",
    category: "bank_alert",
    country: "uk",
    bank_or_entity: "HSBC UK",
    summary:
      "HSBC UK issued a fresh fraud advisory after criminals spoofed official branch numbers to trick savers into moving funds to 'safe' accounts.",
    key_takeaways: [
      "HSBC UK will never ask customers to transfer money to a 'safe account' or share a Digital Secure Key code.",
      "Criminals are spoofing official 0345 customer service numbers.",
      "Customers can dial 159 in the UK to connect directly to their bank's verified fraud line.",
    ],
    content_html: `
      <p>HSBC UK has alerted retail banking customers to an uptick in sophisticated telephone spoofing campaigns in which callers pose as the bank's fraud prevention team.</p>
      <h2>How the Scam Operates</h2>
      <p>Victims typically receive a call displaying a legitimate-looking HSBC UK customer support number. The caller claims suspicious activity has been detected on a current or ISA savings account and instructs the victim to move balances into a newly opened 'holding account' to protect their funds.</p>
      <h2>Official Verification Rules</h2>
      <p>HSBC UK reiterated that staff will never ask customers to move money out of their account for security purposes, nor will they request one-time passcodes generated by the Mobile Banking app.</p>
      <ul>
        <li>Hang up immediately if pressured to act urgently or keep a call secret.</li>
        <li>Call <strong>159</strong> from any UK phone to reach participating banks safely.</li>
        <li>Report suspicious messages to HSBC UK's dedicated phishing inbox.</li>
      </ul>
    `,
    source_url: "https://www.hsbc.co.uk/help/security-centre/",
    source_name: "HSBC UK Security Centre",
    image_url: "/images/bank-alert.png",
    read_time: "3 min read",
    created_at: "2026-11-23T17:40:00Z",
  },
  {
    id: 4,
    title: "$38 Million Consumer Banking Fee Class Action Settlement: Eligibility & Claim Deadline",
    slug: "38-million-consumer-banking-fee-class-action-settlement-deadline",
    category: "settlement",
    country: "us",
    bank_or_entity: "US Consumer Settlement",
    summary:
      "Eligible checking account holders who were charged repeat non-sufficient funds (NSF) fees between 2020 and 2024 can submit claims before the court deadline.",
    key_takeaways: [
      "Total settlement fund stands at $38 million for eligible US checking account holders.",
      "Automatic credits apply to current customers; former account holders must file a claim online.",
      "Estimated payouts depend on the number of verified repeat NSF fees assessed.",
    ],
    content_html: `
      <p>A federal court has granted preliminary approval to a $38 million class action settlement resolving claims that a regional banking group assessed multiple non-sufficient funds (NSF) fees on single re-presented debit and ACH transactions.</p>
      <h2>Who Is Eligible</h2>
      <p>The settlement class covers US consumers who held a personal checking account with the institution between January 1, 2020, and June 30, 2024, and were charged two or more NSF or overdraft fees on the same underlying merchant item.</p>
      <h2>How Payments Will Be Distributed</h2>
      <p>Active account holders who remain with the bank are slated to receive direct account credits following final court approval, without needing to submit a paper form. Former customers who closed their accounts must submit a valid claim form with their current mailing address or electronic payment preference.</p>
      <ul>
        <li>Check your email or postal mail for a Notice ID and Confirmation Code from the settlement administrator.</li>
        <li>Avoid third-party claim-filing services that charge a percentage of your payout; official filing is free.</li>
      </ul>
    `,
    source_url: "https://www.consumerfinance.gov/",
    source_name: "Court & CFPB Filings",
    image_url: "/images/settlement.png",
    read_time: "4 min read",
    created_at: "2026-11-23T14:20:00Z",
  },
  {
    id: 5,
    title: "Cyber Insurance Underwriters Tighten MFA & Backup Requirements for 2027 Renewals",
    slug: "cyber-insurance-underwriters-tighten-mfa-backup-requirements-2027",
    category: "insurance",
    country: "us",
    bank_or_entity: "Commercial Cyber Market",
    summary:
      "Leading US and UK cyber insurers are mandating phishing-resistant MFA and immutable backups before quoting ransomware coverage renewals.",
    key_takeaways: [
      "SMS-based two-factor authentication is no longer accepted for administrative or VPN logins by tier-1 carriers.",
      "Premiums remain flat to +5% for organizations meeting baseline EDR and offline backup controls.",
      "Incomplete security questionnaires risk coverage exclusions for social engineering losses.",
    ],
    content_html: `
      <p>Commercial cyber insurance carriers entering the 2027 renewal cycle are enforcing stricter technical underwriting standards as ransomware groups shift toward data extortion and cloud identity compromise.</p>
      <h2>Key Underwriting Mandates</h2>
      <p>Brokers report that applications lacking Endpoint Detection and Response (EDR) across at least 95% of endpoints, or lacking phishing-resistant MFA (such as FIDO2 hardware keys) for privileged accounts, are seeing higher retentions or outright declinations.</p>
      <h2>Impact on Mid-Market Premiums</h2>
      <p>Organizations that demonstrate segmented, immutable backups tested within the past 90 days are securing competitive renewal rates, while firms with legacy remote desktop exposure face steep coinsurance clauses.</p>
    `,
    source_url: "https://www.naic.org/",
    source_name: "Insurance Market Briefing",
    image_url: "/images/insurance.png",
    read_time: "3 min read",
    created_at: "2026-11-22T16:10:00Z",
  },
  {
    id: 6,
    title: "Cloudflare & Major Payment Gateways Issue Patch Guidance After TLS Handshake Latency Spike",
    slug: "cloudflare-payment-gateways-tls-handshake-latency-guidance",
    category: "saas",
    country: "global",
    bank_or_entity: "Cloud & SaaS Infrastructure",
    summary:
      "Enterprise SaaS operators experienced brief checkout timeouts across North American edge nodes; service is fully restored with updated SDK guidance.",
    key_takeaways: [
      "Brief API timeout window affected select North American edge PoPs for 18 minutes.",
      "Core payment processing ledgers remained intact with zero duplicate charges reported.",
      "Engineering teams should verify idempotency keys on retry queues.",
    ],
    content_html: `
      <p>Several SaaS billing platforms and e-commerce checkout integrations experienced elevated 502 and TLS handshake timeouts during a brief 18-minute routing anomaly across eastern North American edge locations.</p>
      <h2>Root Cause & Resolution</h2>
      <p>Infrastructure engineers isolated the degradation to a BGP route optimization update that temporarily overloaded regional ingress proxies. Traffic was automatically drained to healthy neighboring points of presence, restoring normal p99 latency.</p>
      <h2>Action for SaaS Engineering Teams</h2>
      <p>Platform teams should audit webhook retry queues from the incident window and ensure idempotency keys are enforced on all billing and subscription renewal endpoints.</p>
    `,
    source_url: "https://www.cloudflarestatus.com/",
    source_name: "Infrastructure Status Bulletin",
    image_url: "/images/saas.png",
    read_time: "3 min read",
    created_at: "2026-11-22T11:05:00Z",
  },
  {
    id: 7,
    title: "RBC & TD Bank Adjust 5-Year Fixed Mortgage Rates Amid Bond Yield Shifts",
    slug: "rbc-td-bank-adjust-5-year-fixed-mortgage-rates-canada",
    category: "bank_alert",
    country: "ca",
    bank_or_entity: "RBC & TD Bank",
    summary:
      "Canadian lenders recalibrated insured and uninsured 5-year fixed mortgage postings following a 15-basis-point move in Government of Canada bond yields.",
    key_takeaways: [
      "5-year Government of Canada bond yields climbed 15 bps over the past five trading sessions.",
      "Rate-hold commitments remain valid for 90 to 120 days depending on the lender.",
      "Variable-rate mortgage holders see no immediate change ahead of the next Bank of Canada announcement.",
    ],
    content_html: `
      <p>Major Canadian banks including Royal Bank of Canada (RBC) and TD Bank have updated their posted and special-offer fixed mortgage rates in response to higher five-year Government of Canada bond yields.</p>
      <h2>What Borrowers Should Know</h2>
      <p>Fixed mortgage pricing in Canada closely tracks the five-year bond market rather than the Bank of Canada's overnight policy rate. Homebuyers with an active pre-approval rate hold are insulated from the latest upward adjustment until their lock expires.</p>
    `,
    source_url: "https://www.bankofcanada.ca/",
    source_name: "Canadian Banking Desk",
    image_url: "/images/bank-alert.png",
    read_time: "3 min read",
    created_at: "2026-11-21T15:00:00Z",
  },
  {
    id: 8,
    title: "CommBank Expands NameCheck Anti-Scam Protection to Business & PayID Transfers",
    slug: "commbank-expands-namecheck-anti-scam-protection-australia",
    category: "bank_alert",
    country: "au",
    bank_or_entity: "Commonwealth Bank",
    summary:
      "CommBank's real-time account name verification technology now covers a wider range of first-time business invoice payments in Australia.",
    key_takeaways: [
      "NameCheck flags mismatches between the payee name entered and the receiving BSB/account title.",
      "Business invoice fraud remains one of the highest-loss scam categories in Australia.",
      "Customers still retain responsibility to verify BSB changes via a known phone number.",
    ],
    content_html: `
      <p>Commonwealth Bank (CommBank) has expanded its NameCheck verification technology across additional domestic transfer rails in Australia, aiming to intercept invoice redirection scams before funds leave the sender's account.</p>
      <h2>How NameCheck Works</h2>
      <p>When a customer enters a BSB and account number for a new payee, NameCheck cross-references historical payment patterns and account-title signals to indicate whether the name matches the destination account.</p>
    `,
    source_url: "https://www.commbank.com.au/newsroom.html",
    source_name: "CommBank Newsroom",
    image_url: "/images/bank-alert.png",
    read_time: "3 min read",
    created_at: "2026-11-21T09:45:00Z",
  },
];

export const SEED_SWIFT_CODES = [
  {
    id: 1,
    bank_name: "JPMorgan Chase Bank, N.A.",
    swift_code: "CHASUS33",
    routing_number: "021000021",
    country: "us",
    city: "New York, NY",
    address: "383 Madison Avenue, New York, NY 10179, USA",
    wire_fee: "$15 Incoming / $40–$50 Outgoing International",
    slug: "chase-bank-us-chasus33",
    guide_html: `
      <h2>How to Use CHASUS33 for International Wires</h2>
      <p>To receive an international wire transfer in USD into a US Chase checking or savings account, provide the sender with the primary SWIFT/BIC code <strong>CHASUS33</strong> along with your full account number and legal account title.</p>
      <h3>Required Details for Senders</h3>
      <ul>
        <li><strong>Beneficiary Bank:</strong> JPMorgan Chase Bank, N.A.</li>
        <li><strong>SWIFT / BIC Code:</strong> CHASUS33 (or CHASUS33XXX if 11 characters are required)</li>
        <li><strong>ABA Routing Number (Domestic / Intermediary):</strong> 021000021</li>
      </ul>
      <p>If the sender's bank requires an 11-character BIC, append <code>XXX</code> to form <code>CHASUS33XXX</code>. Always verify wire instructions inside your Chase Online portal before initiating large transfers.</p>
    `,
  },
  {
    id: 2,
    bank_name: "Bank of America, N.A.",
    swift_code: "BOFAUS3N",
    routing_number: "026009593",
    country: "us",
    city: "New York, NY",
    address: "100 North Tryon Street, Charlotte, NC 28255, USA",
    wire_fee: "$15 Incoming / $45 Outgoing International (USD)",
    slug: "bank-of-america-us-bofaus3n",
    guide_html: `
      <h2>Bank of America SWIFT Code Guide</h2>
      <p>Bank of America uses <strong>BOFAUS3N</strong> for incoming international wire transfers denominated in US Dollars. If the sending institution is transmitting funds in a foreign currency, Bank of America's foreign currency SWIFT code <code>BOFAUS6S</code> may apply.</p>
      <ul>
        <li><strong>USD International Wires:</strong> BOFAUS3N</li>
        <li><strong>Foreign Currency Wires:</strong> BOFAUS6S</li>
        <li><strong>Wire Routing Number:</strong> 026009593</li>
      </ul>
    `,
  },
  {
    id: 3,
    bank_name: "Wells Fargo Bank, N.A.",
    swift_code: "WFBIUS6S",
    routing_number: "121000248",
    country: "us",
    city: "San Francisco, CA",
    address: "420 Montgomery Street, San Francisco, CA 94104, USA",
    wire_fee: "$15 Incoming / $40 Outgoing",
    slug: "wells-fargo-us-wfbius6s",
    guide_html: `
      <h2>Wells Fargo International Wire Instructions</h2>
      <p>Use <strong>WFBIUS6S</strong> for incoming international wires to Wells Fargo personal and commercial accounts across the United States, paired with wire routing number <code>121000248</code>.</p>
    `,
  },
  {
    id: 4,
    bank_name: "Citibank, N.A.",
    swift_code: "CITIUS33",
    routing_number: "021000089",
    country: "us",
    city: "New York, NY",
    address: "388 Greenwich Street, New York, NY 10013, USA",
    wire_fee: "$15 Incoming / $35–$45 Outgoing",
    slug: "citibank-us-citius33",
    guide_html: `
      <h2>Citibank US SWIFT/BIC Instructions</h2>
      <p>Citibank's primary US SWIFT code is <strong>CITIUS33</strong>. Ensure your beneficiary name matches your Citibank statement exactly to avoid compliance holds.</p>
    `,
  },
  {
    id: 5,
    bank_name: "HSBC UK Bank plc",
    swift_code: "HBUKGB4B",
    routing_number: "40-05-30 (Sort Code Example)",
    country: "uk",
    city: "London",
    address: "1 Centenary Square, Birmingham B1 1HQ, United Kingdom",
    wire_fee: "£0 Incoming (GBP) / £5–£9 Outgoing",
    slug: "hsbc-uk-hbukgb4b",
    guide_html: `
      <h2>HSBC UK IBAN & SWIFT Instructions</h2>
      <p>For international transfers to HSBC UK personal accounts, senders require both your <strong>IBAN</strong> (found on your HSBC UK statement) and the BIC/SWIFT code <strong>HBUKGB4B</strong>.</p>
    `,
  },
  {
    id: 6,
    bank_name: "Barclays Bank UK PLC",
    swift_code: "BUKBGB22",
    routing_number: "20-00-00 (Head Office Sort Code)",
    country: "uk",
    city: "London",
    address: "1 Churchill Place, London E14 5HP, United Kingdom",
    wire_fee: "£0–£6 Incoming / £0 Online SEPA",
    slug: "barclays-uk-bukbgb22",
    guide_html: `
      <h2>Barclays UK Retail SWIFT Code</h2>
      <p>Barclays Bank UK PLC retail accounts use <strong>BUKBGB22</strong> alongside your 22-character UK IBAN.</p>
    `,
  },
  {
    id: 7,
    bank_name: "Lloyds Bank plc",
    swift_code: "LOYDGB2L",
    routing_number: "30-00-02 (Sort Code Prefix)",
    country: "uk",
    city: "London",
    address: "25 Gresham Street, London EC2V 7HN, United Kingdom",
    wire_fee: "£0–£7 Incoming / £9.50 Standard Outgoing",
    slug: "lloyds-bank-uk-loydgb2l",
    guide_html: `
      <h2>Lloyds Bank International Transfers</h2>
      <p>Provide <strong>LOYDGB2L</strong> and your personal IBAN when receiving funds from outside the United Kingdom into a Lloyds current or savings account.</p>
    `,
  },
  {
    id: 8,
    bank_name: "Royal Bank of Canada (RBC)",
    swift_code: "ROYCCAT2",
    routing_number: "003 (Institution Number)",
    country: "ca",
    city: "Toronto, ON",
    address: "200 Bay Street, Toronto, ON M5J 2J5, Canada",
    wire_fee: "$17 CAD Incoming / $45+ CAD Outgoing",
    slug: "rbc-canada-royccat2",
    guide_html: `
      <h2>RBC Canada International Wire Details</h2>
      <p>To receive a wire in Canada at RBC, provide SWIFT code <strong>ROYCCAT2</strong>, Institution Number <code>003</code>, your 5-digit Transit Number, and your 7-digit account number.</p>
    `,
  },
  {
    id: 9,
    bank_name: "TD Canada Trust",
    swift_code: "TDOMCATTTOR",
    routing_number: "004 (Institution Number)",
    country: "ca",
    city: "Toronto, ON",
    address: "55 King Street West, Toronto, ON M5K 1A2, Canada",
    wire_fee: "$17.50 CAD Incoming / $30–$50 CAD Outgoing",
    slug: "td-bank-canada-tdomcatttor",
    guide_html: `
      <h2>TD Canada Trust Wire Instructions</h2>
      <p>TD Canada Trust uses <strong>TDOMCATTTOR</strong> for incoming international wires, together with Institution Number <code>004</code>, your 5-digit branch transit number, and your account number.</p>
    `,
  },
  {
    id: 10,
    bank_name: "Commonwealth Bank of Australia",
    swift_code: "CTBAAU2S",
    routing_number: "062-000 (BSB Example)",
    country: "au",
    city: "Sydney, NSW",
    address: "201 Sussex Street, Sydney NSW 2000, Australia",
    wire_fee: "$10–$11 AUD Incoming / $6–$22 AUD Outgoing",
    slug: "commbank-australia-ctbaau2s",
    guide_html: `
      <h2>CommBank Australia SWIFT / BIC Guide</h2>
      <p>For international transfers into Australia, CommBank uses <strong>CTBAAU2S</strong> paired with your 6-digit BSB and account number.</p>
    `,
  },
  {
    id: 11,
    bank_name: "Westpac Banking Corporation",
    swift_code: "WPACAU2S",
    routing_number: "032-000 (BSB Example)",
    country: "au",
    city: "Sydney, NSW",
    address: "275 Kent Street, Sydney NSW 2000, Australia",
    wire_fee: "$12 AUD Incoming / $20 AUD Outgoing",
    slug: "westpac-australia-wpacau2s",
    guide_html: `
      <h2>Westpac Australia Wire Instructions</h2>
      <p>Provide <strong>WPACAU2S</strong>, your 6-digit BSB, and your Westpac account number for incoming international transfers.</p>
    `,
  },
  {
    id: 12,
    bank_name: "ANZ Bank (Australia)",
    swift_code: "ANZBAU3M",
    routing_number: "012-003 (BSB Example)",
    country: "au",
    city: "Melbourne, VIC",
    address: "833 Collins Street, Docklands VIC 3008, Australia",
    wire_fee: "$15 AUD Incoming / $18 AUD Outgoing",
    slug: "anz-australia-anzbau3m",
    guide_html: `
      <h2>ANZ Australia International Wire Guide</h2>
      <p>ANZ Australia uses <strong>ANZBAU3M</strong> along with your BSB and account number for incoming international funds.</p>
    `,
  },
];
