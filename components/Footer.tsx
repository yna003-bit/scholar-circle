import Link from "next/link";

export function Footer() {
  const links = [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
    { href: "/accessibility", label: "Accessibility Statement" },
    { href: "/help", label: "Help Center" },
    { href: "/cookies", label: "Cookies" },
  ];

  return (
    <footer className="border-t border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-4 gap-y-2 px-4 py-6 text-xs text-ink/50 dark:text-neutral-400">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-ink/80 dark:hover:text-neutral-200">
            {l.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}