'use client';

import React, { useState } from 'react';
import StoneFrame from "@/components/theme/StoneFrame";
import GoldText from "@/components/theme/GoldText";
import RunicButton from "@/components/theme/RunicButton";
import RunicDivider from "@/components/theme/RunicDivider";
import TopBar from "@/components/theme/TopBar";
import { useTranslation } from "@/context/I18nContext";
import { authService } from "@/services/authService";
import { useHeroesStore } from "@/store/heroesStore";

export default function SigninPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await authService.signin(formData);
      setStatus({ type: 'success', message: 'Logged in successfully!' });
      
      // Store token if returned
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        useHeroesStore.getState().fetchHeroes();
      }
      
      // Redirect to home or dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
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
            <GoldText as="h1" className="text-4xl mb-2">{t('auth.signinTitle')}</GoldText>
            <p className="text-parchment-dim italic text-sm">{t('common.signinSubtitle')}</p>
          </header>

          <StoneFrame>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-stone-highlight p-3 pr-12 text-parchment focus:border-gold-etched outline-none transition-colors technical-readout"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1 text-gold-etched hover:text-gold-glow transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
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
                {loading ? t('common.loading') : t('common.signin')}
              </RunicButton>
            </form>

            <RunicDivider />

            <div className="text-center">
              <p className="text-xs text-parchment-dim">
                {t('common.noAccount')}{' '}
                <a href="/auth/signup" className="text-gold-etched hover:text-gold-glow transition-colors font-bold uppercase">
                  {t('common.signup')}
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
