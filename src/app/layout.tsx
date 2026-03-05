import type { Metadata, Viewport } from "next";
import { Syne, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LayoutChrome } from "@/components/LayoutChrome";
import { getSettings } from "@/lib/storage";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const seo = settings.seo ?? {
    metaTitle: "Blog | Réflexions et idées à travers la toile",
    metaDescription:
      "Un espace personnel pour partager mes réflexions, mes inspirations et tout ce qui me fait vibrer. Bienvenue dans mon coin d'Internet.",
    metaKeywords: "blog personnel, réflexions, créativité, lifestyle, inspiration, écriture",
    ogImage: "",
    robots: "index, follow",
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const ogImageUrl = seo.ogImage
    ? (seo.ogImage.startsWith("http") ? seo.ogImage : `${siteUrl}${seo.ogImage}`)
    : undefined;

  const keywords = seo.metaKeywords
    ? seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: keywords?.length ? keywords : undefined,
    robots: seo.robots || "index, follow",
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      type: "website",
      ...(ogImageUrl && { images: [{ url: ogImageUrl }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = stored || (prefersDark ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${syne.variable} ${instrumentSerif.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ThemeProvider>
          <LayoutChrome>{children}</LayoutChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
