'use client';

import StoneFrame from "@/components/theme/StoneFrame";
import GoldText from "@/components/theme/GoldText";
import RunicDivider from "@/components/theme/RunicDivider";
import TopBar from "@/components/theme/TopBar";
import { useTranslation } from "@/context/I18nContext";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-parchment">
      {/* Background Image with darkening overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("/background.jpg")' }}
      />
      
      <TopBar />

      <main className="flex-1 z-10 p-8 md:p-16 max-w-5xl mx-auto w-full">
        <header className="text-center mb-16">
          <GoldText as="h1" className="text-5xl md:text-7xl mb-4 uppercase italic">{t('about.title')}</GoldText>
          <p className="text-parchment-dim text-lg italic">{t('about.subtitle')}</p>
          <RunicDivider className="max-w-xl mx-auto" />
        </header>

        <div className="space-y-12">
          {/* Story Section */}
          <section>
            <StoneFrame>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-48 h-48 flex-shrink-0 border-4 border-stone-highlight shadow-2xl relative overflow-hidden">
                   <img 
                    src="/my-photo.png" 
                    alt="The Developer" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 border-2 border-gold-etched/30 pointer-events-none" />
                </div>
                <div>
                  <GoldText as="h2" className="text-3xl mb-4">{t('about.aboutDev')}</GoldText>
                  <p className="mb-4 leading-relaxed italic text-gold-etched">
                    {t('about.devIntro')}
                  </p>
                  <p className="mb-4 leading-relaxed italic text-gold-etched">{t('about.storyTitle')}</p>
                  
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('about.vision')}</h3>
                  <p className="mb-6 leading-relaxed">
                    {t('about.visionDesc')}
                  </p>

                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('about.mission')}</h3>
                  <p className="mb-4 leading-relaxed">
                    {t('about.missionDesc')}
                  </p>

                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('about.soloDev')}</h3>
                  <p className="mb-4 leading-relaxed">
                    {t('about.soloDevDesc')}
                  </p>
                  <p className="leading-relaxed">
                    {t('about.collaboration')}
                  </p>
                </div>
              </div>
            </StoneFrame>
          </section>

          {/* Contact & Support */}
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <StoneFrame className="h-full">
                <GoldText as="h2" className="text-2xl mb-6">{t('about.contactInfo')}</GoldText>
                <div className="space-y-4">
                  <p className="text-sm opacity-80 italic mb-4">
                    {t('about.contactDesc')}
                  </p>
                  <div className="space-y-2">
                    <p><span className="text-gold-etched font-bold">Email:</span> aswespeak.tfx@gmail.com </p>
                    <p><span className="text-gold-etched font-bold">Discord:</span> dropdog </p>
                  </div>
                </div>
              </StoneFrame>
            </section>

            <section>
              <StoneFrame className="h-full">
                <GoldText as="h2" className="text-2xl mb-6">{t('about.supportTitle')}</GoldText>
                <p className="text-sm opacity-80 mb-4 leading-relaxed">
                  {t('about.supportDesc')}
                </p>
                <p className="text-xs italic mb-6 border-l-2 border-gold-etched pl-4">
                  {t('about.donationsDesc')}
                </p>
                
                <div className="grid grid-cols-1 gap-2 text-center">
                   <div className="p-2 border border-stone-highlight bg-black/40 hover:border-gold-etched transition-colors cursor-pointer">
                      <span className="text-gold-etched text-sm font-bold">{t('about.buyMeACoffee')}:</span> <span className="text-parchment-dim text-xs">[Link Here]</span>
                   </div>
                </div>
              </StoneFrame>
            </section>
          </div>

          <footer className="text-center pt-8">
            <RunicDivider className="max-w-md mx-auto" />
            <p className="italic text-gold-etched animate-pulse">
              {t('about.thankYou')}
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
