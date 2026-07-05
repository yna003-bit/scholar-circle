export default function FaqsPage() {
  return (
    <div className="prose prose-sm mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-lg font-medium">FAQs</h1>

      <p className="mt-4 text-sm font-medium text-ink">Who is Scholar Circle for?</p>
      <p className="text-sm text-ink/80">
        Any student looking for scholarships, sponsorships, grants, or academic opportunities, and
        anyone who wants to connect with other students on the same path.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">Is it free?</p>
      <p className="text-sm text-ink/80">
        Yes — see the{" "}
        <a href="/pricing" className="underline">
          Pricing
        </a>{" "}
        page for details.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">Do I need to be a student to sign up?</p>
      <p className="text-sm text-ink/80">
        No — any email or Google account can sign up. There&apos;s no student-status verification
        required.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">Who can post an opportunity?</p>
      <p className="text-sm text-ink/80">
        Anyone signed in. If you find a scholarship, sponsorship, or grant worth sharing, you can
        post it for others to see.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">Can I use Scholar Circle without signing in?</p>
      <p className="text-sm text-ink/80">
        You can browse pages like this one, the About page, and the legal pages without an account.
        Using the actual app — the feed, messaging, profiles — requires signing in. See{" "}
        <a href="/why-signin" className="underline">
          why sign-in is required
        </a>{" "}
        for the full explanation.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">How do I report a fake or scam listing?</p>
      <p className="text-sm text-ink/80">
        Email{" "}
        <a href="mailto:aynalado03@gmail.com" className="underline">
          aynalado03@gmail.com
        </a>{" "}
        with a link to the post. Scholar Circle doesn&apos;t administer or verify the opportunities
        themselves — always confirm details directly with the sponsor before applying or sharing
        personal information.
      </p>
    </div>
  );
}