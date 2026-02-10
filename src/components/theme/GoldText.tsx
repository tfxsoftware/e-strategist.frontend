import React from 'react';

interface GoldTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const GoldText = ({ children, className = "", as: Tag = "h2" }: GoldTextProps) => {
  return (
    <Tag className={`text-gold-etched font-black italic uppercase tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${className}`}>
      {children}
    </Tag>
  );
};

export default GoldText;
