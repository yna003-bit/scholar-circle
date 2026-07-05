import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function HelpPage() {
  return (
    <>
      <MarketingHeader />
      <div className="prose prose-sm mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-lg font-medium">Help center</h1>

      <h2 className="mt-6 text-sm font-medium">FAQs</h2>

      <p className="mt-4 text-sm font-medium text-ink">How do I post a scholarship or sponsorship?</p>
      <p className="text-sm text-ink/80">
        Go to Feed and click &quot;Post a scholarship or sponsorship.&quot; Add a title and a
        description with the details — sponsor, amount, deadline, and how to apply.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">How do I find other students?</p>
      <p className="text-sm text-ink/80">
        Use the search bar in the header to search by name or username, or browse the Network
        page to see everyone on Scholar Circle.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">
        What&apos;s the difference between Follow and Add Friend?
      </p>
      <p className="text-sm text-ink/80">
        Following is one-directional and public — anyone can see who follows whom. Friend
        requests need to be accepted by the other person, similar to other social apps.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">How do I set my username?</p>
      <p className="text-sm text-ink/80">
        Go to Profile and enter a username in the form. Usernames are lowercase letters, numbers,
        and underscores only, and must be unique.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">Is Scholar Circle free?</p>
      <p className="text-sm text-ink/80">
        Yes, completely free to use for students.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">How do I delete my account?</p>
      <p className="text-sm text-ink/80">
        Go to Settings, or email{" "}
        <a href="mailto:aynalado03@gmail.com" className="underline">
          aynalado03@gmail.com
        </a>{" "}
        and we&apos;ll remove your account and data.
      </p>

      <h2 className="mt-8 text-sm font-medium">Troubleshooting</h2>

      <p className="mt-4 text-sm font-medium text-ink">I can&apos;t sign in</p>
      <p className="text-sm text-ink/80">
        Double-check you&apos;re using the same sign-in method (Google or the same email) you used
        originally. If you signed in with a magic link, make sure you clicked the most recent
        email — older links expire.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">I didn&apos;t receive the sign-in email</p>
      <p className="text-sm text-ink/80">
        Check your spam or junk folder. If it&apos;s not there after a few minutes, try requesting
        the link again.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">Messages aren&apos;t showing up instantly</p>
      <p className="text-sm text-ink/80">
        Try refreshing the page. If it keeps happening, let us know — this uses a live connection
        that can occasionally drop.
      </p>

      <p className="mt-4 text-sm font-medium text-ink">Something else is broken</p>
      <p className="text-sm text-ink/80">
        Email{" "}
        <a href="mailto:aynalado03@gmail.com" className="underline">
          aynalado03@gmail.com
        </a>{" "}
        with what happened and, if possible, a screenshot.
      </p>
      </div>
      <MarketingFooter />
    </>
  );
}
