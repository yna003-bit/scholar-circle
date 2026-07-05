import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
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
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username, is_verified, avatar_url")
      .eq("id", user.id)
      .single();
    menuProfile = profile;

    const { count: fc } = await supabase
      .from("follows")
      .select("followed_id", { count: "exact", head: true })
      .eq("follower_id", user.id);
    followingCount = fc ?? 0;

    const { count: flc } = await supabase
      .from("follows")
      .select("follower_id", { count: "exact", head: true })
      .eq("followed_id", user.id);
    followerCount = flc ?? 0;

    const { count: nc } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null);
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
        {user ? <PresenceHeartbeat userId={user.id} /> : null}
        <nav className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <Link href="/" className="whitespace-nowrap font-medium text-ink dark:text-white">
              Scholar Circle
            </Link>
            {user ? (
              <>
                <LanguageSwitcher current={lang} />
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
              </>
            ) : null}
          </div>
        </nav>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}