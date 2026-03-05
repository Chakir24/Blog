import { ArticleForm } from '../ArticleForm';

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Nouvel article</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Créez un nouvel article pour votre blog
      </p>
      <ArticleForm />
    </div>
  );
}
