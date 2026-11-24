"use client";

import { useState } from "react";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState(350000);
  const [rate, setRate] = useState(6.25);
  const [years, setYears] = useState(30);

  const monthlyRate = rate / 100 / 12;
  const totalPayments = years * 12;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / totalPayments
      : (principal *
          (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

  const totalCost = monthlyPayment * totalPayments;
  const totalInterest = totalCost - principal;

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5">
      <h3 className="font-serif text-lg font-bold text-gray-900">
        Mortgage &amp; Loan Impact Estimator
      </h3>
      <p className="text-xs text-gray-500 mt-1 mb-4">
        Estimate monthly principal and interest when benchmark rates shift.
      </p>

      <div className="space-y-3 text-sm">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Loan Amount ($)
          </label>
          <input
            type="number"
            min="10000"
            step="5000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              min="0.1"
              max="25"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Term (Years)
            </label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-sm px-3 py-1.5 text-sm font-mono bg-white focus:outline-none focus:border-slate-900"
            >
              <option value={15}>15 yrs</option>
              <option value={20}>20 yrs</option>
              <option value={25}>25 yrs</option>
              <option value={30}>30 yrs</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-gray-600">Est. Monthly Payment</span>
          <span className="font-mono text-lg font-bold text-slate-950">
            ${Number.isFinite(monthlyPayment) ? monthlyPayment.toFixed(2) : "0.00"}
          </span>
        </div>
        <div className="flex items-baseline justify-between text-xs text-gray-500">
          <span>Total Interest Over Term</span>
          <span className="font-mono">
            ${Number.isFinite(totalInterest) ? Math.round(totalInterest).toLocaleString() : "0"}
          </span>
        </div>
      </div>
    </div>
  );
}
