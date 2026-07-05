export default function RequirementsPage() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-lg font-medium">Scholarship application requirements</h1>
      <p className="mt-2 text-sm text-ink/70 dark:text-neutral-300">
        A general guide to what most scholarship and university applications ask for, from
        bachelor&apos;s degree programs through postdoctoral positions. Requirements vary by
        country, university, and specific scholarship — always check the official requirements
        page for the program you&apos;re applying to before submitting.
      </p>

      <h2 className="mt-8 text-base font-medium">Bachelor&apos;s degree (undergraduate)</h2>
      <ul className="list-disc pl-5 text-sm text-ink/80 dark:text-neutral-300">
        <li>High school transcripts and diploma or certificate</li>
        <li>Standardized test scores where required (e.g. SAT, ACT)</li>
        <li>Letters of recommendation, usually from teachers</li>
        <li>Personal statement or application essay</li>
        <li>English (or program language) proficiency test if it&apos;s not your first language (IELTS, TOEFL, Duolingo English Test)</li>
        <li>Valid passport or national ID copy</li>
        <li>Proof of financial support or a sponsorship letter</li>
        <li>Application fee, if applicable</li>
      </ul>

      <h2 className="mt-8 text-base font-medium">Master&apos;s degree (postgraduate)</h2>
      <ul className="list-disc pl-5 text-sm text-ink/80 dark:text-neutral-300">
        <li>Bachelor&apos;s degree transcript and diploma</li>
        <li>Curriculum vitae (CV) or resume</li>
        <li>Statement of purpose or personal statement</li>
        <li>Two to three letters of recommendation, ideally from professors</li>
        <li>English proficiency test (IELTS, TOEFL, or PTE)</li>
        <li>GRE or GMAT scores, for programs that require them</li>
        <li>Valid passport</li>
        <li>Proof of funding or financial documents</li>
        <li>Portfolio or writing sample, for some fields (design, architecture, writing programs)</li>
      </ul>

      <h2 className="mt-8 text-base font-medium">PhD (doctoral)</h2>
      <ul className="list-disc pl-5 text-sm text-ink/80 dark:text-neutral-300">
        <li>Master&apos;s degree transcript and diploma (some direct-entry PhD programs accept a strong bachelor&apos;s degree)</li>
        <li>Research proposal outlining your intended area of study</li>
        <li>CV including any publications, conference presentations, or research experience</li>
        <li>Statement of purpose explaining your research interests and fit with the program</li>
        <li>Three letters of recommendation, usually from academic supervisors</li>
        <li>English proficiency test, if applicable</li>
        <li>GRE scores, for some programs</li>
        <li>Contact with a potential supervisor before applying, required by many programs</li>
        <li>Valid passport and financial documentation</li>
        <li>Interview, often required after shortlisting</li>
      </ul>

      <h2 className="mt-8 text-base font-medium">Postdoctoral positions</h2>
      <ul className="list-disc pl-5 text-sm text-ink/80 dark:text-neutral-300">
        <li>PhD certificate and transcript (or proof you&apos;re close to completion)</li>
        <li>Full CV including a complete publication list</li>
        <li>Research statement describing your work and how it aligns with the host lab or institution</li>
        <li>Cover letter addressed to the potential supervisor or hiring committee</li>
        <li>Two to three reference letters, often including your PhD supervisor</li>
        <li>Interview, typically required</li>
        <li>Passport and visa documentation for the host country</li>
        <li>Proof of independent funding, for positions that require it</li>
      </ul>

      <h2 className="mt-8 text-base font-medium">General tips</h2>
      <ul className="list-disc pl-5 text-sm text-ink/80 dark:text-neutral-300">
        <li>Start gathering recommendation letters early — professors and supervisors are often busy</li>
        <li>Keep a master CV updated year-round so you&apos;re never starting from scratch</li>
        <li>Read the specific scholarship&apos;s eligibility criteria carefully before applying</li>
        <li>Have someone else review your personal statement or research proposal before submitting</li>
        <li>Keep digital copies of every document you might need — transcripts, ID, test scores</li>
      </ul>

      <p className="mt-8 text-xs text-ink/40 dark:text-neutral-500">
        This page is a general guide, not official advice for any specific program. Always confirm
        exact requirements with the university or scholarship provider directly.
      </p>
    </div>
  );
}