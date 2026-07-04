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
      <body>
        <nav className="border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <Link href="/" className="whitespace-nowrap font-medium text-ink">
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