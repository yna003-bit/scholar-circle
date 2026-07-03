import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Scholar Circle",
  description: "Find funding. Find your people.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <nav className="border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-medium text-ink">
              Scholar Circle
            </Link>
            {user ? (
              <div className="flex gap-4 text-sm text-ink/70">
                <Link href="/feed">Feed</Link>
                <Link href="/network">Network</Link>
                <Link href="/messages">Messages</Link>
                <Link href="/profile">Profile</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/settings">Settings</Link>
              </div>
            ) : null}
          </div>
        </nav>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}