import React from 'react';

interface StoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

const StoneFrame = ({ children, className = "" }: StoneFrameProps) => {
  return (
    <div className={`relative p-4 bg-stone-primary border-4 ${className}`}
         style={{
           borderColor: 'var(--color-stone-highlight) var(--color-stone-shadow) var(--color-stone-shadow) var(--color-stone-highlight)',
           boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
         }}>
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3e%3cfilter id='noiseFilter'%3e%3cfeturbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3e%3c/filter%3e%3crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3e%3c/svg%3e")`
           }} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default StoneFrame;
