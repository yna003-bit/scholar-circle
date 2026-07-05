import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <Link href="/about" className="hover:text-slate-800">About</Link>
          <Link href="/privacy" className="hover:text-slate-800">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-800">Terms of Use</Link>
          <Link href="/accessibility" className="hover:text-slate-800">Accessibility Statement</Link>
          <Link href="/help" className="hover:text-slate-800">Help Center</Link>
          <Link href="/cookies" className="hover:text-slate-800">Cookies</Link>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          Scholar Circle — Bringing opportunities closer to students.
        </p>
      </div>
    </footer>
  );
}