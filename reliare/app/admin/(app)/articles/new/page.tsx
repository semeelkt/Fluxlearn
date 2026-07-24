import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  return (
    <div>
      <span className="issue-line">New</span>
      <h1 className="font-display text-3xl font-medium mt-2 mb-8">Write an Article</h1>
      <ArticleForm />
    </div>
  );
}
