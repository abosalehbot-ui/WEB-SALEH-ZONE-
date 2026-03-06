import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-saleh-border bg-saleh-surface py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-saleh-textMuted sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Saleh Zone. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-saleh-primary transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-saleh-primary transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
