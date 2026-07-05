"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  GraduationCap,
  Users,
  Layers,
  Tag,
  BookOpen,
  LifeBuoy,
  HelpCircle,
  PlayCircle,
} from "lucide-react";

const items = [
  { href: "/welcome", label: "Home", Icon: Home },
  { href: "/for-students", label: "Scholar Circle for Students", Icon: GraduationCap },
  { href: "/connections", label: "Scholar Circle for Making Connections", Icon: Users },
  { href: "/social-platform", label: "Explore Scholar Circle as a Social Platform", Icon: Layers },
  { href: "/pricing", label: "Pricing", Icon: Tag },
  { href: "/resources", label: "Resources", Icon: BookOpen },
  { href: "/support", label: "Support", Icon: LifeBuoy },
  { href: "/faqs", label: "FAQs", Icon: HelpCircle },
  { href: "/demo", label: "How to Use Scholar Circle", Icon: PlayCircle },
];

export function LandingSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex items-center rounded-full border border-slate-200 p-2 text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <Menu size={18} />
      </button>

      {open ? (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-slate-900/20" />
          <div className="fixed right-0 top-0 z-40 flex h-full w-72 flex-col bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto">
              {items.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Icon size={17} className="text-slate-400" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-[#2563EB] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#1D4ED8]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}