"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, Users, MessageCircle, User, LayoutDashboard, Settings, LogOut, Layers } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export function MobileMenu({
  displayName,
  username,
  isVerified,
  followingCount,
  followerCount,
}: {
  displayName: string | null;
  username: string | null;
  isVerified: boolean;
  followingCount: number;
  followerCount: number;
}) {
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
    { href: "/groups", label: "Groups", Icon: Layers },
    { href: "/messages", label: "Messages", Icon: MessageCircle },
    { href: "/profile", label: "Profile", Icon: User },
    { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/settings", label: "Settings", Icon: Settings },
  ];

  const initials = (displayName ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="flex items-center p-1 text-ink dark:text-neutral-200">
        <Menu size={20} />
      </button>

      {open ? (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-20 bg-black/25" />
          <div className="fixed right-0 top-0 z-30 flex h-full w-64 flex-col bg-white p-4 shadow-sm dark:bg-neutral-900">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="mb-3 self-end text-ink/60 dark:text-neutral-400">
              <X size={18} />
            </button>

            <Link href="/profile" onClick={() => setOpen(false)} className="mb-2 block">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 text-sm font-medium text-ink dark:bg-white/10 dark:text-neutral-100">
                {initials}
              </div>
              <p className="mt-2 text-sm font-medium text-ink dark:text-neutral-100">
                {displayName ?? "Your profile"}
                <VerifiedBadge verified={isVerified} />
              </p>
              {username ? (
                <p className="text-xs text-ink/40 dark:text-neutral-500">@{username}</p>
              ) : null}
            </Link>
            <div className="mb-3 flex gap-3 text-xs text-ink/60 dark:text-neutral-400">
              <span>
                <span className="font-medium text-ink dark:text-neutral-100">{followingCount}</span> Following
              </span>
              <span>
                <span className="font-medium text-ink dark:text-neutral-100">{followerCount}</span> Followers
              </span>
            </div>

            <div className="border-t border-black/10 pt-2 dark:border-white/10" />

            <div className="flex flex-col gap-1">
              {items.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-ink hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/5"
                >
                  <Icon size={17} className="text-ink/60 dark:text-neutral-400" />
                  {label}
                </Link>
              ))}
              <ThemeToggle />
              <div className="my-2 border-t border-black/10 dark:border-white/10" />
              <button
                onClick={signOut}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-black/5 dark:hover:bg-white/5"
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