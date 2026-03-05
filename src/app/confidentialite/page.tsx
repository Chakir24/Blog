import { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/storage';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `Politique de confidentialité | ${settings.siteName || 'Blog'}`,
  };
}

function renderContent(text: string) {
  if (!text.trim()) return null;
  return text.split(/\n\n+/).map((para, i) => (
    <p key={i} className="mb-4">
      {para.split('\n').map((line, j) => (
        <span key={j}>
          {line}
          {j < para.split('\n').length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
}

export default async function ConfidentialitePage() {
  const settings = await getSettings();
  const content = settings.privacyPolicy?.trim();
  const defaultContent = (
    <>
      <p>
        La politique de confidentialité sera à compléter selon vos pratiques de collecte de données.
      </p>
      <p>
        Ce site respecte la vie privée des visiteurs. Les données collectées via la newsletter sont
        utilisées uniquement pour l&apos;envoi des communications.
      </p>
    </>
  );

  return (
    <main className="min-h-screen pt-28 sm:pt-24">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-2xl font-bold sm:text-3xl md:text-4xl">
          Politique de confidentialité
        </h1>
        <div className="prose prose-sm mt-6 [&_p]:text-[var(--muted-foreground)] sm:prose-base md:prose-lg sm:mt-8">
          {content ? renderContent(content) : defaultContent}
        </div>
        <Link
          href="/"
          className="mt-8 inline-flex text-[var(--accent)] hover:underline"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
