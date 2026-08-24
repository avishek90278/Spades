import React from 'react';
import { Card, Suit } from '../types/spades';
import { motion } from 'motion/react';
import {
  SuitSVG,
  AceOfSpadesCenterpiece,
  CourtCardIllustration,
  PipMatrix,
  LargeCornerPip,
  VIPSpadesCardBack,
} from './CardArtwork';

interface CardViewProps {
  card?: Card;
  isFaceDown?: boolean;
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'trick' | 'fan';
  rotation?: number;
  highlightNilRisk?: boolean;
  customWidth?: number;
  customHeight?: number;
  customFontSize?: number;
  customSuitSize?: number;
  isLastCardInHand?: boolean;
}

export const SuitIcon: React.FC<{ suit: Suit; className?: string }> = ({ suit, className = 'w-4 h-4' }) => {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${isRed ? 'text-[#DE1A24]' : 'text-[#0D1117]'}`}>
      <SuitSVG suit={suit} className={className} />
    </span>
  );
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
  customWidth,
  customHeight,
  customFontSize,
  customSuitSize,
  isLastCardInHand = false,
}) => {
  // Dimension definitions with authentic playing card aspect ratio
  const sizeClasses = {
    xs: 'w-7 h-10 text-[9px] rounded-md',
    sm: 'w-12 h-18 text-xs rounded-xl',
    md: 'w-18 h-26 sm:w-22 sm:h-32 text-xs sm:text-sm rounded-xl sm:rounded-2xl',
    lg: 'w-24 h-34 sm:w-28 sm:h-40 text-sm sm:text-base rounded-2xl',
    trick: 'w-[82px] h-[118px] sm:w-[104px] sm:h-[148px] md:w-[116px] md:h-[164px] rounded-xl sm:rounded-2xl',
    fan: 'w-[52px] h-[130px] sm:w-[64px] sm:h-[155px] md:w-[78px] md:h-[180px] rounded-t-xl sm:rounded-t-2xl',
  }[size];

  const customStyle: React.CSSProperties = {
    ...(customWidth ? { width: `${customWidth}px` } : {}),
    ...(customHeight ? { height: `${customHeight}px` } : {}),
  };

  // Face down card back (VIP Spades Green Medallion)
  if (isFaceDown || !card) {
    return (
      <motion.div
        animate={{ rotate: rotation }}
        style={customStyle}
        className={`select-none shrink-0 ${sizeClasses} ${className}`}
      >
        <VIPSpadesCardBack />
      </motion.div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  
  // High contrast color scheme: vibrant bright red/black for playable, darker muted tones for non-playable
  const rankColorClass = isPlayable
    ? isRed ? 'text-[#DE1A24]' : 'text-[#0D1117]'
    : isRed ? 'text-[#8A242B]' : 'text-[#202933]';

  const isAceOfSpades = card.rank === 'A' && card.suit === 'spades';
  const isCourtCard = card.rank === 'J' || card.rank === 'Q' || card.rank === 'K';

  // 1. MINI / CHIP MODE (for modal lists)
  if (size === 'xs') {
    return (
      <div
        style={customStyle}
        className={`relative select-none bg-[#F5F2EA] border border-[#CBD5E1] flex flex-col items-center justify-center p-0.5 shadow-sm shrink-0 ${sizeClasses} ${className}`}
      >
        <span
          className={`font-['Bebas_Neue',sans-serif] text-base leading-none ${rankColorClass}`}
        >
          {card.rank}
        </span>
        <div className={`mt-0.5 ${rankColorClass}`}>
          <SuitSVG suit={card.suit} className="w-2.5 h-2.5" />
        </div>
      </div>
    );
  }

  // 2. FAN MODE: Hand layout with high-contrast playable vs dark-toned unplayable
  if (size === 'fan') {
    const fontSize = customFontSize || 28;
    const suitIconPx = customSuitSize || 18;

    return (
      <motion.div
        whileHover={
          isPlayable && onClick
            ? { y: -26, transition: { duration: 0.12 } }
            : {}
        }
        onClick={isPlayable && onClick ? onClick : undefined}
        style={customStyle}
        className={`relative select-none transition-all flex flex-col justify-between p-1 shrink-0 overflow-hidden ${
          isPlayable
            ? 'bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#F3F0E6] border-t border-l border-r border-[#CBD5E1]'
            : 'bg-gradient-to-b from-[#606E7D] via-[#525E6B] to-[#45505B] border-t border-l border-r border-[#3B4651]'
        } ${
          isSelected
            ? 'ring-3 ring-[#FBBF24] shadow-[0_24px_42px_rgba(0,0,0,0.85),-8px_6px_22px_rgba(0,0,0,0.65)] z-40'
            : isPlayable
            ? 'cursor-pointer active:scale-95 shadow-[-7px_3px_16px_rgba(0,0,0,0.48),0_6px_14px_rgba(0,0,0,0.25)] hover:shadow-[-10px_6px_24px_rgba(0,0,0,0.65)]'
            : 'cursor-not-allowed shadow-[-4px_2px_8px_rgba(0,0,0,0.45)]'
        } rounded-t-xl sm:rounded-t-2xl ${className}`}
      >
        {/* Subtle highlight sheen for playable cards */}
        {isPlayable && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
        )}

        {/* Top Left Index: Bold Condensed Rank in Bebas Neue + Crisp Suit below */}
        <div className="flex flex-col items-start leading-none pointer-events-none z-10 pl-0.5 pt-0.5">
          <span
            className={`font-['Bebas_Neue',sans-serif] tracking-normal font-normal select-none leading-[0.88] ${rankColorClass}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {card.rank}
          </span>
          <div className={`mt-0.5 ${rankColorClass}`}>
            <SuitSVG
              suit={card.suit}
              className="shrink-0"
              style={{ width: `${suitIconPx}px`, height: `${suitIconPx}px` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Large watermark suit pip in bottom right corner */}
        {(isLastCardInHand || isCourtCard || card.rank === 'A' || card.rank === '6' || card.rank === '7') && (
          <div className={`absolute -right-2 -bottom-2 pointer-events-none ${isPlayable ? 'opacity-85' : 'opacity-35'} ${rankColorClass}`}>
            <SuitSVG
              suit={card.suit}
              className={customWidth ? 'w-[75%] h-[75%]' : 'w-16 h-16 sm:w-20 sm:h-20'}
            />
          </div>
        )}

        {/* Court Card Center Miniature if court card */}
        {isCourtCard && !isLastCardInHand && (
          <div className={`absolute right-0.5 bottom-1 w-7 h-10 pointer-events-none ${isPlayable ? 'opacity-80' : 'opacity-30'}`}>
            <CourtCardIllustration rank={card.rank as 'J' | 'Q' | 'K'} suit={card.suit} />
          </div>
        )}

        {/* Darkened overlay for non-playable cards */}
        {!isPlayable && (
          <div className="absolute inset-0 bg-slate-900/15 pointer-events-none" />
        )}
      </motion.div>
    );
  }

  // 3. TRICK / TABLE MODE: Large, realistic physical cards in center felt
  return (
    <motion.div
      layout
      whileHover={
        isPlayable && onClick
          ? { y: -6, scale: 1.02, transition: { duration: 0.12 } }
          : {}
      }
      animate={{
        y: isSelected ? -14 : 0,
        rotate: rotation,
      }}
      onClick={isPlayable && onClick ? onClick : undefined}
      style={customStyle}
      className={`relative select-none bg-gradient-to-b from-[#FFFFFF] via-[#FAF8F2] to-[#EAE6DA] border border-[#CBD5E1] transition-all flex flex-col justify-between p-1.5 sm:p-2 shrink-0 overflow-hidden ${sizeClasses} ${
        isSelected
          ? 'ring-3 ring-[#FBBF24] shadow-[0_22px_44px_rgba(0,0,0,0.7)] z-30'
          : 'shadow-[0_16px_36px_rgba(0,0,0,0.55),0_6px_14px_rgba(0,0,0,0.35)]'
      } ${className}`}
    >
      {/* Top Left Rank + Suit */}
      <div className="flex flex-col items-start leading-none pointer-events-none z-10 pl-0.5 pt-0.5">
        <span
          className={`font-['Bebas_Neue',sans-serif] tracking-normal font-normal text-xl sm:text-2xl md:text-3xl leading-[0.9] ${isRed ? 'text-[#DE1A24]' : 'text-[#0D1117]'}`}
        >
          {card.rank}
        </span>
        <div className={`mt-0.5 ${isRed ? 'text-[#DE1A24]' : 'text-[#0D1117]'}`}>
          <SuitSVG suit={card.suit} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </div>
      </div>

      {/* Center Card Content: Ace of Spades crest OR Royal Court portrait OR Pip Matrix */}
      <div className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none overflow-hidden">
        {isAceOfSpades ? (
          <AceOfSpadesCenterpiece className="w-12 h-16 sm:w-16 sm:h-22 md:w-20 md:h-28" />
        ) : isCourtCard ? (
          <div className="w-10 h-16 sm:w-14 sm:h-22 md:w-18 md:h-28">
            <CourtCardIllustration rank={card.rank as 'J' | 'Q' | 'K'} suit={card.suit} />
          </div>
        ) : (
          <div className="scale-90 sm:scale-100 md:scale-110">
            <PipMatrix rank={card.rank} suit={card.suit} isRed={isRed} />
          </div>
        )}
      </div>

      {/* Bottom Right Inverted Index */}
      <div className="flex flex-col items-end leading-none rotate-180 pointer-events-none z-10 pr-0.5 pb-0.5">
        <span
          className={`font-['Bebas_Neue',sans-serif] tracking-normal font-normal text-xl sm:text-2xl md:text-3xl leading-[0.9] ${isRed ? 'text-[#DE1A24]' : 'text-[#0D1117]'}`}
        >
          {card.rank}
        </span>
        <div className={`mt-0.5 ${isRed ? 'text-[#DE1A24]' : 'text-[#0D1117]'}`}>
          <SuitSVG suit={card.suit} className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </div>
      </div>
    </motion.div>
  );
};
