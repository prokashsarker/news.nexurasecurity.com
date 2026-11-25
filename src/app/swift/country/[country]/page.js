import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSwiftCodes } from "@/lib/data";
import { getCountryDisplayName, resolveCountryCode } from "@/lib/seed-data";
import SwiftDirectoryTable from "@/components/SwiftDirectoryTable";
import AdSlot from "@/components/AdSlot";

export function generateStaticParams() {
  return [
    { country: "us" },
    { country: "uk" },
    { country: "ca" },
    { country: "au" },
  ];
}

export async function generateMetadata({ params }) {
  const { country } = await params;
  const code = resolveCountryCode(country);
  const name = getCountryDisplayName(code);
  return {
    title: `${name} Bank SWIFT / BIC Codes Directory`,
    description: `Browse verified SWIFT/BIC codes, branch cities, and international wire instructions for banks in ${name}.`,
  };
}

export default async function SwiftCountryHubPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-sm text-gray-600">
          Loading bank directory...
        </main>
      }
    >
      <SwiftCountryHubContent params={params} />
    </Suspense>
  );
}

async function SwiftCountryHubContent({ params }) {
  const { country } = await params;
  const normalized = resolveCountryCode(country);
  const codes = await getSwiftCodes({ country: normalized, limit: 1000 });
  if (!codes || codes.length === 0) return notFound();

  const countryName = getCountryDisplayName(normalized);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex gap-2">
        <Link href="/" className="hover:text-gray-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/swift" className="hover:text-gray-900">
          SWIFT Directory
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{countryName}</span>
      </nav>

      <div className="border-b border-gray-300 pb-5 mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-600">
          Country Directory • {codes.length} Institutions
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mt-1">
          {countryName} SWIFT / BIC Codes
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
          Official SWIFT/BIC wire transfer codes for financial institutions in{" "}
          {countryName}. Select any bank for full transfer instructions.
        </p>
      </div>

      <AdSlot className="mb-8" />

      <SwiftDirectoryTable codes={codes} showCountryColumn={false} />
    </main>
  );
}
