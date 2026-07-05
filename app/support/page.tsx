export default function SupportPage() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-lg font-medium">Support</h1>
      <p className="mt-4 text-sm text-ink/80">
        Something not working, or have a question we haven&apos;t answered elsewhere? Reach out
        directly.
      </p>

      <p className="mt-4 text-sm text-ink/80">
        Email{" "}
        <a href="mailto:aynalado03@gmail.com" className="underline">
          aynalado03@gmail.com
        </a>{" "}
        with what happened, and a screenshot if you have one — that&apos;s usually the fastest way
        to get a fix.
      </p>

      <p className="mt-4 text-sm text-ink/80">
        For common issues like sign-in trouble or messages not showing up, check the{" "}
        <a href="/help" className="underline">
          Help Center
        </a>{" "}
        first — the answer might already be there.
      </p>
    </div>
  );
}