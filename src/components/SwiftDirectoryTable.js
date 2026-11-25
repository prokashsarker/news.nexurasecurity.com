"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import CopyButton from "./CopyButton";

export default function SwiftDirectoryTable({
  codes = [],
  showCountryColumn = true,
}) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? codes.filter(
        (item) =>
          (item.bank_name || "").toLowerCase().includes(q) ||
          (item.swift_code || "").toLowerCase().includes(q) ||
          (item.city || "").toLowerCase().includes(q) ||
          (item.country || "").toLowerCase().includes(q)
      )
    : codes;

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search bank name, SWIFT/BIC code, or city"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bank name, SWIFT code, or city..."
            className="w-full bg-white border border-gray-300 rounded-sm pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-slate-900"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs font-mono text-gray-600">
          Showing {filtered.length} of {codes.length} institutions
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-[#f7f6f2] text-xs font-mono uppercase tracking-wider text-gray-600">
              <th className="py-3.5 px-4">Bank</th>
              {showCountryColumn ? (
                <th className="py-3.5 px-4">Country</th>
              ) : (
                <th className="py-3.5 px-4">City</th>
              )}
              <th className="py-3.5 px-4">SWIFT / BIC</th>
              <th className="py-3.5 px-4 hidden md:table-cell">
                Routing / Local ID
              </th>
              <th className="py-3.5 px-4 hidden lg:table-cell">
                Typical Wire Fee
              </th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 px-4 text-center text-sm text-gray-600"
                >
                  No matching bank or SWIFT code found for &ldquo;{query}&rdquo;.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.slug}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/swift/${item.slug}`}
                      className="font-semibold text-gray-950 hover:underline"
                    >
                      {item.bank_name}
                    </Link>
                    {showCountryColumn && (
                      <div className="text-xs text-gray-600">{item.city}</div>
                    )}
                  </td>
                  {showCountryColumn ? (
                    <td className="py-3.5 px-4 font-mono text-xs uppercase text-gray-600">
                      <Link
                        href={`/swift/country/${item.country}`}
                        className="hover:underline"
                      >
                        {item.country}
                      </Link>
                    </td>
                  ) : (
                    <td className="py-3.5 px-4 text-xs text-gray-600">
                      {item.city}
                    </td>
                  )}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {item.swift_code}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-600 hidden md:table-cell">
                    {item.routing_number || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-600 hidden lg:table-cell">
                    {item.wire_fee || "Varies by tier"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <CopyButton text={item.swift_code} label="Copy" />
                      <Link
                        href={`/swift/${item.slug}`}
                        className="text-xs font-medium text-slate-700 hover:text-slate-950 px-2 py-1"
                      >
                        Guide &rarr;
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
