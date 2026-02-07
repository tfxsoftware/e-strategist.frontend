'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/locales/en';
import { pt } from '@/locales/pt';

const translations = { en, pt };

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('e-strategist-locale');
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'pt')) {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'pt') {
        setLocale('pt');
      }
    }
  }, []);

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('e-strategist-locale', newLocale);
  };

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[locale];
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if key missing in current locale
        let fallback = translations['en'];
        for (const fkey of keys) {
            if (fallback[fkey] === undefined) return path;
            fallback = fallback[fkey];
        }
        return fallback;
      }
      current = current[key];
    }
    return current;
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
