# Déploiement du blog

## Vercel (recommandé avec GitHub)

[Vercel](https://vercel.com) est le créateur de Next.js et offre un déploiement optimisé.

### Avantages
- Gratuit pour projets personnels
- Déploiement automatique à chaque `git push`
- Configuration quasi automatique pour Next.js
- CDN global et performances élevées

### Stockage : Supabase (recommandé)

Le blog utilise **Supabase** pour la persistance des données. Cela permet un déploiement correct sur Vercel.


---

## Déploiement sur Vercel

### 1. Pousser le projet sur GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/TON_REPO.git
git push -u origin main
```

### 2. Connecter à Vercel
1. Va sur [vercel.com](https://vercel.com) et crée un compte (connexion GitHub possible)
2. **Add New** → **Project**
3. Importe ton dépôt GitHub
4. Vercel détecte Next.js : aucune config supplémentaire nécessaire
5. Clique sur **Deploy**

### 3. Configurer Supabase
1. Crée un projet sur [supabase.com](https://supabase.com)
2. Dans **SQL Editor**, exécute le contenu de `supabase/schema.sql`
3. Dans **Storage**, crée un bucket nommé `uploads` (public)
4. Récupère l’URL du projet et la clé **service_role** (Settings → API)

### 4. Variables d'environnement
Dans **Project Settings** → **Environment Variables** :

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role (secrète) |
| `ADMIN_PASSWORD` | Mot de passe admin |
| `ADMIN_PASSWORD_SALT` | Sel pour le hachage (optionnel) |
| `NEXT_PUBLIC_SITE_URL` | URL du site (ex: https://ton-blog.vercel.app) |
| `RESEND_API_KEY` | Clé API Resend (newsletter) |
| `NEWSLETTER_FROM_EMAIL` | Email expéditeur |

### 5. Migration des données existantes
Si tu as des données dans `data/*.json`, exécute une fois :
```bash
npx tsx scripts/migrate-to-supabase.ts
```
(avec les variables Supabase dans `.env.local`)

### 6. Déploiement via CLI (sans GitHub)
```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

---

## Alternative : Railway

Tu peux aussi déployer sur [Railway](https://railway.app). Supabase reste requis pour les données.

---

## Variables d'environnement (tous hébergeurs)

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Oui | Clé service_role Supabase |
| `ADMIN_PASSWORD` | Oui | Mot de passe du tableau de bord admin |
| `ADMIN_PASSWORD_SALT` | Non | Sel pour le hachage |
| `NEXT_PUBLIC_SITE_URL` | Recommandé | URL publique du site |
| `RESEND_API_KEY` | Pour newsletter | Clé API Resend |
| `NEWSLETTER_FROM_EMAIL` | Pour newsletter | Email expéditeur (ex: onboarding@resend.dev) |
