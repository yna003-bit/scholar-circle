export default function CookiesPage() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-lg font-medium">Cookies</h1>
      <p className="text-xs text-ink/50">Last updated: July 2026</p>

      <p className="mt-4 text-sm text-ink/80">
        A cookie is a small piece of data a website stores in your browser so it can remember
        things about you between visits.
      </p>

      <h2 className="mt-6 text-sm font-medium">What we use</h2>
      <p className="text-sm text-ink/80">
        Scholar Circle uses one essential cookie to keep you signed in as you move between pages.
        Without it, you&apos;d need to log in again on every page.
      </p>

      <h2 className="mt-6 text-sm font-medium">What we don&apos;t use</h2>
      <p className="text-sm text-ink/80">
        We don&apos;t use advertising cookies, analytics cookies, or any cookies that track you
        across other websites. This cookie exists only to run the app itself.
      </p>

      <h2 className="mt-6 text-sm font-medium">Your choices</h2>
      <p className="text-sm text-ink/80">
        Because this cookie is required for sign-in to work, blocking it will prevent you from
        staying logged in. You can clear it anytime through your browser&apos;s settings, which will
        simply sign you out.
      </p>

      <h2 className="mt-6 text-sm font-medium">More information</h2>
      <p className="text-sm text-ink/80">
        See our{" "}
        <a href="/privacy" className="underline">
          Privacy Policy
        </a>{" "}
        for how we handle your data more broadly.
      </p>
    </div>
  );
}