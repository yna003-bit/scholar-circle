import "./globals.css";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SearchBar } from "@/components/SearchBar";
import { MobileMenu } from "@/components/MobileMenu";
import { Footer } from "@/components/Footer";

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
        <nav className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <Link href="/" className="whitespace-nowrap font-medium text-ink dark:text-white">
              Scholar Circle
            </Link>
            {user ? (
              <>
                <SearchBar />
                <MobileMenu />
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