export default function AccessibilityPage() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-lg font-medium">Accessibility statement</h1>
      <p className="text-xs text-ink/50">Last updated: July 2026</p>

      <p className="mt-4 text-sm text-ink/80">
        Scholar Circle is built to be usable by as many students as possible, including those
        using screen readers, keyboard navigation, or other assistive technology.
      </p>

      <h2 className="mt-6 text-sm font-medium">Our approach</h2>
      <p className="text-sm text-ink/80">
        We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA where
        practical, including readable color contrast, keyboard-operable controls, and clear text
        labels on interactive elements.
      </p>

      <h2 className="mt-6 text-sm font-medium">Known limitations</h2>
      <p className="text-sm text-ink/80">
        Scholar Circle is an early, actively developed app built by a single student, not a large
        team. Some areas may not yet be fully accessible. We&apos;re working to improve this over
        time.
      </p>

      <h2 className="mt-6 text-sm font-medium">Feedback</h2>
      <p className="text-sm text-ink/80">
        If you run into an accessibility barrier anywhere in the app, please tell us — it helps us
        prioritize fixes. Email{" "}
        <a href="mailto:aynalado03@gmail.com" className="underline">
          aynalado03@gmail.com
        </a>
        .
      </p>
    </div>
  );
}