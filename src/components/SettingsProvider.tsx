'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface PublicSettings {
  authorName: string;
  authorTitle: string;
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
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => setSettings({ ...defaultSettings, ...data }))
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
