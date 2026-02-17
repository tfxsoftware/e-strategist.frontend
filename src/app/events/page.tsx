'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { eventService } from '@/services/eventService';
import { dashboardService } from '@/services/dashboardService';
import { Event as EventType, EventRoster } from '@/types/event';
import type { Roster } from '@/types/dashboard';
import StoneFrame from '@/components/theme/StoneFrame';
import GoldText from '@/components/theme/GoldText';
import RunicButton from '@/components/theme/RunicButton';
import TopBar from '@/components/theme/TopBar';
import { useTranslation } from '@/context/I18nContext';

const REGIONS = ['SOUTH_AMERICA', 'NORTH_AMERICA', 'EUROPE', 'CIS', 'ASIA'] as const;
const STATUSES = ['OPEN', 'CLOSED', 'ONGOING', 'FINISHED'] as const;
const TIERS = ['S', 'A', 'B', 'C', 'D'] as const;
const TYPES = ['LEAGUE', 'TOURNAMENT'] as const;
const SORT_OPTIONS = ['name,asc', 'name,desc', 'opensAt,asc', 'opensAt,desc', 'startsAt,asc', 'startsAt,desc'] as const;
const PAGE_SIZE = 10;

export default function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [region, setRegion] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [tier, setTier] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [sort, setSort] = useState<string>('name,asc');
  const [registerEvent, setRegisterEvent] = useState<EventType | null>(null);
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [rosterModalLoading, setRosterModalLoading] = useState(false);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [popupSuccess, setPopupSuccess] = useState<string | null>(null);
  const [standingsEvent, setStandingsEvent] = useState<EventType | null>(null);
  const [standingsData, setStandingsData] = useState<EventRoster[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [standingsPopupError, setStandingsPopupError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        size: PAGE_SIZE,
        sort,
      };
      if (region) params.region = region;
      if (status) params.status = status;
      if (tier) params.tier = tier;
      if (type) params.type = type;
      const response = await eventService.getEvents(params);
      setEvents(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load events.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, sort, region, status, tier, type]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = () => {
    setPage(0);
  };

  const openRegisterModal = async (ev: EventType) => {
    setRegisterEvent(ev);
    setPopupError(null);
    setPopupSuccess(null);
    setRosterModalLoading(true);
    try {
      const list = await dashboardService.getRosters();
      setRosters(list);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('common.error');
      setPopupError(message);
    } finally {
      setRosterModalLoading(false);
    }
  };

  const closeRegisterModal = () => {
    setRegisterEvent(null);
    setRosters([]);
    setPopupError(null);
    setPopupSuccess(null);
  };

  const handleRegisterRoster = async (rosterId: string) => {
    if (!registerEvent) return;
    setRegisterLoading(true);
    setPopupError(null);
    setPopupSuccess(null);
    try {
      await eventService.registerRoster(registerEvent.id, rosterId);
      setPopupSuccess(t('events.registerSuccess'));
      setTimeout(closeRegisterModal, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('common.error');
      setPopupError(message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const openStandingsModal = async (ev: EventType) => {
    setStandingsEvent(ev);
    setStandingsPopupError(null);
    setStandingsLoading(true);
    try {
      const data = await eventService.getEventRosters(ev.id);
      setStandingsData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('common.error');
      setStandingsPopupError(message);
    } finally {
      setStandingsLoading(false);
    }
  };

  const closeStandingsModal = () => {
    setStandingsEvent(null);
    setStandingsData([]);
    setStandingsPopupError(null);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRegionLabel = (r: string) => t(`events.regions.${r}`) !== `events.regions.${r}` ? t(`events.regions.${r}`) : r.replace(/_/g, ' ');
  const getStatusLabel = (s: string) => t(`events.statuses.${s}`) !== `events.statuses.${s}` ? t(`events.statuses.${s}`) : s;
  const getStatusClasses = (s: string) => {
    const map: Record<string, string> = {
      OPEN: 'border-arcane-glow/50 text-arcane-glow',
      CLOSED: 'border-amber-400/50 text-amber-400',
      ONGOING: 'border-pink-400/50 text-pink-400',
      FINISHED: 'border-blood-glow/50 text-blood-glow',
    };
    return map[s] ?? 'border-stone-highlight/50 text-parchment-dim';
  };
  const getTierLabel = (tierKey: string) => t(`events.tiers.${tierKey}`) !== `events.tiers.${tierKey}` ? t(`events.tiers.${tierKey}`) : tierKey;
  const getTierClasses = (tierKey: string) => {
    const map: Record<string, string> = {
      D: 'border-gray-400/50 text-gray-400',
      C: 'border-blue-400/50 text-blue-400',
      B: 'border-arcane-glow/50 text-arcane-glow',
      A: 'border-orange-400/50 text-orange-400',
      S: 'border-purple-400/50 text-purple-400',
    };
    return map[tierKey] ?? 'border-gold-etched/50 text-gold-etched';
  };
  const getTypeLabel = (typeKey: string) => t(`events.types.${typeKey}`) !== `events.types.${typeKey}` ? t(`events.types.${typeKey}`) : typeKey;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-parchment">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: 'url("/background.jpg")' }}
      />

      <TopBar />

      <main className="flex-1 z-10 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <GoldText as="h1" className="text-3xl md:text-4xl uppercase tracking-tighter">{t('events.title')}</GoldText>
              <p className="text-parchment-dim italic text-sm mt-1">{t('events.subtitle')}</p>
            </div>
            <RunicButton variant="stone" onClick={() => (window.location.href = '/dashboard')}>
              {t('events.backToDashboard')}
            </RunicButton>
          </div>
        </header>

        {/* Filters */}
        <StoneFrame className="p-4 mb-6">
          <GoldText as="h2" className="text-sm uppercase mb-4 tracking-widest">{t('events.region')} & Filters</GoldText>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-gold-etched font-bold mb-1">{t('events.region')}</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-black/40 border border-stone-highlight/60 px-3 py-2 text-sm text-parchment outline-none focus:border-gold-etched"
              >
                <option value="">{t('events.all')}</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{getRegionLabel(r)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gold-etched font-bold mb-1">{t('events.status')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-black/40 border border-stone-highlight/60 px-3 py-2 text-sm text-parchment outline-none focus:border-gold-etched"
              >
                <option value="">{t('events.all')}</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gold-etched font-bold mb-1">{t('events.tier')}</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full bg-black/40 border border-stone-highlight/60 px-3 py-2 text-sm text-parchment outline-none focus:border-gold-etched"
              >
                <option value="">{t('events.all')}</option>
                {TIERS.map((tKey) => (
                  <option key={tKey} value={tKey}>{getTierLabel(tKey)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gold-etched font-bold mb-1">{t('events.type')}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-black/40 border border-stone-highlight/60 px-3 py-2 text-sm text-parchment outline-none focus:border-gold-etched"
              >
                <option value="">{t('events.all')}</option>
                {TYPES.map((typeKey) => (
                  <option key={typeKey} value={typeKey}>{getTypeLabel(typeKey)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gold-etched font-bold mb-1">{t('events.sort')}</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-black/40 border border-stone-highlight/60 px-3 py-2 text-sm text-parchment outline-none focus:border-gold-etched"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace(',', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <RunicButton variant="gold" className="w-full" onClick={handleFilterChange}>
                {t('common.confirm')}
              </RunicButton>
            </div>
          </div>
        </StoneFrame>

        {loading && (
          <div className="flex justify-center py-12">
            <GoldText className="text-xl uppercase tracking-widest animate-pulse">{t('common.loading')}</GoldText>
          </div>
        )}

        {error && (
          <StoneFrame className="p-6 text-center border-blood-glow/40">
            <p className="text-blood-glow mb-4">{error}</p>
            <RunicButton variant="gold" onClick={fetchEvents}>Retry</RunicButton>
          </StoneFrame>
        )}

        {!loading && !error && events.length === 0 && (
          <StoneFrame className="p-12 text-center">
            <p className="text-parchment-dim italic">{t('events.noEvents')}</p>
          </StoneFrame>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="space-y-4">
            {events.map((ev) => (
              <StoneFrame key={ev.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <GoldText as="h3" className="text-lg uppercase tracking-tight">{ev.name}</GoldText>
                      {ev.tier === 'S' ? (
                        <span
                          className="text-[10px] px-2 py-0.5 font-bold uppercase border border-purple-400/70 text-purple-300 bg-purple-500/20 animate-pulse"
                          style={{ boxShadow: '0 0 10px rgba(192, 132, 252, 0.5)' }}
                        >
                          {getTierLabel(ev.tier)}
                        </span>
                      ) : (
                        <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border ${getTierClasses(ev.tier)}`}>
                          {getTierLabel(ev.tier)}
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 font-bold uppercase border border-stone-highlight/60 text-parchment-dim">
                        {getTypeLabel(ev.type)}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 font-bold uppercase border ${getStatusClasses(ev.status)}`}>
                        {getStatusLabel(ev.status)}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 font-bold uppercase border border-stone-highlight/40 text-parchment-dim">
                        {getRegionLabel(ev.region)}
                      </span>
                    </div>
                    {ev.description && (
                      <p className="text-parchment-dim text-sm mb-3 line-clamp-2">{ev.description}</p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="text-[10px] uppercase text-gold-etched font-bold">{t('events.entryFee')}</p>
                        <p>₼{ev.entryFee.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-gold-etched font-bold">{t('events.prizePool')}</p>
                        <p>₼{ev.totalPrizePool.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-gold-etched font-bold">{t('events.opensAt')}</p>
                        <p>{formatDate(ev.opensAt)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-gold-etched font-bold">{t('events.startsAt')}</p>
                        <p>{formatDate(ev.startsAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <RunicButton variant="gold" onClick={() => openStandingsModal(ev)}>
                      {t('events.viewStandings')}
                    </RunicButton>
                    <RunicButton variant="green" onClick={() => openRegisterModal(ev)}>
                      {t('events.registerRoster')}
                    </RunicButton>
                  </div>
                </div>
              </StoneFrame>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-stone-highlight/30">
                <p className="text-xs text-parchment-dim uppercase">
                  {t('events.page')} {page + 1} {t('events.of')} {totalPages} · {totalElements} total
                </p>
                <div className="flex gap-2">
                  <RunicButton
                    variant="stone"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    {t('events.prev')}
                  </RunicButton>
                  <RunicButton
                    variant="stone"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    {t('events.next')}
                  </RunicButton>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Standings modal */}
      {standingsEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-stone-900 border border-gold-etched max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-stone-highlight/30 flex-shrink-0">
              <GoldText as="h3" className="text-lg mb-2 uppercase tracking-tight">
                {t('events.viewStandings')}
              </GoldText>
              <p className="text-parchment-dim text-sm">{standingsEvent.name}</p>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {standingsLoading && (
                <p className="text-parchment-dim italic text-sm py-4">{t('common.loading')}</p>
              )}
              {standingsPopupError && (
                <p className="text-blood-glow text-sm">{standingsPopupError}</p>
              )}
              {!standingsLoading && !standingsPopupError && standingsData.length === 0 && (
                <p className="text-parchment-dim italic text-sm py-4">{t('events.noStandings')}</p>
              )}
              {!standingsLoading && !standingsPopupError && standingsData.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase text-gold-etched tracking-wider border-b border-stone-highlight/30">
                        {standingsEvent.type === 'LEAGUE' && (
                          <th className="py-2 pr-4 font-bold">{t('events.position')}</th>
                        )}
                        <th className="py-2 pr-4 font-bold">{t('common.rosters')}</th>
                        <th className="py-2 pr-4 font-bold">{t('events.owner')}</th>
                        <th className="py-2 pr-4 font-bold">{t('common.cohesion')}</th>
                        <th className="py-2 pr-4 font-bold">{t('common.morale')}</th>
                        {standingsEvent.type === 'LEAGUE' && (
                          <>
                            <th className="py-2 pr-4 font-bold">{t('events.wins')}</th>
                            <th className="py-2 font-bold">{t('events.losses')}</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-parchment-dim">
                      {standingsData.map((r, idx) => (
                        <tr key={idx} className="border-b border-stone-highlight/20">
                          {standingsEvent.type === 'LEAGUE' && (
                            <td className="py-2 pr-4">{r.position ?? '—'}</td>
                          )}
                          <td className="py-2 pr-4 font-medium text-parchment">{r.name}</td>
                          <td className="py-2 pr-4">{r.ownerName}</td>
                          <td className="py-2 pr-4">{r.cohesion}</td>
                          <td className="py-2 pr-4">{r.morale}</td>
                          {standingsEvent.type === 'LEAGUE' && (
                            <>
                              <td className="py-2 pr-4">{r.wins ?? '—'}</td>
                              <td className="py-2">{r.losses ?? '—'}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-stone-highlight/30 flex justify-end flex-shrink-0">
              <RunicButton variant="stone" onClick={closeStandingsModal}>
                {t('common.cancel')}
              </RunicButton>
            </div>
          </div>
        </div>
      )}

      {/* Register roster modal */}
      {registerEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-stone-900 border border-gold-etched max-w-md w-full p-6 shadow-2xl">
            <GoldText as="h3" className="text-lg mb-2 uppercase tracking-tight">
              {t('events.registerRoster')}
            </GoldText>
            <p className="text-parchment-dim text-sm mb-4">{registerEvent.name}</p>
            <p className="text-[10px] uppercase text-gold-etched font-bold mb-3">{t('events.selectRoster')}</p>
            {rosterModalLoading && (
              <p className="text-parchment-dim italic text-sm py-4">{t('common.loading')}</p>
            )}
            {!rosterModalLoading && rosters.length === 0 && !popupError && (
              <p className="text-parchment-dim italic text-sm py-4">{t('events.noRosters')}</p>
            )}
            {!rosterModalLoading && rosters.length > 0 && (
              <div className="space-y-2 mb-4">
                {rosters.map((roster) => (
                  <button
                    key={roster.id}
                    type="button"
                    onClick={() => handleRegisterRoster(roster.id)}
                    disabled={registerLoading}
                    className="w-full text-left bg-black/40 border border-stone-highlight/60 px-3 py-2 text-sm text-parchment hover:border-gold-etched transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {roster.name}
                    <span className="text-[10px] text-parchment-dim ml-2">({roster.energy}% {t('common.energy')})</span>
                  </button>
                ))}
              </div>
            )}
            {popupError && (
              <p className="text-blood-glow text-sm mb-4">{popupError}</p>
            )}
            {popupSuccess && (
              <p className="text-arcane-glow text-sm mb-4">{popupSuccess}</p>
            )}
            <div className="flex justify-end">
              <RunicButton variant="stone" onClick={closeRegisterModal}>
                {t('common.cancel')}
              </RunicButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
