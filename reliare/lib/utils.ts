import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Injects id attributes into <h2>/<h3> tags in TipTap-generated HTML and
// returns both the updated HTML and a flat table-of-contents list built from h2s.
export function addHeadingAnchors(html: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const used = new Set<string>();

  const updated = html.replace(/<(h[23])>(.*?)<\/\1>/g, (_match, tag: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!id) id = "section";
    let unique = id;
    let n = 1;
    while (used.has(unique)) unique = `${id}-${++n}`;
    used.add(unique);
    if (tag === "h2") toc.push({ id: unique, text });
    return `<${tag} id="${unique}">${inner}</${tag}>`;
  });

  return { html: updated, toc };
}
