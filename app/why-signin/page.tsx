export default function WhySigninPage() {
  return (
    <div className="prose prose-sm mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-lg font-medium">Why do I need to sign in?</h1>
      <p className="mt-4 text-sm text-ink/80">
        The landing pages, legal pages, and this explanation are open to anyone. Using the actual
        app — the feed, messaging, profiles, groups — requires an account. Here&apos;s why.
      </p>

      <h2 className="mt-6 text-sm font-medium">To keep the community real</h2>
      <p className="text-sm text-ink/80">
        Follow counts, comments, and messages only mean something if the people behind them are
        real students, not anonymous visitors. Requiring an account is what makes the network
        actually trustworthy.
      </p>

      <h2 className="mt-6 text-sm font-medium">To make the features work at all</h2>
      <p className="text-sm text-ink/80">
        Saving an opportunity, following someone, or sending a message only makes sense if
        there&apos;s an account to attach it to. Without sign-in, there&apos;s nowhere for any of
        that to live.
      </p>

      <h2 className="mt-6 text-sm font-medium">To let you post safely</h2>
      <p className="text-sm text-ink/80">
        When you post an opportunity, it&apos;s tied to your account — so if something needs to be
        corrected or removed, there&apos;s accountability, the same way it would work on any
        platform where people post publicly.
      </p>

      <h2 className="mt-6 text-sm font-medium">What sign-in doesn&apos;t require</h2>
      <p className="text-sm text-ink/80">
        You don&apos;t need to prove you&apos;re a student, use a school email, or pay anything.
        Any Google account or email address works.
      </p>
    </div>
  );
}