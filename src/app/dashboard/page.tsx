'use client';

import React, { DragEvent, useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { playerService } from '@/services/playerService';
import { DashboardResponse } from '@/types/dashboard';
import type { DiscoveredRookie, PlayerDetails } from '@/types/player';
import { useHeroesStore } from '@/store/heroesStore';
import StoneFrame from "@/components/theme/StoneFrame";
import GoldText from "@/components/theme/GoldText";
import RunicButton from "@/components/theme/RunicButton";
import RunicDivider from "@/components/theme/RunicDivider";
import TopBar from "@/components/theme/TopBar";
import { useTranslation } from "@/context/I18nContext";

const TRAIT_COLORS: Record<string, string> = {
  ADAPTIVE: 'border-arcane-glow/50 bg-arcane-green/20 text-arcane-glow',
  LEADER: 'border-amber-500/50 bg-amber-900/30 text-amber-300',
  TEAM_PLAYER: 'border-sky-400/50 bg-sky-500/20 text-sky-300',
  LONE_WOLF: 'border-blood-glow/50 bg-blood-red/20 text-blood-glow',
  INSPIRING: 'border-violet-400/50 bg-violet-500/20 text-violet-300',
  CLUTCH_FACTOR: 'border-rose-400/50 bg-rose-500/20 text-rose-300',
};

function getTraitClasses(traitKey: string): string {
  return TRAIT_COLORS[traitKey] ?? 'border-gold-etched/50 bg-gold-etched/10 text-gold-etched';
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<{
    rosterId: string;
    playerId: string;
    playerName: string;
  } | null>(null);
  const [showCreateRoster, setShowCreateRoster] = useState(false);
  const [newRosterName, setNewRosterName] = useState('');
  const [newRosterRegion, setNewRosterRegion] = useState('SOUTH_AMERICA');
  const [discoveredRookie, setDiscoveredRookie] = useState<DiscoveredRookie | null>(null);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [showDiscoverLimitModal, setShowDiscoverLimitModal] = useState(false);
  const [viewedPlayer, setViewedPlayer] = useState<PlayerDetails | null>(null);
  const [viewedPlayerSource, setViewedPlayerSource] = useState<'discover' | 'click' | null>(null);
  const [playerDetailsLoading, setPlayerDetailsLoading] = useState(false);
  const fetchHeroes = useHeroesStore((s) => s.fetchHeroes);
  const heroes = useHeroesStore((s) => s.heroes);
  const getHeroById = useHeroesStore((s) => s.getHeroById);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardService.getDashboardData();
        setData(response);
      } catch (err: any) {
        setError(err.message || t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <GoldText className="text-2xl animate-pulse uppercase tracking-[0.2em]">{t('common.loading')}</GoldText>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
        <GoldText className="text-2xl mb-4 text-blood-glow uppercase">{t('common.error')}</GoldText>
        <p className="text-parchment-dim mb-8">{error}</p>
        <RunicButton variant="gold" onClick={() => window.location.reload()}>Retry</RunicButton>
      </div>
    );
  }

  const rosters = data?.rosters ?? [];
  const players = data?.players ?? [];

  const regionOptions = ['SOUTH_AMERICA', 'NORTH_AMERICA', 'EUROPE', 'CIS', 'ASIA'];

  const validRosterNames = new Set(rosters.map((r) => r.name));
  const playersByRoster: Record<string, typeof players> = {};
  const inactivePlayers: typeof players = [];

  players.forEach((player) => {
    if (player.rosterName && validRosterNames.has(player.rosterName)) {
      if (!playersByRoster[player.rosterName]) {
        playersByRoster[player.rosterName] = [];
      }
      playersByRoster[player.rosterName].push(player);
    } else {
      inactivePlayers.push(player);
    }
  });

  const handlePlayerDragStart = (
    event: DragEvent<HTMLElement>,
    playerId: string,
    source: 'roster' | 'inactive',
    rosterId?: string
  ) => {
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'player',
        playerId,
        source,
        rosterId: rosterId ?? null,
      }),
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDropToInactive = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();

    const raw = event.dataTransfer.getData('application/json');
    if (!raw) return;

    let payload: { type: string; playerId: string; source: string; rosterId?: string | null };
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    if (payload.type !== 'player' || payload.source !== 'roster' || !payload.rosterId) return;

    const player = players.find((p) => p.id === payload.playerId);

    setPendingRemoval({
      rosterId: payload.rosterId,
      playerId: payload.playerId,
      playerName: player?.nickname ?? '',
    });
  };

  const handleDropToRoster = async (event: DragEvent<HTMLElement>, rosterId: string) => {
    event.preventDefault();

    const raw = event.dataTransfer.getData('application/json');
    if (!raw) return;

    let payload: { type: string; playerId: string; source: string };
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    if (payload.type !== 'player' || payload.source !== 'inactive') return;

    const movedPlayerId = payload.playerId;
    const targetRoster = rosters.find((r) => r.id === rosterId);
    if (!targetRoster) return;

    try {
      const updatedRoster = await dashboardService.updateRoster(rosterId, {
        addPlayerIds: [payload.playerId],
        removePlayerIds: [],
      });

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          rosters: prev.rosters.map((r) =>
            r.id === updatedRoster.id
              ? { ...r, cohesion: updatedRoster.cohesion, energy: updatedRoster.energy, morale: updatedRoster.morale }
              : r
          ),
          players: prev.players.map((p) =>
            p.id === movedPlayerId ? { ...p, rosterName: targetRoster.name } : p
          ),
        };
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update roster.');
    }
  };

  const handleConfirmRemoval = async () => {
    if (!pendingRemoval) return;

    try {
      const updatedRoster = await dashboardService.updateRoster(pendingRemoval.rosterId, {
        addPlayerIds: [],
        removePlayerIds: [pendingRemoval.playerId],
      });

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          rosters: prev.rosters.map((r) =>
            r.id === updatedRoster.id
              ? { ...r, cohesion: updatedRoster.cohesion, energy: updatedRoster.energy, morale: updatedRoster.morale }
              : r
          ),
          players: prev.players.map((p) =>
            p.id === pendingRemoval.playerId ? { ...p, rosterName: '' } : p
          ),
        };
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update roster.');
    } finally {
      setPendingRemoval(null);
    }
  };

  const handleCancelRemoval = () => {
    setPendingRemoval(null);
  };

  const handleDiscoverRookie = async () => {
    setDiscoverLoading(true);
    setShowDiscoverLimitModal(false);
    setDiscoveredRookie(null);
    setViewedPlayer(null);
    try {
      const rookie = await playerService.discoverRookie();
      setDiscoveredRookie(rookie);
      setViewedPlayer(rookie);
      setViewedPlayerSource('discover');
      setData((prev) => {
        if (!prev) return prev;
        const newPlayer = {
          id: rookie.id,
          nickname: rookie.nickname,
          pictureUrl: rookie.pictureUrl,
          rosterName: '',
          condition: rookie.condition,
          traits: rookie.traits,
          salary: rookie.salary,
          nextSalaryPaymentDate: rookie.nextSalaryPaymentDate,
          isStar: rookie.star,
        };
        return { ...prev, players: [...prev.players, newPlayer] };
      });
    } catch (err: any) {
      const isLimitError = err.status === 409 || (typeof err.message === 'string' && (err.message.includes('maximum') || err.message.includes('Cannot recruit')));
      if (isLimitError) {
        setShowDiscoverLimitModal(true);
      } else {
        setError(err.message || 'Failed to discover rookie.');
      }
    } finally {
      setDiscoverLoading(false);
    }
  };

  const handlePlayerClick = async (playerId: string) => {
    setPlayerDetailsLoading(true);
    setViewedPlayer(null);
    setViewedPlayerSource(null);
    try {
      const details = await playerService.getPlayer(playerId);
      setViewedPlayer(details);
      setViewedPlayerSource('click');
    } catch (err: any) {
      setError(err.message || 'Failed to load player.');
    } finally {
      setPlayerDetailsLoading(false);
    }
  };

  const closePlayerModal = () => {
    setViewedPlayer(null);
    setViewedPlayerSource(null);
    setDiscoveredRookie(null);
  };

  const handleOpenCreateRoster = () => {
    setNewRosterName('');
    setNewRosterRegion(data?.profile.region ?? 'SOUTH_AMERICA');
    setShowCreateRoster(true);
  };

  const handleCreateRoster = async () => {
    const trimmedName = newRosterName.trim();
    if (!trimmedName) return;

    try {
      const roster = await dashboardService.createRoster(trimmedName, newRosterRegion);
      setData((prev) => (prev ? { ...prev, rosters: [...prev.rosters, roster] } : prev));
      setShowCreateRoster(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create roster.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-parchment">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: 'url("/background.jpg")' }}
      />
      
      <TopBar />

      <main className="flex-1 z-10 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <GoldText as="h1" className="text-3xl md:text-4xl uppercase tracking-tighter">{t('dashboard.title')}</GoldText>
            <p className="text-parchment-dim italic text-sm">{t('dashboard.welcome')}, {data?.profile.username}</p>
          </div>
          <div className="flex items-center gap-6 bg-stone-900/50 p-4 border border-stone-highlight rounded-sm">
            <div className="text-center">
              <p className="text-[10px] uppercase text-gold-etched font-bold tracking-widest">{t('common.region')}</p>
              <p className="font-bold text-parchment uppercase">{data?.profile.region.replace('_', ' ')}</p>
            </div>
            <div className="w-px h-8 bg-stone-highlight" />
            <div className="text-center">
              <p className="text-[10px] uppercase text-gold-etched font-bold tracking-widest">{t('common.balance')}</p>
              <p className="font-bold text-arcane-glow">₼ {data?.profile.balance.toLocaleString()}</p>
            </div>
          </div>
        </header>

        {/* Feature Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {['leagues', 'training', 'market', 'archives', 'scouting', 'finance'].map((feature) => (
            <RunicButton 
              key={feature} 
              variant="stone" 
              className="py-3 text-xs uppercase font-bold tracking-widest"
              onClick={() => {
                if (feature === 'archives') window.location.href = '/learn';
              }}
            >
              {t(`dashboard.features.${feature}`)}
            </RunicButton>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Next Match & Inactive Players */}
          <div className="lg:col-span-1 space-y-8">
            <section>
              <GoldText as="h2" className="text-xl mb-4 uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-gold-etched rotate-45 inline-block" />
                {t('common.nextMatch')}
              </GoldText>
              <StoneFrame className="p-6 text-center">
                {data?.nextMatch ? (
                  <div>
                    <p className="text-gold-etched text-sm uppercase mb-2 tracking-widest">Upcoming Battle</p>
                    <p className="text-2xl font-black mb-1">{data.nextMatch.opponentName}</p>
                    <p className="text-parchment-dim text-xs italic">{new Date(data.nextMatch.scheduledAt).toLocaleString()}</p>
                    <RunicButton variant="gold" className="mt-4 w-full">Join Room</RunicButton>
                  </div>
                ) : (
                  <p className="text-parchment-dim italic text-sm py-4">{t('dashboard.noNextMatch')}</p>
                )}
              </StoneFrame>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <GoldText as="h2" className="text-xl uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold-etched rotate-45 inline-block" />
                  {t('dashboard.inactivePlayers')}
                </GoldText>
                <RunicButton
                  variant="green"
                  className="text-[10px] px-3 py-1 uppercase tracking-widest"
                  onClick={handleDiscoverRookie}
                  disabled={discoverLoading}
                >
                  {discoverLoading ? t('common.loading') : t('dashboard.discoverRookie')}
                </RunicButton>
              </div>
              <div
                className="mb-4 border-2 border-dashed border-stone-highlight/40 bg-black/20 py-6 px-3 text-center"
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDropToInactive}
              >
                <p className="text-[11px] text-parchment-dim uppercase tracking-[0.15em]">
                  {t('dashboard.dragToRemoveHint')}
                </p>
              </div>
              <div className="space-y-4">
                {inactivePlayers.length ? inactivePlayers.map((player) => (
                  <StoneFrame key={player.id} className="p-4">
                    <div
                      className="flex gap-4 items-center cursor-pointer"
                      draggable
                      onDragStart={(event) =>
                        handlePlayerDragStart(event, player.id, 'inactive')
                      }
                      onClick={() => handlePlayerClick(player.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handlePlayerClick(player.id)}
                    >
                      <div className="w-16 h-16 bg-stone-900 border border-gold-etched/30 relative overflow-hidden flex-shrink-0">
                        <img src={player.pictureUrl} alt={player.nickname} className="w-full h-full object-cover" />
                        {player.isStar && (
                          <div className="absolute top-0 right-0 bg-gold-etched text-black text-[8px] font-bold px-1 py-0.5">STAR</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-parchment truncate uppercase leading-tight">{player.nickname}</h3>
                        <p className="text-[10px] text-parchment-dim truncate italic mb-1">{player.rosterName}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-[9px] font-bold uppercase px-1 border ${
                            player.condition === 'HEALTHY' ? 'border-arcane-glow/30 text-arcane-glow' : 'border-blood-glow/30 text-blood-glow'
                          }`}>
                            {t(`common.condition.${player.condition}`) !== `common.condition.${player.condition}` ? t(`common.condition.${player.condition}`) : player.condition}
                          </span>
                          {player.traits.map(trait => {
                            const name = t(`dashboard.traits.${trait}.name`);
                            const translated = name && !name.startsWith('dashboard.') ? name : trait.replace(/_/g, ' ');
                            return (
                              <span key={trait} className={`text-[9px] font-bold uppercase px-1 border ${getTraitClasses(trait)}`}>
                                {translated}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[9px] uppercase text-gold-etched font-bold">{t('common.salary')}</p>
                        <p className="text-xs font-bold leading-none">₼{player.salary}</p>
                      </div>
                    </div>
                  </StoneFrame>
                )) : (
                  <p className="text-parchment-dim italic text-sm">{t('dashboard.noInactivePlayers')}</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Rosters */}
          <div className="lg:col-span-2">
            <section>
              <div className="flex items-center justify-between mb-4">
                <GoldText as="h2" className="text-xl uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold-etched rotate-45 inline-block" />
                  {t('common.rosters')}
                </GoldText>
                <RunicButton
                  variant="gold"
                  className="text-[10px] px-3 py-1 uppercase tracking-widest"
                  onClick={handleOpenCreateRoster}
                >
                  {t('dashboard.addRoster')}
                </RunicButton>
              </div>
              <div className="space-y-4">
                {rosters.length ? rosters.map(roster => (
                  <StoneFrame key={roster.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-parchment uppercase tracking-tight">{roster.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-tighter border ${
                        roster.activity === 'IDLE' ? 'border-arcane-glow/50 text-arcane-glow' : 'border-gold-etched/50 text-gold-etched'
                      }`}>
                        {t(`common.activity.${roster.activity}`) !== `common.activity.${roster.activity}` ? t(`common.activity.${roster.activity}`) : roster.activity}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-black/30 p-2 border border-stone-highlight/30">
                        <p className="text-[9px] uppercase text-gold-etched font-bold">{t('common.energy')}</p>
                        <p className="text-sm font-bold">{roster.energy}%</p>
                      </div>
                      <div className="text-center bg-black/30 p-2 border border-stone-highlight/30">
                        <p className="text-[9px] uppercase text-gold-etched font-bold">{t('common.morale')}</p>
                        <p className="text-sm font-bold">{roster.morale}</p>
                      </div>
                      <div className="text-center bg-black/30 p-2 border border-stone-highlight/30">
                        <p className="text-[9px] uppercase text-gold-etched font-bold">{t('common.cohesion')}</p>
                        <p className="text-sm font-bold">{roster.cohesion}</p>
                      </div>
                    </div>
                    {(() => {
                      const rosterPlayers = playersByRoster[roster.name] ?? [];
                      return (
                        <>
                          {rosterPlayers.length ? (
                            <div className="mt-4 space-y-2">
                              {rosterPlayers.map((player) => (
                                <div
                                  key={player.id}
                                  className="flex gap-3 items-center bg-black/30 p-2 border border-stone-highlight/30 rounded-sm cursor-pointer"
                                  draggable
                                  onDragStart={(event) =>
                                    handlePlayerDragStart(event, player.id, 'roster', roster.id)
                                  }
                                  onClick={() => handlePlayerClick(player.id)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => e.key === 'Enter' && handlePlayerClick(player.id)}
                                >
                                  <div className="w-10 h-10 bg-stone-900 border border-gold-etched/30 relative overflow-hidden flex-shrink-0">
                                    <img src={player.pictureUrl} alt={player.nickname} className="w-full h-full object-cover" />
                                    {player.isStar && (
                                      <div className="absolute top-0 right-0 bg-gold-etched text-black text-[7px] font-bold px-1 py-0.5">STAR</div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-parchment text-xs uppercase truncate leading-tight">
                                      {player.nickname}
                                    </h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      <span className={`text-[8px] font-bold uppercase px-1 border ${
                                        player.condition === 'HEALTHY' ? 'border-arcane-glow/30 text-arcane-glow' : 'border-blood-glow/30 text-blood-glow'
                                      }`}>
                                        {t(`common.condition.${player.condition}`) !== `common.condition.${player.condition}` ? t(`common.condition.${player.condition}`) : player.condition}
                                      </span>
                                      {player.traits.map((trait) => {
                                        const name = t(`dashboard.traits.${trait}.name`);
                                        const translated = name && !name.startsWith('dashboard.') ? name : trait.replace(/_/g, ' ');
                                        return (
                                          <span key={trait} className={`text-[8px] font-bold uppercase px-1 border ${getTraitClasses(trait)}`}>
                                            {translated}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-[8px] uppercase text-gold-etched font-bold">{t('common.salary')}</p>
                                    <p className="text-[10px] font-bold leading-none">₼{player.salary}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {rosterPlayers.length < 5 && (
                            <div
                              className="mt-3 flex items-center justify-center border-2 border-dashed border-stone-highlight/40 bg-black/20 text-[10px] uppercase text-parchment-dim py-3"
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => handleDropToRoster(event, roster.id)}
                            >
                              <span className="mr-2 text-gold-etched text-lg leading-none">+</span>
                              <span>{t('dashboard.dragHereToAdd')}</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </StoneFrame>
                )) : (
                  <p className="text-parchment-dim italic text-sm">{t('dashboard.noRosters')}</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="z-10 p-8 mt-8 border-t border-stone-highlight/30 flex justify-between items-center max-w-7xl mx-auto w-full">
        <p className="text-[10px] text-parchment-dim uppercase tracking-[0.2em]">© 2026 E-Strategist Command</p>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="text-xs text-blood-glow hover:text-red-400 transition-colors uppercase font-bold tracking-widest"
        >
          {t('common.logout')}
        </button>
      </footer>

      {pendingRemoval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-stone-900 border border-gold-etched max-w-sm w-full mx-4 p-6 shadow-2xl">
            <GoldText as="h3" className="text-lg mb-2 uppercase tracking-tight">
              {t('dashboard.removeFromRosterTitle')}
            </GoldText>
            <p className="text-parchment-dim text-sm mb-4">
              {t('dashboard.removeFromRosterBody')}
            </p>
            {pendingRemoval.playerName && (
              <p className="text-parchment text-sm mb-4">
                <span className="font-bold">{pendingRemoval.playerName}</span>
              </p>
            )}
            <div className="flex justify-end gap-3">
              <RunicButton variant="red" onClick={handleCancelRemoval}>
                {t('common.cancel')}
              </RunicButton>
              <RunicButton variant="gold" onClick={handleConfirmRemoval}>
                {t('common.confirm')}
              </RunicButton>
            </div>
          </div>
        </div>
      )}

      {showDiscoverLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-stone-900 border border-amber-500/60 max-w-sm w-full mx-4 p-6 shadow-2xl">
            <GoldText as="h3" className="text-lg mb-3 uppercase tracking-tight text-amber-400">
              {t('dashboard.discoverRookie')}
            </GoldText>
            <p className="text-parchment-dim text-sm mb-6">
              {t('dashboard.discoverRookieLimitReached')}
            </p>
            <div className="flex justify-end">
              <RunicButton variant="gold" onClick={() => setShowDiscoverLimitModal(false)}>
                {t('common.confirm')}
              </RunicButton>
            </div>
          </div>
        </div>
      )}

      {showCreateRoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-stone-900 border border-gold-etched max-w-md w-full mx-4 p-6 shadow-2xl space-y-4">
            <GoldText as="h3" className="text-lg uppercase tracking-tight">
              {t('dashboard.createRosterTitle')}
            </GoldText>
            <p className="text-parchment-dim text-sm">
              {t('dashboard.createRosterBody')}
            </p>
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-widest text-gold-etched mb-1">
                {t('dashboard.rosterNameLabel')}
                <input
                  type="text"
                  value={newRosterName}
                  onChange={(e) => setNewRosterName(e.target.value)}
                  className="mt-1 w-full bg-black/40 border border-stone-highlight/60 px-3 py-2 text-sm text-parchment outline-none focus:border-gold-etched"
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gold-etched mb-1">
                {t('dashboard.regionLabel')}
                <select
                  value={newRosterRegion}
                  onChange={(e) => setNewRosterRegion(e.target.value)}
                  className="mt-1 w-full bg-black/40 border border-stone-highlight/60 px-3 py-2 text-sm text-parchment outline-none focus:border-gold-etched"
                >
                  {regionOptions.map((code) => (
                    <option key={code} value={code}>
                      {t(`auth.regions.${code}`)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <RunicButton variant="red" onClick={() => setShowCreateRoster(false)}>
                {t('common.cancel')}
              </RunicButton>
              <RunicButton variant="gold" onClick={handleCreateRoster}>
                {t('common.confirm')}
              </RunicButton>
            </div>
          </div>
        </div>
      )}

      {viewedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-stone-900 border border-gold-etched max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-stone-highlight/30 flex-shrink-0">
              <GoldText as="h3" className="text-lg uppercase tracking-tight mb-3">
                {viewedPlayerSource === 'discover' ? t('dashboard.discoverRookieTitle') : t('dashboard.playerStats')}
              </GoldText>
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 bg-stone-800 border border-gold-etched/30 relative overflow-hidden flex-shrink-0">
                  <img src={viewedPlayer.pictureUrl} alt={viewedPlayer.nickname} className="w-full h-full object-cover" />
                  {viewedPlayer.star && (
                    <div className="absolute top-0 right-0 bg-gold-etched text-black text-[8px] font-bold px-1 py-0.5">STAR</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-parchment uppercase">{viewedPlayer.nickname}</p>
                  <p className="text-xs text-parchment-dim mt-0.5">
                    {t(`common.condition.${viewedPlayer.condition}`) !== `common.condition.${viewedPlayer.condition}` ? t(`common.condition.${viewedPlayer.condition}`) : viewedPlayer.condition}
                  </p>
                  <p className="text-xs text-gold-etched mt-0.5">₼{viewedPlayer.salary}</p>
                  <p className="text-xs uppercase text-gold-etched font-bold mt-3 mb-1.5">{t('dashboard.traitsLabel')}</p>
                  <div className="flex flex-wrap gap-2">
                    {viewedPlayer.traits.map((traitKey) => {
                      const traitName = t(`dashboard.traits.${traitKey}.name`);
                      const traitDesc = t(`dashboard.traits.${traitKey}.description`);
                      const isTranslated = traitName && !traitName.startsWith('dashboard.');
                      const descTranslated = traitDesc && !traitDesc.startsWith('dashboard.');
                      return (
                        <span
                          key={traitKey}
                          title={descTranslated ? traitDesc : undefined}
                          className={`inline-block px-3 py-1.5 text-sm font-bold uppercase tracking-wide border rounded cursor-help ${getTraitClasses(traitKey)}`}
                        >
                          {isTranslated ? traitName : traitKey.replace(/_/g, ' ')}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-[10px] uppercase text-gold-etched font-bold mb-2">{t('dashboard.heroMastery')}</p>
            </div>
            <div className="overflow-auto flex-1 min-h-0">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-stone-900 border-b border-stone-highlight/30">
                  <tr className="text-[10px] uppercase text-gold-etched tracking-wider">
                    <th className="p-2 font-bold">{t('dashboard.hero')}</th>
                    <th className="p-2 font-bold w-20">{t('dashboard.level')}</th>
                    <th className="p-2 font-bold w-24">{t('dashboard.experience')}</th>
                  </tr>
                </thead>
                <tbody className="text-parchment-dim">
                  {heroes.map((hero) => {
                    const mastery = viewedPlayer.heroMastery?.[hero.id] ?? { level: 0, experience: 0 };
                    return (
                      <tr key={hero.id} className="border-b border-stone-highlight/20">
                        <td className="p-2 flex items-center gap-2">
                          <img src={hero.pictureUrl} alt={hero.name} className="w-6 h-6 rounded-sm object-cover flex-shrink-0" />
                          <span className="text-parchment font-medium">{hero.name}</span>
                        </td>
                        <td className="p-2">{mastery.level}</td>
                        <td className="p-2">{mastery.experience}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-stone-highlight/30 flex justify-end flex-shrink-0">
              <RunicButton variant="gold" onClick={closePlayerModal}>
                {t('common.confirm')}
              </RunicButton>
            </div>
          </div>
        </div>
      )}

      {playerDetailsLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <GoldText className="text-xl uppercase tracking-widest animate-pulse">{t('common.loading')}</GoldText>
        </div>
      )}
    </div>
  );
}
