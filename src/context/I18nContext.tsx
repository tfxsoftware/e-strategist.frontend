'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '@/locales/en';
import { pt } from '@/locales/pt';

const translations = { en, pt } as const;
type Locale = keyof typeof translations;

interface I18nContextType {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('e-strategist-locale');
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'pt')) {
      setLocale(savedLocale as Locale);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'pt') {
        setLocale('pt');
      }
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('e-strategist-locale', newLocale);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[locale];
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if key missing in current locale
        let fallback: any = translations['en'];
        for (const fkey of keys) {
            if (fallback[fkey] === undefined) return path;
            fallback = fallback[fkey];
        }
        return typeof fallback === 'string' ? fallback : path;
      }
      current = current[key];
    }
    return typeof current === 'string' ? current : path;
  };

  return (
    <I18nContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
