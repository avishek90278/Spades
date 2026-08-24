import React from 'react';
import { Card, Suit } from '../types/spades';
import { motion } from 'motion/react';

interface CardViewProps {
  card?: Card;
  isFaceDown?: boolean;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
  highlightNilRisk?: boolean;
}

export const SuitIcon: React.FC<{ suit: Suit; className?: string }> = ({ suit, className = 'w-4 h-4' }) => {
  switch (suit) {
    case 'spades':
      return (
        <svg viewBox="0 0 24 24" className={`${className} fill-[#111111]`} aria-label="Spades">
          <path d="M12 2C11 5 6 9 6 13c0 3.3 2.7 6 6 6 .4 0 .8 0 1.2-.1-1.2 1.5-2.2 3.1-2.2 4.1h2c0-1.8 1.5-3.5 2-4 0 0 .5.5 2 4h2c0-1-1-2.6-2.2-4.1.4.1.8.1 1.2.1 3.3 0 6-2.7 6-6 0-4-5-8-6-11z" />
        </svg>
      );
    case 'hearts':
      return (
        <svg viewBox="0 0 24 24" className={`${className} fill-[#DC2626]`} aria-label="Hearts">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'diamonds':
      return (
        <svg viewBox="0 0 24 24" className={`${className} fill-[#DC2626]`} aria-label="Diamonds">
          <path d="M12 2L3 12l9 10 9-10L12 2z" />
        </svg>
      );
    case 'clubs':
      return (
        <svg viewBox="0 0 24 24" className={`${className} fill-[#111111]`} aria-label="Clubs">
          <path d="M12 2a4 4 0 0 0-4 4c0 1.3.6 2.4 1.5 3.1C7.8 9.5 6 11 6 13a4 4 0 0 0 4 4c.3 0 .7 0 1-.1-1 1.4-1.8 2.7-2 3.1h6c-.2-.4-1-1.7-2-3.1.3.1.7.1 1 .1a4 4 0 0 0 4-4c0-2-1.8-3.5-3.5-3.9.9-.7 1.5-1.8 1.5-3.1a4 4 0 0 0-4-4z" />
        </svg>
      );
  }
};

export const CardView: React.FC<CardViewProps> = ({
  card,
  isFaceDown = false,
  isPlayable = true,
  isSelected = false,
  onClick,
  className = '',
  size = 'md',
  rotation = 0,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-18 text-xs rounded-lg shadow-md',
    md: 'w-18 h-26 sm:w-20 sm:h-28 text-sm rounded-lg shadow-lg',
    lg: 'w-22 h-32 sm:w-26 sm:h-38 text-base rounded-xl shadow-xl',
  }[size];

  if (isFaceDown || !card) {
    return (
      <motion.div
        id={card ? `card-back-${card.id}` : 'card-back'}
        whileHover={onClick ? { scale: 1.05, y: -4 } : {}}
        className={`relative select-none transition-transform bg-[#161616] border border-[#D4AF37]/40 flex items-center justify-center p-1 overflow-hidden shadow-xl ${sizeClasses} ${className}`}
        style={{ transform: `rotate(${rotation}deg)` }}
        onClick={onClick}
      >
        <div className="w-full h-full border border-[#D4AF37]/20 rounded-md flex flex-col items-center justify-center bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:8px_8px] bg-[#111111]">
          <div className="w-6 h-6 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#D4AF37]/50 shadow-inner">
            <span className="text-[#D4AF37] text-xs font-serif font-bold">♠</span>
          </div>
        </div>
      </motion.div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const textColor = isRed ? 'text-[#DC2626]' : 'text-[#111111]';

  return (
    <motion.div
      id={`card-${card.id}`}
      layout
      whileHover={
        isPlayable && onClick
          ? { y: -14, scale: 1.06, transition: { duration: 0.15 } }
          : {}
      }
      animate={{
        y: isSelected ? -16 : 0,
        rotate: rotation,
      }}
      onClick={isPlayable && onClick ? onClick : undefined}
      className={`relative select-none bg-[#FDFDFD] border font-sans transition-all ${textColor} ${sizeClasses} ${
        isSelected
          ? 'bg-[#FFFFFF] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] ring-1 ring-[#D4AF37]'
          : isPlayable
          ? 'border-[#D1D5DB] hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] cursor-pointer'
          : 'border-[#E5E7EB] opacity-50 cursor-not-allowed grayscale-[40%]'
      } ${className}`}
    >
      {/* Top Left Index */}
      <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 flex flex-col items-center leading-none">
        <span className="font-extrabold tracking-tight text-xs sm:text-sm">{card.rank}</span>
        <SuitIcon suit={card.suit} className="w-2.5 h-2.5 sm:w-3 sm:h-3 mt-0.5" />
      </div>

      {/* Center Big Suit Icon & Value Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <SuitIcon suit={card.suit} className="w-6 h-6 sm:w-8 sm:h-8" />
        {card.suit === 'spades' && (
          <span className="text-[8px] font-mono font-bold tracking-widest text-[#D4AF37] bg-[#111111] px-1 py-0.2 rounded uppercase mt-0.5 shadow-sm">
            TRUMP
          </span>
        )}
      </div>

      {/* Bottom Right Inverted Index */}
      <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 flex flex-col items-center leading-none rotate-180">
        <span className="font-extrabold tracking-tight text-xs sm:text-sm">{card.rank}</span>
        <SuitIcon suit={card.suit} className="w-2.5 h-2.5 sm:w-3 sm:h-3 mt-0.5" />
      </div>
    </motion.div>
  );
};
