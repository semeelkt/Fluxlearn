import { PrismaClient } from "@prisma/client";
import { categories, authors, articles, researchPapers } from "../lib/mock-data";
import { sampleArticleBody } from "../lib/article-content";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Reliare…");

  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const record = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug },
    });
    categoryMap.set(c.name, record.id);
  }

  const authorMap = new Map<string, string>();
  for (const a of authors) {
    const record = await prisma.author.upsert({
      where: { slug: a.slug },
      update: {},
      create: { name: a.name, slug: a.slug, photo: a.photo, bio: a.bio },
    });
    authorMap.set(a.slug, record.id);
  }

  for (const art of articles) {
    const categoryId = categoryMap.get(art.category);
    const authorId = authorMap.get(art.authorSlug);
    if (!categoryId || !authorId) continue;

    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        title: art.title,
        slug: art.slug,
        summary: art.summary,
        content: sampleArticleBody,
        coverImage: art.cover,
        status: "PUBLISHED",
        featured: !!art.editorsPick,
        editorsPick: !!art.editorsPick,
        tags: [art.category],
        readingTime: art.readingTime,
        views: Math.floor(Math.random() * 20000),
        publishedAt: new Date(art.date),
        authorId,
        categoryId,
        references: [
          "Al-Ghazali, Abu Hamid. al-Mustasfa min 'Ilm al-Usul. Cairo, 1937 ed.",
          "Hallaq, Wael B. A History of Islamic Legal Theories. Cambridge University Press, 1997.",
        ],
      },
    });
  }

  for (const p of researchPapers) {
    await prisma.researchPaper.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        abstract: p.abstract,
        authorName: p.author,
        journal: p.journal,
        publicationDate: new Date(p.date),
        coverImage: p.cover,
        pdfUrl: "https://example.com/placeholder.pdf",
      },
    });
  }

  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        siteName: "Reliare",
        tagline: "Where Knowledge Meets Clarity.",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
