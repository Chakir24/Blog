import { Hero } from "@/components/Hero";
import { ArticlesSection } from "@/components/ArticlesSection";
import { Expertise } from "@/components/Expertise";
import { Newsletter } from "@/components/Newsletter";
import { getArticlesList } from "@/lib/data";

export const revalidate = 60; // ISR: revalider toutes les 60 secondes

export default async function Home() {
  const articles = await getArticlesList();

  return (
    <main>
      <Hero />
      <ArticlesSection articles={articles} />
      <Expertise />
      <Newsletter />
    </main>
  );
}
