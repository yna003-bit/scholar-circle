import Link from "next/link";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { LandingSidebar } from "@/components/LandingSidebar";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" });

function DeadlineChip({ label, tone = "urgent" }: { label: string; tone?: "urgent" | "funded" | "info" }) {
  const styles = {
    urgent: "bg-red-50 text-red-600 border-red-100",
    funded: "bg-green-50 text-green-700 border-green-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-tight ${styles}`}
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {label}
    </span>
  );
}

function FloatingBadge({ emoji, label, className }: { emoji: string; label: string; className: string }) {
  return (
    <div
      className={`absolute hidden items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] md:flex ${className}`}
      style={{ animation: "float 6s ease-in-out infinite" }}
    >
      <span className="text-lg">{emoji}</span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-base font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function PersonaCard({
  href,
  title,
  description,
  accent,
}: {
  href: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <span className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold ${accent}`}>
        ●
      </span>
      <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
      <span className="mt-4 text-sm font-medium text-[#2563EB] group-hover:underline">Learn more →</span>
    </Link>
  );
}

export default function WelcomePage() {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} bg-white`} style={{ fontFamily: "var(--font-body)" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
            .fade-up { animation: fadeUp 0.7s ease-out both; }
            @media (prefers-reduced-motion: reduce) {
              * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
            }
          `,
        }}
      />

      {/* Nav — no sign-in button up front, just the logo and the sidebar */}
      <nav className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/welcome" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Scholar Circle" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
              Scholar Circle
            </span>
          </Link>
          <LandingSidebar />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-24">
          <div className="fade-up">
            <h1
              className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Scholarships shouldn&apos;t be hidden.
              <br />
              Opportunities should find you.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-500">
              Discover scholarships, sponsorships, grants, and academic opportunities from across
              the world in one place. Follow opportunities, connect with students, and never miss
              a deadline again.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-[#2563EB] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-[#1D4ED8]"
              >
                Join Scholar Circle
              </Link>
              <a
                href="#showcase"
                className="rounded-full border border-slate-200 px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Explore Opportunities
              </a>
            </div>
          </div>

          <div className="relative fade-up" style={{ animationDelay: "0.15s" }}>
            <FloatingBadge emoji="🎓" label="Scholarship Alert" className="-left-4 top-4 rotate-[-4deg]" />
            <FloatingBadge emoji="💰" label="Fully Funded" className="-right-6 top-24 rotate-[3deg]" />
            <FloatingBadge emoji="⏰" label="Deadline in 3 Days" className="-left-8 bottom-16 rotate-[2deg]" />
            <FloatingBadge emoji="🌍" label="International" className="-right-4 bottom-0 rotate-[-3deg]" />

            <div className="mx-auto max-w-sm rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_30px_80px_-20px_rgb(37,99,235,0.25)]">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  Your feed
                </span>
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <div className="space-y-2.5">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">DAAD Master&apos;s Grant</p>
                    <DeadlineChip label="12d left" tone="urgent" />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Germany · Fully funded</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">Chevening Fellowship</p>
                    <DeadlineChip label="Funded" tone="funded" />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">United Kingdom · Postgraduate</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800">Mandela Rhodes</p>
                    <DeadlineChip label="Open" tone="info" />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">South Africa · Leadership</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three persona cards — immediately visible below the hero */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          Three ways to think about Scholar Circle.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <PersonaCard
            href="/for-students"
            title="Scholar Circle for Students"
            description="A place built around the search for funding — scholarships, grants, and sponsorships in one feed."
            accent="bg-blue-50 text-blue-600"
          />
          <PersonaCard
            href="/connections"
            title="Scholar Circle for Making Connections"
            description="Follow, message, and build a network of students chasing similar goals."
            accent="bg-amber-50 text-amber-600"
          />
          <PersonaCard
            href="/social-platform"
            title="Explore Scholar Circle as a Social Platform"
            description="Posts, comments, groups, and profiles — a social space built specifically for students."
            accent="bg-green-50 text-green-600"
          />
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-400">
            Helping students discover opportunities faster
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
            Scholar Circle is built to make scholarships, sponsorships, grants, and academic
            opportunities easier to find, track, and access.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Opportunities Shared</p>
              <p className="mt-1 text-sm text-slate-500">Curated from trusted sources, all in one place.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Students Connected</p>
              <p className="mt-1 text-sm text-slate-500">
                A growing community of students supporting and learning from one another.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Funding Organizations</p>
              <p className="mt-1 text-sm text-slate-500">
                Opportunities from universities, foundations, governments, and global sponsors.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">New Opportunities Added Daily</p>
              <p className="mt-1 text-sm text-slate-500">
                Stay updated with fresh opportunities and never miss an important deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 rounded-3xl border border-slate-100 bg-slate-50/60 p-8 md:order-1">
            <div className="space-y-3">
              {["WhatsApp groups", "Flyers", "Emails", "Telegram channels"].map((s) => (
                <div key={s} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 opacity-70">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-500">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
              Finding scholarships shouldn&apos;t feel like detective work.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              Students miss life-changing opportunities every day because information is scattered
              across social media, flyers, emails, and dozens of websites. Scholar Circle brings
              everything together into one simple platform.
            </p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-slate-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            One place for every opportunity.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Discover Opportunities"
              description="Browse scholarships, sponsorships, grants, internships, fellowships, and competitions."
            />
            <FeatureCard
              title="Save and Track"
              description="Bookmark opportunities and keep them in one place so nothing slips through."
            />
            <FeatureCard
              title="Connect With Students"
              description="Build a network of students pursuing similar goals."
            />
            <FeatureCard
              title="Never Miss Deadlines"
              description="See deadlines clearly on every listing before applications close."
            />
          </div>
        </div>
      </section>

      {/* Product showcase */}
      <section id="showcase" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          See it in action.
        </h2>
        <div className="mt-14 space-y-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Opportunity Feed</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Every listing, at a glance.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Funding amount, eligibility, deadline, country, and category — the details you need
                to decide fast, without opening ten tabs.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Future Engineers Grant</p>
                  <DeadlineChip label="3d left" tone="urgent" />
                </div>
                <p className="mt-1 text-xs text-slate-400">Netherlands · Engineering · €2,500</p>
                <p className="mt-3 text-xs text-slate-500">Open to bachelor&apos;s and master&apos;s students.</p>
              </div>
            </div>
          </div>

          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-5 md:order-1">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  AO
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Amara Okafor</p>
                  <p className="text-xs text-slate-400">34 followers · Water Resources</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Student Network</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Find people chasing the same goals.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Follow other students, see who&apos;s applying to what, and build a network instead
                of searching alone.
              </p>
            </div>
          </div>

          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Personalized Dashboard</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Everything you&apos;ve saved, in one view.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Saved opportunities and account activity, tracked in a simple dashboard.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-mono)" }}>
                    4
                  </p>
                  <p className="text-xs text-slate-400">Saved</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-mono)" }}>
                    12
                  </p>
                  <p className="text-xs text-slate-400">Followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50/60 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            How it works.
          </h2>
          <div className="mt-14 space-y-10">
            {[
              { n: "1", title: "Create your profile", body: "Tell us your academic interests and goals." },
              { n: "2", title: "Discover opportunities", body: "Browse scholarships, grants, and sponsorships as they're posted." },
              { n: "3", title: "Apply and succeed", body: "Track applications and connect with others on the same journey." },
            ].map((step) => (
              <div key={step.n} className="flex gap-5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-semibold text-white"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
          Opportunity hunting is better together.
        </h2>
        <div className="mt-12 space-y-4">
          {[
            { name: "Rian Tanaka", text: "Just got shortlisted for the Erasmus scholarship." },
            { name: "Lena Mensah", text: "Anyone applying for the DAAD program this year?" },
            { name: "Yusuf A.", text: "Here's a guide that helped me put together a stronger proposal." },
          ].map((m) => (
            <div key={m.name} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                {m.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{m.name}</p>
                <p className="text-sm text-slate-500">{m.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Scholar Circle */}
      <section className="bg-slate-50/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Why Scholar Circle.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="text-base font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Curated opportunities
              </h3>
              <p className="mt-2 text-sm text-slate-500">No spam. Only relevant opportunities.</p>
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Student community
              </h3>
              <p className="mt-2 text-sm text-slate-500">Connect with people chasing similar goals.</p>
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Built by a student
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Created by someone who understands the struggle of finding funding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why sign in */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Why do I need to sign in?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Scholar Circle is a community, not just a listings page. Signing in lets you save
            opportunities so they don&apos;t get lost, follow other students and get notified when
            they post, message people directly, and post opportunities yourself under your own
            name. It also keeps the community made up of real students, not anonymous visitors —
            which is what makes the follow graph, comments, and messaging actually trustworthy.
            Browsing the marketing pages here never requires an account; only the app itself does.
          </p>
          <Link href="/why-signin" className="mt-4 inline-block text-sm font-medium text-[#2563EB] hover:underline">
            Read the full explanation →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-[#1D4ED8] to-[#2563EB] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Your next scholarship could change your future.
          </h2>
          <p className="mt-4 text-base text-blue-100">
            Join students discovering opportunities, building connections, and taking control of
            their academic journey.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#1D4ED8] transition-transform hover:scale-105"
          >
            Join Scholar Circle Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <Link href="/about" className="hover:text-slate-800">About</Link>
            <Link href="/privacy" className="hover:text-slate-800">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-800">Terms of Use</Link>
            <Link href="/accessibility" className="hover:text-slate-800">Accessibility Statement</Link>
            <Link href="/help" className="hover:text-slate-800">Help Center</Link>
            <Link href="/cookies" className="hover:text-slate-800">Cookies</Link>
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">
            Scholar Circle — Bringing opportunities closer to students.
          </p>
        </div>
      </footer>
    </div>
  );
}
