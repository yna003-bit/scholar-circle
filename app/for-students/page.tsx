import Link from "next/link";

export default function ForStudentsPage() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-lg font-medium">Scholar Circle for Students</h1>
      <p className="mt-4 text-sm text-ink/80">
        At its core, Scholar Circle is a place to find funding. Every post in the feed is a
        scholarship, sponsorship, grant, fellowship, or academic opportunity shared by another
        student — no ads, no unrelated content mixed in.
      </p>

      <h2 className="mt-6 text-sm font-medium">What you can do</h2>
      <ul className="list-disc pl-5 text-sm text-ink/80">
        <li>Browse opportunities from bachelor&apos;s level through postdoctoral positions</li>
        <li>Save any listing to come back to later, so nothing gets lost in a busy week</li>
        <li>See funding amount, deadline, and sponsor at a glance on every post</li>
        <li>
          Check the{" "}
          <Link href="/requirements" className="underline">
            requirements guide
          </Link>{" "}
          for what documents different application types usually need
        </li>
        <li>Post an opportunity yourself once you&apos;re signed in, so others can find it too</li>
      </ul>

      <h2 className="mt-6 text-sm font-medium">Who it&apos;s for</h2>
      <p className="text-sm text-ink/80">
        Anyone chasing funding for their education — whether you&apos;re just starting to look, or
        you&apos;ve got a shortlist of programs and want to stay on top of every deadline.
      </p>
    </div>
  );
}