"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import CopyButton from "./CopyButton";

export default function SwiftQuickLookup({ codes = [] }) {
  const [query, setQuery] = useState("");

  const filtered = codes
    .filter((item) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        item.bank_name.toLowerCase().includes(q) ||
        item.swift_code.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q)
      );
    })
    .slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-lg font-bold text-gray-900">
          SWIFT / BIC Lookup
        </h3>
        <Link
          href="/swift"
          className="text-xs font-medium text-slate-700 hover:text-slate-950 inline-flex items-center gap-0.5"
        >
          Full Directory <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Verified wire codes for major US, UK, CA &amp; AU banks.
      </p>

      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bank or SWIFT (e.g. Chase, HSBC)..."
          className="w-full border border-gray-300 rounded-sm pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-slate-900"
        />
      </div>

      <div className="divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-500 py-3">No matching bank found.</p>
        ) : (
          filtered.map((item) => (
            <div
              key={item.slug}
              className="py-2.5 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <Link
                  href={`/swift/${item.slug}`}
                  className="text-xs font-semibold text-gray-900 hover:underline block truncate"
                >
                  {item.bank_name}
                </Link>
                <span className="text-[11px] font-mono text-gray-500 uppercase">
                  {item.country} • {item.swift_code}
                </span>
              </div>
              <CopyButton text={item.swift_code} label="Copy" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
