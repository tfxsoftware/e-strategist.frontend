'use client';

import React from 'react';
import RunicButton from './RunicButton';
import GoldText from './GoldText';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/context/I18nContext';

const TopBar = () => {
  const { t } = useTranslation();

  return (
    <nav className="w-full bg-stone-primary border-b-4 border-stone-shadow p-4 z-50 flex items-center justify-between shadow-2xl"
         style={{
           borderColor: 'var(--color-stone-highlight) var(--color-stone-shadow) var(--color-stone-shadow) var(--color-stone-highlight)',
         }}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
        <div className="w-8 h-8 bg-stone-shadow border border-gold-etched flex items-center justify-center">
          <span className="text-gold-etched font-bold text-lg">E</span>
        </div>
        <GoldText className="text-xl tracking-tighter">E-STRATEGIST</GoldText>
      </div>

      <div className="flex items-center gap-6">
        <LanguageSelector />
        <a href="/learn" className="text-parchment hover:text-gold-etched transition-colors uppercase font-bold text-sm tracking-widest">{t('common.learn')}</a>
        <a href="/about" className="text-parchment hover:text-gold-etched transition-colors uppercase font-bold text-sm tracking-widest">{t('common.about')}</a>
        <RunicButton variant="green" className="text-xs px-4 py-1">
          {t('common.playNow')}
        </RunicButton>
      </div>
    </nav>
  );
};

export default TopBar;
