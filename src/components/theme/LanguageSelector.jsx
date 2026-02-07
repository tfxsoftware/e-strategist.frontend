'use client';

import React from 'react';
import { useTranslation } from '@/context/I18nContext';

const LanguageSelector = () => {
  const { locale, changeLocale } = useTranslation();

  return (
    <div className="flex gap-2 items-center mr-4">
      <button 
        onClick={() => changeLocale('en')}
        className={`px-2 py-1 text-xs font-bold border transition-colors flex items-center gap-2 ${
          locale === 'en' 
            ? 'bg-gold-etched text-black border-gold-etched' 
            : 'bg-black/40 text-parchment-dim border-stone-highlight hover:border-gold-etched'
        }`}
      >
        <svg viewBox="0 0 640 480" className="w-4 h-3 shadow-sm border border-black/20">
          <path fill="#012169" d="M0 0h640v480H0z"/>
          <path fill="#FFF" d="M0 0h640v40H0zm0 80h640v40H0zm0 80h640v40H0zm0 80h640v40H0zm0 80h640v40H0zm0 80h640v40H0z"/>
          <path fill="#C8102E" d="M0 40h640v40H0zm0 80h640v40H0zm0 80h640v40H0zm0 80h640v40H0zm0 80h640v40H0zm0 80h640v40H0z"/>
          <path fill="#012169" d="M0 0h256v240H0z"/>
          <g fill="#FFF">
            <g id="s">
              <g id="t">
                <path id="u" d="M30 22l-7.2 22.2L42 30.6H18l19.2 13.6z"/>
                <use href="#u" x="40"/>
                <use href="#u" x="80"/>
                <use href="#u" x="120"/>
                <use href="#u" x="160"/>
              </g>
              <use href="#t" y="40" x="20"/>
              <use href="#t" y="80"/>
              <use href="#t" y="120" x="20"/>
              <use href="#t" y="160"/>
              <use href="#t" y="200" x="20"/>
            </g>
          </g>
        </svg>
        EN
      </button>
      <button 
        onClick={() => changeLocale('pt')}
        className={`px-2 py-1 text-xs font-bold border transition-colors flex items-center gap-2 ${
          locale === 'pt' 
            ? 'bg-gold-etched text-black border-gold-etched' 
            : 'bg-black/40 text-parchment-dim border-stone-highlight hover:border-gold-etched'
        }`}
      >
        <svg viewBox="0 0 640 480" className="w-4 h-3 shadow-sm border border-black/20">
          <path fill="#009b3a" d="M0 0h640v480H0z"/>
          <path fill="#fedf00" d="M320 40L40 240l280 200 280-200z"/>
          <circle fill="#002776" cx="320" cy="240" r="105"/>
          <path fill="#fff" d="M225 255c20 15 50 25 95 25 35 0 70-10 95-25v-10c-25 15-60 25-95 25-45 0-75-10-95-25z"/>
        </svg>
        PT
      </button>
    </div>
  );
};

export default LanguageSelector;
