-- Schéma Supabase pour le blog Manftou Hath
-- Exécuter dans l'éditeur SQL du dashboard Supabase

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at TEXT NOT NULL,
  reading_time INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  author TEXT NOT NULL
);

-- Commentaires
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug);

-- Abonnés newsletter
CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  subscribed_at TEXT NOT NULL
);

-- Catégories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL
);

-- Paramètres (singleton, une seule ligne)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data JSONB NOT NULL DEFAULT '{}'
);

-- Insérer la ligne par défaut pour settings
INSERT INTO settings (id, data) VALUES (1, '{}')
ON CONFLICT (id) DO NOTHING;

-- Bucket Storage "uploads" pour les images
-- À créer dans Supabase Dashboard > Storage > New bucket :
--   - Nom : uploads
--   - Public bucket : activé (pour que les URLs d'images soient accessibles)
