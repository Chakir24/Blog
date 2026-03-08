'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ImagePlus, Save, Search, Shield, Trash2, Upload, User } from 'lucide-react';

interface SeoData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  robots: string;
}

interface SettingsData {
  authorName: string;
  authorTitle: string;
  authorBio: string;
  authorImages: string[];
  profileImage: string;
  slogan: string;
  siteName: string;
  tagline: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    gmail: string;
  };
  seo?: SeoData;
  legalMentions?: string;
  privacyPolicy?: string;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [uploadingAPropos, setUploadingAPropos] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const defaultSeo: SeoData = {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
    robots: 'index, follow',
  };
  const [form, setForm] = useState<SettingsData>({
    authorName: '',
    authorTitle: '',
    authorBio: '',
    authorImages: [],
    profileImage: '',
    slogan: '',
    siteName: '',
    tagline: '',
    socialLinks: { facebook: '', instagram: '', twitter: '', gmail: '' },
    seo: defaultSeo,
    legalMentions: '',
    privacyPolicy: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetch('/api/settings', { credentials: 'include', cache: 'no-store' })
      .then((res) => res.json())
        .then((data) => setForm((prev) => ({
        ...prev,
        ...data,
        authorBio: data.authorBio ?? '',
        authorImages: Array.isArray(data.authorImages) ? data.authorImages : [],
        seo: {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          ogImage: '',
          robots: 'index, follow',
          ...data.seo,
        },
        legalMentions: data.legalMentions ?? '',
        privacyPolicy: data.privacyPolicy ?? '',
      })))
      .catch(() => setMessage({ type: 'error', text: 'Erreur chargement' }))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload: Record<string, unknown> = { ...form };
      if (newPassword && newPassword.length >= 6) {
        if (newPassword !== confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        payload.adminPassword = newPassword;
      }
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      setMessage({ type: 'success', text: 'Paramètres enregistrés' });
      window.dispatchEvent(new CustomEvent('refresh-settings'));
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/settings/upload-profile', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      const newForm = { ...form, profileImage: data.url };
      setForm(newForm);
      // Sauvegarder immédiatement en base pour que le profil affiche la nouvelle image
      const saveRes = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: data.url }),
        credentials: 'include',
      });
      if (!saveRes.ok) throw new Error('Image uploadée mais erreur lors de l\'enregistrement');
      setMessage({ type: 'success', text: 'Image mise à jour' });
      window.dispatchEvent(new CustomEvent('refresh-settings'));
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur' });
    } finally {
      setUploading(false);
    }
  };

  const handleUploadAPropos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAPropos(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/settings/upload-a-propos', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      const newImages = [...(form.authorImages || []), data.url];
      setForm((f) => ({ ...f, authorImages: newImages }));
      const saveRes = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorImages: newImages }),
        credentials: 'include',
      });
      if (!saveRes.ok) throw new Error('Image uploadée mais erreur lors de l\'enregistrement');
      setMessage({ type: 'success', text: 'Image ajoutée à la page À propos' });
      window.dispatchEvent(new CustomEvent('refresh-settings'));
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur' });
    } finally {
      setUploadingAPropos(false);
      e.target.value = '';
    }
  };

  const removeAProposImage = async (index: number) => {
    const newImages = form.authorImages.filter((_, i) => i !== index);
    setForm((f) => ({ ...f, authorImages: newImages }));
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorImages: newImages }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur');
      setMessage({ type: 'success', text: 'Image supprimée' });
      window.dispatchEvent(new CustomEvent('refresh-settings'));
    } catch {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const handleUploadOg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingOg(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/settings/upload-og-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      const newSeo = { ...defaultSeo, ...form.seo, ogImage: data.url };
      setForm((f) => ({ ...f, seo: newSeo }));
      // Sauvegarder immédiatement en base
      const saveRes = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo: newSeo }),
        credentials: 'include',
      });
      if (!saveRes.ok) throw new Error('Image uploadée mais erreur lors de l\'enregistrement');
      setMessage({ type: 'success', text: 'Image Open Graph mise à jour' });
      window.dispatchEvent(new CustomEvent('refresh-settings'));
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur' });
    } finally {
      setUploadingOg(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div>
        <Link href="/admin" className="mb-8 inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <ArrowLeft size={18} />
          Retour
        </Link>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin"
        className="mb-8 inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={18} />
        Retour au tableau de bord
      </Link>

      <h1 className="font-serif text-2xl font-bold sm:text-3xl">Paramètres</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Personnalisez votre blog et vos informations
      </p>

      {message && (
        <div
          className={`mt-6 rounded-xl p-4 ${
            message.type === 'success' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/20 text-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 space-y-10">
        {/* Profil */}
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h2 className="mb-6 flex items-center gap-2 font-semibold">
            <User size={20} />
            Profil et image
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[var(--glass-border)] bg-[var(--glass)]">
                  {form.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.profileImage}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent)] to-violet-500 text-2xl font-bold text-white ${
                      form.profileImage ? 'hidden' : ''
                    }`}
                  >
                    {getInitials(form.authorName || 'MH')}
                  </div>
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm font-medium hover:bg-[var(--glass)]">
                  <Upload size={16} />
                  {uploading ? 'Upload...' : 'Changer l\'image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Nom (pour les initiales)</label>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                    placeholder="Manftou Hath"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Titre / sous-titre</label>
                  <input
                    type="text"
                    value={form.authorTitle}
                    onChange={(e) => setForm((f) => ({ ...f, authorTitle: e.target.value }))}
                    placeholder="Auteure & créatrice de contenu"
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Texte À propos (sous le titre)</label>
                  <textarea
                    rows={4}
                    value={form.authorBio}
                    onChange={(e) => setForm((f) => ({ ...f, authorBio: e.target.value }))}
                    placeholder="J'aime partager mes idées à travers la toile..."
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
                  />
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Texte affiché sur la page À propos, juste sous le titre (ex. bloggueuse)
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Images page À propos</label>
                  <p className="mb-3 text-xs text-[var(--muted-foreground)]">
                    Images affichées dans une galerie sur la page À propos
                  </p>
                  <div className="mb-3 flex flex-wrap gap-3">
                    {(form.authorImages || []).map((url, i) => (
                      <div key={url} className="relative group">
                        <div className="h-20 w-20 overflow-hidden rounded-xl border-2 border-[var(--card-border)] bg-[var(--glass)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="h-full w-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAProposImage(i)}
                          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm font-medium hover:bg-[var(--glass)]">
                    <ImagePlus size={16} />
                    {uploadingAPropos ? 'Upload...' : 'Ajouter une image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadAPropos}
                      disabled={uploadingAPropos}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">URL de l&apos;image (alternative)</label>
                  <input
                    type="text"
                    value={form.profileImage}
                    onChange={(e) => setForm((f) => ({ ...f, profileImage: e.target.value }))}
                    placeholder="/profile.jpg ou https://..."
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Slogan (badge accueil)</label>
              <input
                type="text"
                value={form.slogan}
                onChange={(e) => setForm((f) => ({ ...f, slogan: e.target.value }))}
                placeholder="Réflexions · Créativité · Inspiration"
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
          </div>
        </section>

        {/* Réseaux sociaux */}
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h2 className="mb-6 font-semibold">Réseaux sociaux</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Facebook</label>
              <input
                type="url"
                value={form.socialLinks.facebook}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialLinks: { ...f.socialLinks, facebook: e.target.value },
                  }))
                }
                placeholder="https://facebook.com/..."
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Instagram</label>
              <input
                type="url"
                value={form.socialLinks.instagram}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialLinks: { ...f.socialLinks, instagram: e.target.value },
                  }))
                }
                placeholder="https://instagram.com/..."
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Twitter / X</label>
              <input
                type="url"
                value={form.socialLinks.twitter}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialLinks: { ...f.socialLinks, twitter: e.target.value },
                  }))
                }
                placeholder="https://twitter.com/..."
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Email (Gmail)</label>
              <input
                type="email"
                value={form.socialLinks.gmail}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialLinks: { ...f.socialLinks, gmail: e.target.value },
                  }))
                }
                placeholder="votre@email.com"
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
          </div>
        </section>

        {/* SEO et référencement */}
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h2 className="mb-6 flex items-center gap-2 font-semibold">
            <Search size={20} />
            SEO et référencement web
          </h2>
          <p className="mb-6 text-sm text-[var(--muted-foreground)]">
            Ces informations apparaissent dans les résultats de recherche et lors du partage sur les réseaux sociaux.
          </p>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Titre meta</label>
              <input
                type="text"
                value={form.seo?.metaTitle ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    seo: { ...defaultSeo, ...f.seo, metaTitle: e.target.value },
                  }))
                }
                placeholder="Blog | Réflexions et idées à travers la toile"
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Description meta</label>
              <textarea
                rows={3}
                value={form.seo?.metaDescription ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    seo: { ...defaultSeo, ...f.seo, metaDescription: e.target.value },
                  }))
                }
                placeholder="Un espace personnel pour partager mes réflexions..."
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Mots-clés (séparés par des virgules)</label>
              <input
                type="text"
                value={form.seo?.metaKeywords ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    seo: { ...defaultSeo, ...f.seo, metaKeywords: e.target.value },
                  }))
                }
                placeholder="blog personnel, réflexions, créativité, lifestyle..."
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Image Open Graph</label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-[120px] w-[200px] shrink-0 overflow-hidden rounded-xl border-2 border-[var(--glass-border)] bg-[var(--glass)]">
                    {form.seo?.ogImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.seo.ogImage}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div
                      className={`flex h-full w-full items-center justify-center bg-[var(--muted)]/30 text-sm text-[var(--muted-foreground)] ${
                        form.seo?.ogImage ? 'hidden' : ''
                      }`}
                    >
                      Aperçu
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-2 text-sm font-medium hover:bg-[var(--glass)]">
                    <Upload size={16} />
                    {uploadingOg ? 'Import...' : 'Importer une image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadOg}
                      disabled={uploadingOg}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-2">
                  <span className="text-xs text-[var(--muted-foreground)]">ou saisir une URL</span>
                  <input
                    type="text"
                    value={form.seo?.ogImage ?? ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        seo: { ...defaultSeo, ...f.seo, ogImage: e.target.value },
                      }))
                    }
                    placeholder="/og-image.jpg ou https://..."
                    className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                Image affichée lors du partage sur Facebook, Twitter, etc. (recommandé : 1200×630 px)
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Directive robots</label>
              <select
                value={form.seo?.robots ?? 'index, follow'}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    seo: { ...defaultSeo, ...f.seo, robots: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              >
                <option value="index, follow">index, follow — Indexer et suivre les liens</option>
                <option value="noindex, nofollow">noindex, nofollow — Ne pas indexer</option>
                <option value="index, nofollow">index, nofollow — Indexer sans suivre les liens</option>
              </select>
            </div>
          </div>
        </section>

        {/* Mentions légales et confidentialité */}
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h2 className="mb-6 flex items-center gap-2 font-semibold">
            <FileText size={20} />
            Mentions légales et confidentialité
          </h2>
          <p className="mb-6 text-sm text-[var(--muted-foreground)]">
            Ces textes sont affichés sur les pages <Link href="/mentions" className="text-[var(--accent)] hover:underline">/mentions</Link> et <Link href="/confidentialite" className="text-[var(--accent)] hover:underline">/confidentialite</Link>. Laissez vide pour afficher un texte par défaut.
          </p>
          <div className="space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <FileText size={16} />
                Mentions légales
              </label>
              <textarea
                rows={8}
                value={form.legalMentions ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, legalMentions: e.target.value }))}
                placeholder="Éditeur du site, hébergeur, propriété intellectuelle, etc."
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Shield size={16} />
                Politique de confidentialité
              </label>
              <textarea
                rows={8}
                value={form.privacyPolicy ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, privacyPolicy: e.target.value }))}
                placeholder="Collecte des données, cookies, newsletter, droits des utilisateurs..."
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3 font-mono text-sm"
              />
            </div>
          </div>
        </section>

        {/* Mot de passe admin */}
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          <h2 className="mb-6 font-semibold">Mot de passe Admin</h2>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            Laissez vide pour conserver le mot de passe actuel
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Confirmer</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] px-4 py-3"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3 font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
