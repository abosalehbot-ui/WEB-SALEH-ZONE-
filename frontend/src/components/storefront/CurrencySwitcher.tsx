"use client";

import { useEffect, useState } from "react";

type Currency = "USD" | "EUR" | "SAR";
const STORAGE_KEY = "saleh-currency";

export function CurrencySwitcher() {
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
    if (saved) setCurrency(saved);
  }, []);

  const onChange = (nextCurrency: Currency) => {
    setCurrency(nextCurrency);
    localStorage.setItem(STORAGE_KEY, nextCurrency);
  };

  return (
    <select
      value={currency}
      onChange={(event) => onChange(event.target.value as Currency)}
      className="h-9 rounded-lg border border-saleh-border bg-saleh-card px-2 text-xs text-saleh-text"
      aria-label="Currency"
    >
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="SAR">SAR</option>
    </select>
  );
}
