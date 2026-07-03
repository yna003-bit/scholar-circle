"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, Users, MessageCircle, User, LayoutDashboard, Settings, LogOut } from "lucide-react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function signOut() {
    setOpen(false);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const items = [
    { href: "/network", label: "Network", Icon: Users },
    { href: "/messages", label: "Messages", Icon: MessageCircle },
    { href: "/profile", label: "Profile", Icon: User },
    { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/settings", label: "Settings", Icon: Settings },
  ];

  return (
    <div className="relative">
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex items-center p-1 text-ink">
        <Menu size={20} />
      </button>

      {open ? (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-20 bg-black/25" />
          <div className="fixed right-0 top-0 z-30 flex h-full w-56 flex-col bg-white p-4 shadow-sm">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="mb-4 self-end text-ink/60">
              <X size={18} />
            </button>
            <div className="flex flex-col gap-1">
              {items.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-ink hover:bg-black/5"
                >
                  <Icon size={17} className="text-ink/60" />
                  {label}
                </Link>
              ))}
              <div className="my-2 border-t border-black/10" />
              <button
                onClick={signOut}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-black/5"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}