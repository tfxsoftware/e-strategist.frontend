'use client';

import React, { useEffect, useState } from 'react';
import RunicButton from "@/components/theme/RunicButton";
import GoldText from "@/components/theme/GoldText";
import RunicDivider from "@/components/theme/RunicDivider";
import TopBar from "@/components/theme/TopBar";
import { useTranslation } from "@/context/I18nContext";

export default function Home() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Background Image with darkening overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url("/background.jpg")' }}
      />
      
      <TopBar />

      <section className="flex-1 flex flex-col items-center justify-center p-8 z-10">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black italic text-gold-etched drop-shadow-[0_5px_15px_rgba(0,0,0,1)] tracking-tighter mb-4 animate-pulse uppercase">
            {t('home.title')}
          </h1>
          <GoldText as="p" className="text-xl md:text-2xl text-parchment drop-shadow-md max-w-2xl mx-auto">
            {t('home.subtitle')}
          </GoldText>
          <RunicDivider className="max-w-md mx-auto" />
          
          <div className="mt-8 flex flex-col items-center">
            {isLoggedIn ? (
              <>
                <p className="text-parchment-dim italic mb-6 animate-pulse">
                  Welcome back, Commander. Your troops await.
                </p>
                <RunicButton variant="gold" className="text-xl px-12 py-4" onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard
                </RunicButton>
              </>
            ) : (
              <>
                <p className="text-parchment-dim italic mb-6 animate-pulse">
                  {t('home.registerDesc')}
                </p>
                <RunicButton variant="gold" className="text-xl px-12 py-4" onClick={() => window.location.href = '/auth/signup'}>
                  {t('common.registerNow')}
                </RunicButton>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
