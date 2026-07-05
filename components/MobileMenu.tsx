"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, Users, MessageCircle, User, LayoutDashboard, Settings, LogOut, Layers, Bookmark, BookOpen, UserPlus, Home, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Avatar } from "@/components/Avatar";
import { t, LanguageCode } from "@/lib/translations";

export function MobileMenu({
  displayName,
  username,
  isVerified,
  avatarUrl,
  followingCount,
  followerCount,
  lang,
}: {
  displayName: string | null;
  username: string | null;
  isVerified: boolean;
  avatarUrl?: string | null;
  followingCount: number;
  followerCount: number;
  lang: LanguageCode;
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
    { href: "/feed", label: "Home", Icon: Home },
    { href: "/network", label: t("network", lang), Icon: Users },
    { href: "/groups", label: t("groups", lang), Icon: Layers },
    { href: "/messages", label: t("messages", lang), Icon: MessageCircle },
    { href: "/saved", label: t("saved", lang), Icon: Bookmark },
    { href: "/requirements", label: t("requirements", lang), Icon: BookOpen },
    { href: "/invite", label: "Invite Friends", Icon: UserPlus },
    { href: "/profile", label: t("profile", lang), Icon: User },
    { href: "/dashboard", label: t("dashboard", lang), Icon: LayoutDashboard },
    { href: "/settings", label: t("settings", lang), Icon: Settings },
    { href: "/welcome", label: "Landing Page", Icon: Globe },
  ];

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
              <Avatar url={avatarUrl} name={displayName} size={48} />
              <p className="mt-2 text-sm font-medium text-ink dark:text-neutral-100">
                {displayName ?? "Your profile"}
                <VerifiedBadge verified={isVerified} />
              </p>
              {username ? (
                <p className="text-xs text-ink/40 dark:text-neutral-500">@{username}</p>
              ) : null}
            </Link>
            <div className="mb-3 flex gap-3 text-xs text-ink/60 dark:text-neutral-400">
              <Link href="/following" onClick={() => setOpen(false)} className="hover:underline">
                <span className="font-medium text-ink dark:text-neutral-100">{followingCount}</span> {t("following", lang)}
              </Link>
              <Link href="/followers" onClick={() => setOpen(false)} className="hover:underline">
                <span className="font-medium text-ink dark:text-neutral-100">{followerCount}</span> {t("followers", lang)}
              </Link>
            </div>

            <div className="border-t border-black/10 pt-2 dark:border-white/10" />

            <div className="flex flex-col gap-1 overflow-y-auto">
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
              <ThemeToggle lang={lang} />
              <div className="my-2 border-t border-black/10 dark:border-white/10" />
              <button
                onClick={signOut}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-black/5 dark:hover:bg-white/5"
              >
                <LogOut size={17} />
                {t("signOut", lang)}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}