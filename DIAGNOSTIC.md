# Diagnostic des fonctionnalités en production

## Utilisation

Ouvre dans ton navigateur (en production) :

```
https://ton-site.vercel.app/api/diagnostic
```

Le diagnostic vérifie automatiquement :

| Vérification | Description |
|--------------|-------------|
| `env` | Variables d'environnement (Supabase, ADMIN_PASSWORD) |
| `supabase` | Connexion à la base Supabase |
| `auth` | Session admin (cookie `admin_session`) |
| `read_articles` | Lecture des articles |
| `read_categories` | Lecture des catégories |
| `read_settings` | Lecture des paramètres |
| `read_comments` | Lecture des commentaires |
| `read_subscribers` | Lecture des abonnés newsletter |

## Interprétation

### `auth: ok: false`
- **Cause** : Cookie de session absent ou expiré
- **Solution** : Reconnecte-toi via `/admin/login`
- **En production** : Le cookie peut ne pas être envoyé si tu accèdes au site depuis un lien externe. Navigue directement vers ton URL (ex. `https://blog.vercel.app`) puis connecte-toi.

### `env: ok: false`
- **Cause** : Variables manquantes sur Vercel
- **Solution** : Vercel > Project > Settings > Environment Variables. Ajoute `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`.

### `supabase: ok: false`
- **Cause** : Connexion Supabase échouée
- **Solution** : Vérifie les clés, exécute `supabase/schema.sql`, crée le bucket `uploads`.

### `read_*: ok: false`
- **Cause** : Erreur lors de la lecture des données
- **Solution** : Vérifie le schéma SQL, les tables, et les politiques RLS si activées.

## Fonctionnalités par type

### Server Actions (auth via cookies serveur)
- ✅ Ajout / modification / suppression d'articles
- ✅ Ajout / suppression de catégories

### API Routes (auth via cookie dans la requête)
- Articles : GET (public), POST/PUT/DELETE (admin)
- Catégories : GET (public), POST/DELETE (admin)
- Commentaires : GET, POST (public), PATCH/DELETE (admin)
- Paramètres : GET/PUT (admin), GET public (settings/public)
- Newsletter : POST (public), GET/notify (admin)
- Uploads : profile, og-image (admin)

### Points de défaillance en production
1. **Cookie non envoyé** : `credentials: 'include'` sur les fetches, `sameSite: 'lax'`
2. **Variables manquantes** : Vérifier Vercel env
3. **Supabase** : Bucket `uploads` public, schéma exécuté
