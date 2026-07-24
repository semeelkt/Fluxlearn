import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t rule mt-24">
      <div className="container py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="font-display text-2xl mb-3">Reliare</div>
          <p className="text-sm text-muted dark:text-muted-dark max-w-xs leading-relaxed">
            A home for careful writing — theology, research, and education, published without noise.
          </p>
        </div>

        <FooterCol
          title="Explore"
          links={[
            { href: "/articles", label: "Articles" },
            { href: "/research", label: "Research" },
            { href: "/categories", label: "Categories" },
            { href: "/authors", label: "Authors" },
          ]}
        />
        <FooterCol
          title="Reliare"
          links={[
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
          ]}
        />
        <div>
          <div className="issue-line mb-4">Follow</div>
          <div className="flex flex-col gap-2 text-sm">
            <a href="#" className="hover:text-oxblood transition-colors">Twitter / X</a>
            <a href="#" className="hover:text-oxblood transition-colors">Instagram</a>
            <a href="#" className="hover:text-oxblood transition-colors">RSS</a>
          </div>
        </div>
      </div>
      <div className="border-t rule py-6">
        <div className="container flex items-center justify-between text-xs text-muted dark:text-muted-dark">
          <span>© {new Date().getFullYear()} Reliare. All rights reserved.</span>
          <span className="issue-line">Where Knowledge Meets Clarity.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <div className="issue-line mb-4">{title}</div>
      <div className="flex flex-col gap-2 text-sm">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-oxblood dark:hover:text-oxblood-light transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
