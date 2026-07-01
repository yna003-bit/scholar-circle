import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Scholar Circle",
  description: "Find funding. Find your people.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/feed" className="font-medium text-ink">
              Scholar Circle
            </Link>
            <div className="flex gap-4 text-sm text-ink/70">
              <Link href="/feed">Feed</Link>
              <Link href="/network">Network</Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
