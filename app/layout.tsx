import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import { createClient } from "@/lib/supabase/server";
import { MobileMenu } from "@/components/MobileMenu";
import { Footer } from "@/components/Footer";
import { PresenceHeartbeat } from "@/components/PresenceHeartbeat";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { LanguageCode } from "@/lib/translations";

export const metadata = {
  title: "Scholar Circle",
  description: "Find funding. Find your people.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as LanguageCode;

  let menuProfile = null;
  let followingCount = 0;
  let followerCount = 0;
  let unreadNotifications = 0;

  if (user) {
    const [{ data: profile }, { count: fc }, { count: flc }, { count: nc }] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, username, is_verified, avatar_url")
        .eq("id", user.id)
        .single(),
      supabase
        .from("follows")
        .select("followed_id", { count: "exact", head: true })
        .eq("follower_id", user.id),
      supabase
        .from("follows")
        .select("follower_id", { count: "exact", head: true })
        .eq("followed_id", user.id),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .is("read_at", null),
    ]);
    menuProfile = profile;
    followingCount = fc ?? 0;
    followerCount = flc ?? 0;
    unreadNotifications = nc ?? 0;
  }

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-[#f7f7f5] text-ink dark:bg-neutral-950 dark:text-neutral-100">
        <NextTopLoader color="#16223D" showSpinner={false} height={3} />
        {user ? <PresenceHeartbeat userId={user.id} /> : null}
        {user ? (
          <nav className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
            <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
              <Link href="/" className="whitespace-nowrap font-medium text-ink dark:text-white">
                Scholar Circle
              </Link>
              <LanguageSwitcher current={lang} />
              <div className="ml-auto flex items-center gap-3">
                <NotificationBell userId={user.id} initialCount={unreadNotifications} />
                <MobileMenu
                  displayName={menuProfile?.display_name ?? null}
                  username={menuProfile?.username ?? null}
                  isVerified={menuProfile?.is_verified ?? false}
                  avatarUrl={menuProfile?.avatar_url ?? null}
                  followingCount={followingCount}
                  followerCount={followerCount}
                  lang={lang}
                />
              </div>
            </div>
          </nav>
        ) : null}
        {user ? (
          <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        ) : (
          <main>{children}</main>
        )}
        {user ? <Footer /> : null}
      </body>
    </html>
  );
}