export const metadata = {
  title: "Contact the News Desk",
  description:
    "Reach the Nexura Dispatch editorial desk for corrections, breach tips, or general inquiries.",
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <article className="bg-white border border-gray-200 rounded-sm p-6 sm:p-10 editorial-prose">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Editorial Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mt-1 mb-6">
          Contact Nexura Dispatch
        </h1>

        <p>
          For editorial corrections, primary source submissions, or advertising
          and partnership inquiries, please reach our team using the details
          below.
        </p>

        <div className="bg-[#f7f6f2] border border-gray-200 rounded-sm p-5 my-6 not-prose space-y-3 text-sm">
          <div>
            <span className="font-mono text-xs uppercase text-gray-500 block">
              Editorial &amp; Corrections
            </span>
            <a
              href="mailto:editorial@nexurasecurity.com"
              className="font-semibold text-slate-900 hover:underline"
            >
              editorial@nexurasecurity.com
            </a>
          </div>
          <div>
            <span className="font-mono text-xs uppercase text-gray-500 block">
              Security &amp; Breach Tips
            </span>
            <a
              href="mailto:tips@nexurasecurity.com"
              className="font-semibold text-slate-900 hover:underline"
            >
              tips@nexurasecurity.com
            </a>
          </div>
        </div>

        <h2>Before Contacting Us</h2>
        <p>
          Please note that Nexura Dispatch is an independent news and reference
          publication. We cannot access individual bank accounts, process
          class-action settlement claims, or recover lost funds. For account
          support, contact your financial institution using the official number
          on the back of your card.
        </p>
      </article>
    </main>
  );
}
