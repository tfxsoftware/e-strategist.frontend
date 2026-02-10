'use client';

import React from 'react';

interface RunicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'green' | 'red' | 'gold';
  className?: string;
  disabled?: boolean;
}

const RunicButton = ({ children, onClick, variant = 'green', className = "", disabled = false }: RunicButtonProps) => {
  const baseStyles = "px-6 py-2 uppercase font-bold transition-all duration-200 active:scale-95 border-2 cursor-pointer relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    green: "bg-arcane-green border-arcane-glow text-arcane-glow shadow-[0_0_10px_rgba(51,255,51,0.3)] hover:shadow-[0_0_20px_rgba(51,255,51,0.6)]",
    red: "bg-blood-red border-blood-glow text-blood-glow shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)]",
    gold: "bg-stone-primary border-gold-etched text-gold-etched shadow-[0_0_10px_rgba(196,164,90,0.3)] hover:shadow-[0_0_20px_rgba(196,164,90,0.6)]"
  };

  const shadowValue = variants[variant].includes('shadow-') ? variants[variant].split('shadow-')[1] : '';

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{
        boxShadow: `inset 0 0 10px rgba(0,0,0,0.5), ${shadowValue}`
      }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay" />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default RunicButton;
