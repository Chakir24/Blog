'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface PublicSettings {
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
  fontPalette: string;
}

const defaultSettings: PublicSettings = {
  authorName: 'Manftou Hath',
  authorTitle: 'Auteure & créatrice de contenu',
  authorBio:
    "J'aime partager mes idées à travers la toile. Ce blog est mon espace pour écrire sur ce qui me touche : réflexions de vie, créativité, petits bonheurs et tout ce qui m'inspire. Si vous êtes ici, merci de faire partie du voyage.",
  authorImages: [],
  profileImage: '/profile.jpg',
  slogan: 'Réflexions · Créativité · Inspiration',
  siteName: 'Manftou Hath',
  tagline: 'Réflexions et idées à travers la toile',
  socialLinks: {
    facebook: '',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    gmail: 'contact@example.com',
  },
  fontPalette: 'syne',
};

const SettingsContext = createContext<PublicSettings>(defaultSettings);

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings);

  useEffect(() => {
    const load = () => {
      fetch('/api/settings/public', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => setSettings({ ...defaultSettings, ...data }))
        .catch(() => {});
    };
    load();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('refresh-settings', load);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('refresh-settings', load);
    };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
