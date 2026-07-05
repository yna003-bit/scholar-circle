import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function DemoPage() {
  return (
    <>
      <MarketingHeader />
      <div className="prose prose-sm mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-lg font-medium">How to use Scholar Circle</h1>
        <p className="mt-4 text-sm text-ink/80">
          There&apos;s no video walkthrough yet — this page is a written one instead, covering the
          core features step by step.
        </p>

        <h2 className="mt-6 text-sm font-medium">1. Sign in</h2>
        <p className="text-sm text-ink/80">Use Google or any email address — no student ID needed.</p>

        <h2 className="mt-6 text-sm font-medium">2. Browse the Feed</h2>
        <p className="text-sm text-ink/80">
          Every post is a scholarship, sponsorship, or grant. Like, comment, save, or repost anything
          useful. The search bar above the feed searches both posts and people.
        </p>

        <h2 className="mt-6 text-sm font-medium">3. Post an opportunity</h2>
        <p className="text-sm text-ink/80">
          Tap &quot;Post a scholarship or sponsorship,&quot; add a title and description, and
          optionally a picture. It&apos;s live for everyone immediately.
        </p>

        <h2 className="mt-6 text-sm font-medium">4. Build your network</h2>
        <p className="text-sm text-ink/80">
          In Network, follow students or send friend requests. Message anyone directly, or join a
          group for a shared interest.
        </p>

        <h2 className="mt-6 text-sm font-medium">5. Stay on top of things</h2>
        <p className="text-sm text-ink/80">
          Check Saved for bookmarked opportunities, the notification bell for activity on your posts
          and messages, and your Dashboard for a quick overview of your account.
        </p>
      </div>
      <MarketingFooter />
    </>
  );
}
