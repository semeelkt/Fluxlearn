export const metadata = { title: "Contact — Reliare" };

export default function ContactPage() {
  return (
    <main className="container py-20 max-w-xl">
      <span className="issue-line">Contact</span>
      <h1 className="font-display text-[40px] italic font-medium mt-3 mb-8">Get in Touch</h1>
      <form className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-sans uppercase tracking-wide text-muted dark:text-muted-dark">Name</span>
          <input className="bg-transparent border-b rule pb-2 focus:outline-none focus:border-oxblood transition-colors" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-sans uppercase tracking-wide text-muted dark:text-muted-dark">Email</span>
          <input type="email" className="bg-transparent border-b rule pb-2 focus:outline-none focus:border-oxblood transition-colors" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-xs font-sans uppercase tracking-wide text-muted dark:text-muted-dark">Message</span>
          <textarea rows={5} className="bg-transparent border-b rule pb-2 focus:outline-none focus:border-oxblood transition-colors" />
        </label>
        <button className="self-start px-6 py-2 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark text-xs uppercase tracking-wide font-sans hover:bg-oxblood transition-colors">
          Send Message
        </button>
      </form>
    </main>
  );
}
