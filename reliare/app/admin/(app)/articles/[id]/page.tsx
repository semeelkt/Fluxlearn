import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/article-form";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  let article;
  try {
    article = await prisma.article.findUnique({ where: { id: params.id } });
  } catch {
    article = null;
  }
  if (!article) notFound();

  return (
    <div>
      <span className="issue-line">Edit</span>
      <h1 className="font-display text-3xl font-medium mt-2 mb-8">{article.title}</h1>
      <ArticleForm
        initial={{
          id: article.id,
          title: article.title,
          summary: article.summary,
          content: article.content,
          coverImage: article.coverImage ?? "",
          status: article.status,
          featured: article.featured,
          editorsPick: article.editorsPick,
          tags: article.tags.join(", "),
          readingTime: article.readingTime,
          authorId: article.authorId,
          categoryId: article.categoryId,
          references: article.references.join("\n"),
        }}
      />
    </div>
  );
}
