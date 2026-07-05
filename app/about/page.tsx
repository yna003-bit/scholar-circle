import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function AboutPage() {
  return (
    <>
      <MarketingHeader />
      <div className="prose prose-sm mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-lg font-medium">About Scholar Circle</h1>

      <p className="mt-4 text-sm text-ink/80">
        Scholar Circle exists to put scholarship and sponsorship opportunities within easy reach
        of students, instead of scattered across flyers, group chats, and forgotten emails. It
        brings opportunities into one place, and gives students a way to follow, connect, and
        support each other while they look for funding.
      </p>

      <h2 className="mt-6 text-sm font-medium">Why it exists</h2>
      <p className="text-sm text-ink/80">
        One of my habits is looking for ways to make scholarship and sponsorship opportunities
        easier to find for the people around me — instead of information staying scattered across
        flyers, group chats, and posts you scroll past and never see again. I built Scholar Circle
        out of that habit: a single place where opportunities are easy to find, and where students
        can follow and support each other while they look for funding. It started as something
        small for my own community, and I hope it keeps growing into something genuinely useful
        for students well beyond it.
      </p>

      <h2 className="mt-6 text-sm font-medium">Built by</h2>
      <p className="text-sm text-ink/80">Yusuf Ahmed Nalado</p>

      <h2 className="mt-6 text-sm font-medium">Contact</h2>
      <p className="text-sm text-ink/80">
        <a href="mailto:aynalado03@gmail.com" className="underline">
          aynalado03@gmail.com
        </a>
      </p>

      <p className="mt-8 text-xs text-ink/40">© 2026 Scholar Circle. All rights reserved.</p>
      </div>
      <MarketingFooter />
    </>
  );
}
