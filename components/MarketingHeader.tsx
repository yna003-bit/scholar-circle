import Link from "next/link";
import { LandingSidebar } from "@/components/LandingSidebar";

export function MarketingHeader() {
  return (
    <nav className="border-b border-slate-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/welcome" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Scholar Circle" className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-semibold text-slate-900">Scholar Circle</span>
        </Link>
        <LandingSidebar />
      </div>
    </nav>
  );
}