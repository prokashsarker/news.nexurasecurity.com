"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

export default function MobileNavDrawer({ navItems, regionLinks }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-sm bg-white text-gray-800 hover:bg-gray-50 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-950/50 transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-out Side Menu */}
          <aside
            aria-label="Mobile navigation"
            className="relative z-10 w-72 max-w-[85vw] bg-white h-full border-r border-gray-200 flex flex-col overflow-y-auto"
          >
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-[#f7f6f2]">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Nexura Dispatch"
                  className="w-7 h-7 object-contain"
                />
                <span className="font-serif text-lg font-bold text-gray-950">
                  Nexura Dispatch
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 text-gray-600 hover:text-gray-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 flex-1">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-2.5">
                  Coverage Desks
                </p>
                <nav className="divide-y divide-gray-100">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-2.5 text-sm font-medium text-gray-800 hover:text-slate-950"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-2.5">
                  Regional Editions
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {regionLinks.map((region) => (
                    <Link
                      key={region.href}
                      href={region.href}
                      onClick={() => setOpen(false)}
                      className="px-3 py-2 text-xs font-semibold text-center border border-gray-200 bg-[#faf9f6] hover:border-gray-400 rounded-sm text-gray-800"
                    >
                      {region.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-2.5">
                  Publication
                </p>
                <div className="space-y-2 text-xs text-gray-600">
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="block py-1 hover:text-gray-950"
                  >
                    Editorial Standards
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="block py-1 hover:text-gray-950"
                  >
                    Contact News Desk
                  </Link>
                  <Link
                    href="/privacy-policy"
                    onClick={() => setOpen(false)}
                    className="block py-1 hover:text-gray-950"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/disclaimer"
                    onClick={() => setOpen(false)}
                    className="block py-1 hover:text-gray-950"
                  >
                    Disclaimer
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
