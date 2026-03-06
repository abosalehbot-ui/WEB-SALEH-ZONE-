"use client";

import Link from "next/link";

export function FloatingProfileButton() {
  return (
    <Link href="/profile" className="fixed bottom-5 right-5 z-40 rounded-full border border-saleh-border bg-saleh-card p-3 text-saleh-text shadow-glow lg:hidden">
      👤
    </Link>
  );
}
