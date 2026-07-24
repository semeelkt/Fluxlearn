import Link from "next/link";

type PopularItem = { title: string; slug: string; date: string; views: number };

export function PopularSidebar({ items }: { items: PopularItem[] }) {
  return (
    <aside>
      <h2 className="issue-line pb-3 border-b rule mb-1">Popular This Week</h2>
      <ol>
        {items.map((item, i) => (
          <li key={item.slug} className="border-b rule last:border-none">
            <Link href={`/articles/${item.slug}`} className="group flex gap-4 py-5 items-baseline">
              <span className="font-display text-[22px] italic text-hairline dark:text-hairline-dark w-7 shrink-0 group-hover:text-oxblood transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-[16px] leading-snug font-medium group-hover:text-oxblood dark:group-hover:text-oxblood-light transition-colors">
                  {item.title}
                </h3>
                <div className="mt-1.5 text-xs font-sans text-muted dark:text-muted-dark">
                  {item.date} · {item.views.toLocaleString()} views
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
