'use client';

import StoneFrame from "@/components/theme/StoneFrame";
import GoldText from "@/components/theme/GoldText";
import RunicDivider from "@/components/theme/RunicDivider";
import TopBar from "@/components/theme/TopBar";
import { useTranslation } from "@/context/I18nContext";

export default function LearnPage() {
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
          <GoldText as="h1" className="text-5xl md:text-7xl mb-4 uppercase italic">{t('learn.title')}</GoldText>
          <p className="text-parchment-dim text-lg italic">{t('learn.subtitle')}</p>
          <RunicDivider className="max-w-xl mx-auto" />
        </header>

        <div className="space-y-12">
          {/* Hero System */}
          <section>
            <StoneFrame>
              <GoldText as="h2" className="text-3xl mb-6">{t('learn.heroicFoundations')}</GoldText>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.thePool')}</h3>
                  <p className="mb-4 leading-relaxed">
                    {t('learn.thePoolDesc')}
                  </p>
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.rolesArchetypes')}</h3>
                  <ul className="list-disc list-inside space-y-1 mb-4 text-sm opacity-90">
                    <li><span className="text-gold-etched">{t('learn.roles')}:</span> Top, Mid, Jungle, Carry (ADC), and Support.</li>
                    <li><span className="text-gold-etched">{t('learn.archetypes')}:</span> Mage, Assassin, Bruiser, Tank, Enchanter, and Marksman.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.metaDynamics')}</h3>
                  <p className="mb-4 leading-relaxed">
                    {t('learn.metaDynamicsDesc')}
                  </p>
                  <p className="text-sm italic border-l-2 border-gold-etched pl-4">
                    "{t('learn.metaQuote')}"
                  </p>
                </div>
              </div>
            </StoneFrame>
          </section>

          {/* Player Management */}
          <section>
            <StoneFrame>
              <GoldText as="h2" className="text-3xl mb-6">{t('learn.theMercenaryLife')}</GoldText>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.rookieSystem')}</h3>
                  <p className="mb-4 leading-relaxed">
                    {t('learn.rookieSystemDesc')}
                  </p>
                  <ul className="grid grid-cols-1 gap-2 text-sm">
                    <li className="bg-black/30 p-2 rounded border border-stone-highlight/20">
                      <span className="text-cyan-400 font-bold">{t('learn.traits.adaptive').split(':')[0]}:</span> {t('learn.traits.adaptive').split(':')[1]}
                    </li>
                    <li className="bg-black/30 p-2 rounded border border-stone-highlight/20">
                      <span className="text-gold-glow font-bold">{t('learn.traits.leader').split(':')[0]}:</span> {t('learn.traits.leader').split(':')[1]}
                    </li>
                    <li className="bg-black/30 p-2 rounded border border-stone-highlight/20">
                      <span className="text-emerald-400 font-bold">{t('learn.traits.teamPlayer').split(':')[0]}:</span> {t('learn.traits.teamPlayer').split(':')[1]}
                    </li>
                    <li className="bg-black/30 p-2 rounded border border-stone-highlight/20">
                      <span className="text-purple-400 font-bold">{t('learn.traits.loneWolf').split(':')[0]}:</span> {t('learn.traits.loneWolf').split(':')[1]}
                    </li>
                    <li className="bg-black/30 p-2 rounded border border-stone-highlight/20">
                      <span className="text-amber-400 font-bold">{t('learn.traits.inspiring').split(':')[0]}:</span> {t('learn.traits.inspiring').split(':')[1]}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.masteryEconomics')}</h3>
                  <p className="mb-4 leading-relaxed">
                    {t('learn.masteryDesc')}
                  </p>
                  <p className="text-sm mb-6">
                    {t('learn.economicsDesc')}
                  </p>
                  
                  <div className="p-4 border border-dashed border-gold-etched/30 bg-black/40">
                    <GoldText as="h4" className="text-lg mb-1">{t('learn.playerDrivenEconomy')}</GoldText>
                    <p className="text-xs uppercase tracking-widest text-gold-glow animate-pulse font-bold">{t('common.comingSoon')}</p>
                    <p className="text-xs mt-2 opacity-70 italic">{t('learn.economySoon')}</p>
                  </div>
                </div>
              </div>
            </StoneFrame>
          </section>

          {/* Archetypes Section */}
          <section>
            <StoneFrame>
              <GoldText as="h2" className="text-3xl mb-6">{t('learn.heroArchetypes')}</GoldText>
              <p className="mb-8 leading-relaxed">
                {t('learn.archetypesIntro')}
              </p>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {[
                  { id: "tank", syn: "Mage, Enchanter", count: "Assassin, Marksman", bad: "Bruiser, Mage" },
                  { id: "bruiser", syn: "Assassin, Tank", count: "Tank, Enchanter", bad: "Mage, Marksman" },
                  { id: "assassin", syn: "Bruiser, Enchanter", count: "Mage, Marksman", bad: "Tank, Enchanter" },
                  { id: "mage", syn: "Tank, Marksman", count: "Bruiser, Tank", bad: "Assassin, Enchanter" },
                  { id: "marksman", syn: "Enchanter, Tank", count: "Bruiser, Enchanter", bad: "Tank, Assassin" },
                  { id: "enchanter", syn: "Marksman, Assassin", count: "Assassin, Mage", bad: "Bruiser, Marksman" }
                ].map((arc) => (
                  <div key={arc.id} className="bg-black/40 border border-stone-highlight/30 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <GoldText as="h3" className="text-xl">{t(`learn.archetypesList.${arc.id}.name`)}</GoldText>
                    </div>
                    <p className="text-xs italic mb-4 text-parchment-dim">{t(`learn.archetypesList.${arc.id}.desc`)}</p>
                    <div className="space-y-2 mt-auto">
                      <div className="text-[10px] uppercase tracking-tighter">
                        <span className="text-arcane-glow font-bold">{t('learn.synergizes')}:</span> <span className="text-parchment/80">{arc.syn}</span>
                      </div>
                      <div className="text-[10px] uppercase tracking-tighter">
                        <span className="text-gold-glow font-bold">{t('learn.counters')}:</span> <span className="text-parchment/80">{arc.count}</span>
                      </div>
                      <div className="text-[10px] uppercase tracking-tighter">
                        <span className="text-blood-glow font-bold">{t('learn.counteredBy')}:</span> <span className="text-parchment/80">{arc.bad}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-arcane-green/5 border border-arcane-glow/20">
                  <h4 className="text-arcane-glow text-sm font-bold uppercase mb-2">{t('learn.synergyPower')}</h4>
                  <p className="text-xs leading-relaxed opacity-80">
                    {t('learn.synergyPowerDesc')}
                  </p>
                </div>
                <div className="p-4 bg-blood-red/5 border border-blood-glow/20">
                  <h4 className="text-blood-glow text-sm font-bold uppercase mb-2">{t('learn.countersLethality')}</h4>
                  <p className="text-xs leading-relaxed opacity-80">
                    {t('learn.countersLethalityDesc')}
                  </p>
                </div>
              </div>
            </StoneFrame>
          </section>

          {/* Roster & Team Dynamics */}
          <section>
            <StoneFrame>
              <GoldText as="h2" className="text-3xl mb-6">{t('learn.commandCohesion')}</GoldText>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-black/20 border border-stone-highlight/10">
                  <div className="text-blood-glow text-xl font-bold mb-1 italic">{t('learn.morale')}</div>
                  <p className="text-xs">{t('learn.moraleDesc')}</p>
                </div>
                <div className="text-center p-4 bg-black/20 border border-stone-highlight/10">
                  <div className="text-gold-etched text-xl font-bold mb-1 italic">{t('learn.cohesion')}</div>
                  <p className="text-xs">{t('learn.cohesionDesc')}</p>
                </div>
                <div className="text-center p-4 bg-black/20 border border-stone-highlight/10">
                  <div className="text-arcane-glow text-xl font-bold mb-1 italic">{t('learn.energy')}</div>
                  <p className="text-xs">{t('learn.energyDesc')}</p>
                </div>
              </div>
            </StoneFrame>
          </section>

          {/* Match Engine */}
          <section>
            <StoneFrame>
              <GoldText as="h2" className="text-3xl mb-6">{t('learn.crucibleBattle')}</GoldText>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.draftPhase')}</h3>
                    <p className="text-sm leading-relaxed">
                      {t('learn.draftPhaseDesc')}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.simulationLogic')}</h3>
                    <p className="text-sm leading-relaxed">
                      {t('learn.simulationLogicDesc')}
                    </p>
                  </div>
                </div>
                <div className="bg-black/40 p-4 border-2 border-dashed border-stone-shadow">
                  <h4 className="text-xs uppercase text-gold-etched/60 mb-2">{t('learn.postMatch')}</h4>
                  <p className="text-xs leading-relaxed opacity-80">
                    {t('learn.postMatchDesc')}
                  </p>
                </div>
              </div>
            </StoneFrame>
          </section>

          {/* Event & League Management */}
          <section>
            <StoneFrame>
              <GoldText as="h2" className="text-3xl mb-6">{t('learn.orchestratingConquest')}</GoldText>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.leaguesTournaments')}</h3>
                  <p className="leading-relaxed mb-4">
                    {t('learn.leaguesDesc')}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-center p-6 border border-gold-etched/30 bg-gold-etched/5">
                   <GoldText className="text-2xl mb-2">{t('learn.prizePools')}</GoldText>
                   <p className="text-center text-sm italic">
                     {t('learn.prizePoolsDesc')}
                   </p>
                </div>
              </div>
            </StoneFrame>
          </section>

          {/* Training & Development */}
          <section className="pb-16">
            <StoneFrame>
              <GoldText as="h2" className="text-3xl mb-6">{t('learn.citadelBootcamps')}</GoldText>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.intensiveTraining')}</h3>
                  <p className="leading-relaxed mb-4">
                    {t('learn.trainingDesc')}
                  </p>
                  <h3 className="text-gold-etched font-bold mb-2 uppercase tracking-tight">{t('learn.specialization')}</h3>
                  <p className="leading-relaxed">
                    {t('learn.specializationDesc')}
                  </p>
                </div>
                <div className="w-full md:w-1/3 p-4 bg-arcane-green/10 border border-arcane-glow/30 text-center">
                  <span className="text-arcane-glow font-bold text-lg uppercase tracking-tighter">Growth Through Discipline</span>
                </div>
              </div>
            </StoneFrame>
          </section>
        </div>
      </main>

      <footer className="z-10 p-8 border-t border-stone-shadow bg-stone-primary/50 text-center">
        <GoldText className="text-sm opacity-50 italic">E-Strategist Management Interface &copy; 2026</GoldText>
      </footer>
    </div>
  );
}
