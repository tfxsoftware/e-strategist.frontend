'use client';

import React, { useState } from 'react';
import StoneFrame from "@/components/theme/StoneFrame";
import GoldText from "@/components/theme/GoldText";
import RunicButton from "@/components/theme/RunicButton";
import RunicDivider from "@/components/theme/RunicDivider";
import TopBar from "@/components/theme/TopBar";
import { useTranslation } from "@/context/I18nContext";
import { authService } from "@/services/authService";

export default function SignupPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    region: 'SOUTH_AMERICA'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await authService.signup(formData);
      setStatus({ type: 'success', message: t('common.success') });
      // In a real app, we might redirect to login or auto-login
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || t('common.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black text-parchment">
      {/* Background Image with darkening overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: 'url("/background.jpg")' }}
      />
      
      <TopBar />

      <main className="flex-1 z-10 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <header className="text-center mb-8">
            <GoldText as="h1" className="text-4xl mb-2">{t('auth.signupTitle')}</GoldText>
            <p className="text-parchment-dim italic text-sm">{t('auth.signupSubtitle')}</p>
          </header>

          <StoneFrame>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gold-etched text-xs font-bold uppercase mb-2 tracking-widest">
                  {t('common.username')}
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-stone-highlight p-3 text-parchment focus:border-gold-etched outline-none transition-colors technical-readout"
                />
              </div>

              <div>
                <label className="block text-gold-etched text-xs font-bold uppercase mb-2 tracking-widest">
                  {t('common.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-stone-highlight p-3 text-parchment focus:border-gold-etched outline-none transition-colors technical-readout"
                />
              </div>

              <div>
                <label className="block text-gold-etched text-xs font-bold uppercase mb-2 tracking-widest">
                  {t('common.password')}
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-stone-highlight p-3 text-parchment focus:border-gold-etched outline-none transition-colors technical-readout"
                />
              </div>

              <div>
                <label className="block text-gold-etched text-xs font-bold uppercase mb-2 tracking-widest">
                  {t('common.region')}
                </label>
                <div className="relative">
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-stone-highlight p-3 text-parchment focus:border-gold-etched outline-none transition-colors appearance-none technical-readout"
                  >
                    <option value="SOUTH_AMERICA">{t('auth.regions.SOUTH_AMERICA')}</option>
                    {/* Other regions locked for now */}
                    <option value="NORTH_AMERICA" disabled>{t('auth.regions.NORTH_AMERICA')} (Locked)</option>
                    <option value="EUROPE" disabled>{t('auth.regions.EUROPE')} (Locked)</option>
                    <option value="CIS" disabled>{t('auth.regions.CIS')} (Locked)</option>
                    <option value="ASIA" disabled>{t('auth.regions.ASIA')} (Locked)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold-etched">
                    ▼
                  </div>
                </div>
              </div>

              {status.message && (
                <div className={`p-3 text-center text-sm font-bold border ${
                  status.type === 'success' ? 'bg-arcane-green/20 border-arcane-glow text-arcane-glow' : 'bg-blood-red/20 border-blood-glow text-blood-glow'
                }`}>
                  {status.message}
                </div>
              )}

              <RunicButton 
                variant="gold" 
                className="w-full py-3 text-lg" 
                disabled={loading}
              >
                {loading ? t('common.loading') : t('common.signup')}
              </RunicButton>
            </form>

            <RunicDivider />

            <div className="text-center">
              <p className="text-xs text-parchment-dim">
                {t('common.alreadyHaveAccount')}{' '}
                <a href="/auth/signin" className="text-gold-etched hover:text-gold-glow transition-colors font-bold uppercase">
                  {t('common.signin')}
                </a>
              </p>
            </div>
          </StoneFrame>
        </div>
      </main>

      <footer className="z-10 p-4 text-center">
        <a href="/" className="text-xs text-parchment-dim hover:text-gold-etched transition-colors uppercase tracking-widest font-bold">
          {t('common.backToHome')}
        </a>
      </footer>
    </div>
  );
}
