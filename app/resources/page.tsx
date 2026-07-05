import Link from "next/link";

export default function ResourcesPage() {
  return (
    <div className="prose prose-sm mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-lg font-medium">Resources</h1>
      <p className="mt-4 text-sm text-ink/80">
        A few places to start, beyond the live feed of opportunities.
      </p>

      <ul className="list-disc pl-5 text-sm text-ink/80">
        <li>
          <Link href="/requirements" className="underline">
            Scholarship application requirements
          </Link>{" "}
          — a general guide covering bachelor&apos;s through postdoctoral applications
        </li>
        <li>
          <Link href="/demo" className="underline">
            How to use Scholar Circle
          </Link>{" "}
          — a walkthrough of the core features
        </li>
        <li>
          <Link href="/faqs" className="underline">
            FAQs
          </Link>{" "}
          — quick answers to common questions about the platform
        </li>
        <li>
          <Link href="/support" className="underline">
            Support
          </Link>{" "}
          — how to get help or report a problem
        </li>
      </ul>

      <p className="mt-6 text-sm text-ink/80">
        More resources — study guides, application tips, and country-specific advice — will be
        added here as the community grows.
      </p>
    </div>
  );
}