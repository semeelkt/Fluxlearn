import Link from "next/link";
import Image from "next/image";
import { authors } from "@/lib/mock-data";

export const metadata = { title: "Authors — Reliare" };

export default function AuthorsPage() {
  return (
    <main className="container py-16">
      <header className="max-w-2xl mb-12">
        <span className="issue-line">Contributors</span>
        <h1 className="font-display text-[40px] italic font-medium mt-3">Authors</h1>
      </header>
      <div className="max-w-3xl grid sm:grid-cols-2 gap-x-10 gap-y-10">
        {authors.map((a) => (
          <Link key={a.slug} href={`/authors/${a.slug}`} className="group flex gap-4 items-start">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-hairline/40">
              <Image src={a.photo} alt={a.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-display text-[19px] font-medium group-hover:text-oxblood transition-colors">
                {a.name}
              </h3>
              <p className="text-sm text-muted dark:text-muted-dark mt-1 leading-relaxed">{a.bio}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
