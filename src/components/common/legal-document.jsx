import PageBanner from "../ui/page-banner";

export default function LegalDocument({ title, intro, sections }) {
  return (
    <>
      <PageBanner title={title} text={intro} crumb={title} />
      <article className="mx-auto my-10 max-w-4xl px-6 pb-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur md:p-10">
          <p className="text-xs font-medium text-slate-500">
            Last updated: October 28, 2026
          </p>
          <div className="mt-7 space-y-8">
            {sections.map(({ title: sectionTitle, content }) => (
              <section key={sectionTitle}>
                <h2 className="text-lg font-bold text-blue-950">{sectionTitle}</h2>
                <div className="mt-2 space-y-3 text-sm leading-7 text-slate-600">
                  {content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
