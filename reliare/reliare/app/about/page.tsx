export const metadata = { title: "About — Reliare" };

export default function AboutPage() {
  return (
    <main className="container py-20 max-w-2xl">
      <span className="issue-line">About</span>
      <h1 className="font-display text-[40px] italic font-medium mt-3 mb-8">Where Knowledge Meets Clarity.</h1>
      <div className="article-body">
        <p>
          Reliare publishes long-form writing on theology, history, jurisprudence, and ideas — work meant to
          be read carefully rather than skimmed. We publish articles alongside peer-reviewed research, and
          hold both to the same standard: clear argument, honest sourcing, and respect for the reader&rsquo;s time.
        </p>
        <p>
          Every piece carries an author, a date, and a full set of references. We do not publish anonymously,
          and we do not chase headlines.
        </p>
      </div>
    </main>
  );
}
