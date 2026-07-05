import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function ConnectionsPage() {
  return (
    <>
      <MarketingHeader />
      <div className="prose prose-sm mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-lg font-medium">Scholar Circle for Making Connections</h1>
        <p className="mt-4 text-sm text-ink/80">
          Looking for funding alone is harder than it needs to be. Scholar Circle is built so you can
          find other students on the same path, not just opportunities.
        </p>

        <h2 className="mt-6 text-sm font-medium">Ways to connect</h2>
        <ul className="list-disc pl-5 text-sm text-ink/80">
          <li>Follow students whose posts or comments you find useful</li>
          <li>Send friend requests to build a smaller, closer circle</li>
          <li>Message anyone directly, with real-time delivery and read receipts</li>
          <li>Join or start a group for a specific school, country, or field of study</li>
          <li>Tag someone with @username in a post, comment, or message to bring them into it</li>
        </ul>

        <h2 className="mt-6 text-sm font-medium">Why it matters</h2>
        <p className="text-sm text-ink/80">
          Someone who applied to a program last year, or is applying alongside you right now, is
          often more useful than another search result. The people are part of the platform, not an
          afterthought.
        </p>
      </div>
      <MarketingFooter />
    </>
  );
}
