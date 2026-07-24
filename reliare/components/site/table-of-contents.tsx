export function TableOfContents({ items }: { items: { id: string; text: string }[] }) {
  if (!items.length) return null;
  return (
    <nav className="sticky top-28">
      <span className="issue-line block mb-4">Contents</span>
      <ol className="flex flex-col gap-3 border-l rule pl-5">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-[13px] font-sans text-muted dark:text-muted-dark hover:text-oxblood dark:hover:text-oxblood-light transition-colors leading-snug"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
