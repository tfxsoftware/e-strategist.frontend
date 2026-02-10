import React from 'react';

const RunicDivider = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center gap-4 my-6 ${className}`}>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-gold-etched to-transparent opacity-50" />
      <div className="text-gold-etched text-xl opacity-80">ᛖ</div>
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-gold-etched to-transparent opacity-50" />
    </div>
  );
};

export default RunicDivider;
