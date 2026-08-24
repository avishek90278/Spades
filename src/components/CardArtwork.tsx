import React from 'react';
import { Rank, Suit } from '../types/spades';

export const SuitSVG: React.FC<{ suit: Suit; className?: string }> = ({ suit, className = 'w-4 h-4' }) => {
  switch (suit) {
    case 'spades':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          {/* Authentic tournament Spades shape matching Screenshot_20260824_145811_Spades.jpg */}
          <path d="M50,6 C44,22 18,44 12,60 C7,73 17,84 32,84 C41,84 47,78 50,71 C53,78 59,84 68,84 C83,84 93,73 88,60 C82,44 56,22 50,6 Z" />
          <path d="M47,68 C48,76 43,90 36,96 L64,96 C57,90 52,76 53,68 Z" />
        </svg>
      );
    case 'hearts':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          {/* Authentic tournament Hearts shape matching Screenshot_20260824_145811_Spades.jpg */}
          <path d="M50,92 C46,88 8,56 8,32 C8,15 22,7 36,7 C44,7 48,11 50,16 C52,11 56,7 64,7 C78,7 92,15 92,32 C92,56 54,88 50,92 Z" />
        </svg>
      );
    case 'diamonds':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          {/* Authentic tournament Diamonds shape matching Screenshot_20260824_145811_Spades.jpg */}
          <path d="M50,5 C47,30 28,48 5,50 C28,52 47,70 50,95 C53,70 72,52 95,50 C72,48 53,30 50,5 Z" />
        </svg>
      );
    case 'clubs':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor">
          {/* Authentic tournament 3-lobed Clubs shape matching Screenshot_20260824_145811_Spades.jpg */}
          <circle cx="50" cy="28" r="19" />
          <circle cx="28" cy="56" r="19" />
          <circle cx="72" cy="56" r="19" />
          <path d="M50,42 C42,50 36,58 50,66 C64,58 58,50 50,42 Z" />
          <path d="M46,58 C47,68 41,88 34,96 L66,96 C59,88 53,68 54,58 Z" />
        </svg>
      );
  }
};

/**
 * Large exposed suit watermark pip in bottom right corner (Screenshot_20260824_145811_Spades.jpg)
 */
export const LargeCornerPip: React.FC<{ suit: Suit; isRed: boolean; className?: string }> = ({
  suit,
  isRed,
  className = 'w-16 h-16',
}) => {
  return (
    <div className={`absolute -right-2 -bottom-2 pointer-events-none opacity-90 ${isRed ? 'text-[#C22B2B]' : 'text-[#15171A]'}`}>
      <SuitSVG suit={suit} className={className} />
    </div>
  );
};

/**
 * Elaborate decorative Ace of Spades baroque filigree centerpiece (as seen in spades-cards.png)
 */
export const AceOfSpadesCenterpiece: React.FC<{ className?: string }> = ({ className = 'w-24 h-32' }) => {
  return (
    <svg viewBox="0 0 200 240" className={className} fill="none">
      <defs>
        <radialGradient id="aceGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
      </defs>
      {/* Outer filigree wings & floral frills */}
      <g stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9">
        {/* Left frills */}
        <path d="M100,50 C75,30 35,45 30,85 C25,120 50,150 70,165" />
        <path d="M100,70 C80,55 45,70 42,100 C40,125 60,145 75,155" />
        <path d="M90,35 C70,15 40,25 35,55" />
        <path d="M25,80 C15,90 12,110 20,125 C28,140 45,145 55,145" />
        <path d="M40,55 C25,60 18,75 22,90" />
        {/* Radiating spikes */}
        <path d="M50,65 L30,55" />
        <path d="M45,85 L20,80" />
        <path d="M48,110 L22,112" />
        <path d="M55,130 L32,138" />

        {/* Right frills */}
        <path d="M100,50 C125,30 165,45 170,85 C175,120 150,150 130,165" />
        <path d="M100,70 C120,55 155,70 158,100 C160,125 140,145 125,155" />
        <path d="M110,35 C130,15 160,25 165,55" />
        <path d="M175,80 C185,90 188,110 180,125 C172,140 155,145 145,145" />
        <path d="M160,55 C175,60 182,75 178,90" />
        {/* Radiating spikes */}
        <path d="M150,65 L170,55" />
        <path d="M155,85 L180,80" />
        <path d="M152,110 L178,112" />
        <path d="M145,130 L168,138" />
      </g>

      {/* Main Solid Center Spade */}
      <path
        d="M100,20 C86,54 44,88 32,114 C20,140 34,164 64,164 C78,164 90,154 100,142 C110,154 122,164 136,164 C166,164 180,140 168,114 C156,88 114,54 100,20 Z"
        fill="url(#aceGlow)"
        stroke="#0F172A"
        strokeWidth="2"
      />
      {/* Spade stem */}
      <path
        d="M94,142 C96,155 88,185 76,196 L124,196 C112,185 104,155 106,142 Z"
        fill="url(#aceGlow)"
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* Inner Decorative Spade Lines (White Filigree Inset) */}
      <g stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.95" fill="none">
        <path d="M100,45 C90,70 60,95 52,115 C45,133 55,148 74,148 C85,148 94,140 100,130 C106,140 115,148 126,148 C145,148 155,133 148,115 C140,95 110,70 100,45 Z" />
        <circle cx="100" cy="98" r="7" fill="#FFFFFF" />
        <path d="M100,80 L100,120" strokeWidth="2.5" />
        <path d="M85,105 L115,105" strokeWidth="2.5" />
      </g>
    </svg>
  );
};

/**
 * Traditional Royal Court Card Artwork (King, Queen, Jack) matching standard high-res card design
 */
export const CourtCardIllustration: React.FC<{
  rank: 'J' | 'Q' | 'K';
  suit: Suit;
  className?: string;
}> = ({ rank, suit, className = 'w-full h-full' }) => {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const primaryColor = isRed ? '#DC2626' : '#1E3A8A';
  const secondaryColor = '#EAB308'; // Gold
  const tunicDark = '#1E293B';

  return (
    <div className={`relative border border-[#CBD5E1] bg-[#F8FAFC] overflow-hidden rounded-md flex flex-col justify-between ${className}`}>
      {/* Top Half of Double-Headed Royal */}
      <div className="relative w-full h-1/2 flex items-center justify-center p-0.5 border-b border-dashed border-[#CBD5E1]">
        <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
          {/* Robe / Body */}
          <path d="M15,90 L25,45 L75,45 L85,90 Z" fill={primaryColor} stroke="#0F172A" strokeWidth="1.5" />
          <path d="M35,45 L50,90 L65,45 Z" fill={secondaryColor} stroke="#0F172A" strokeWidth="1.2" />
          <path d="M40,55 L60,55 L50,85 Z" fill={tunicDark} />

          {/* Ermine / Collar */}
          <path d="M28,45 C35,38 65,38 72,45 L68,52 C60,48 40,48 32,52 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />

          {/* Royal Scepter / Sword / Weapon depending on rank */}
          {rank === 'K' && (
            <g stroke="#0F172A" strokeWidth="1.5">
              <line x1="80" y1="20" x2="80" y2="85" stroke="#94A3B8" strokeWidth="2.5" />
              <rect x="74" y="65" width="12" height="3" fill={secondaryColor} />
              <circle cx="80" cy="78" r="3" fill={secondaryColor} />
            </g>
          )}

          {rank === 'Q' && (
            <g>
              <line x1="20" y1="35" x2="20" y2="80" stroke="#0F172A" strokeWidth="2" />
              <circle cx="20" cy="30" r="5" fill={secondaryColor} stroke="#0F172A" strokeWidth="1.2" />
              <circle cx="20" cy="30" r="2" fill={primaryColor} />
            </g>
          )}

          {rank === 'J' && (
            <g stroke="#0F172A" strokeWidth="1.5">
              <line x1="22" y1="25" x2="22" y2="85" stroke="#64748B" strokeWidth="2" />
              <path d="M16,25 C16,18 28,18 28,25 L22,32 Z" fill={secondaryColor} />
            </g>
          )}

          {/* Head & Face */}
          <circle cx="50" cy="32" r="14" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.2" />
          {/* Hair / Beard */}
          {rank === 'K' && (
            <path d="M38,32 C36,44 42,48 50,48 C58,48 64,44 62,32" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
          )}
          {rank === 'Q' && (
            <path d="M36,28 C34,44 38,48 42,48 M64,28 C66,44 62,48 58,48" fill="#FBBF24" stroke="#0F172A" strokeWidth="1" />
          )}
          {rank === 'J' && (
            <path d="M38,26 C36,36 38,42 42,42 M62,26 C64,36 62,42 58,42" fill="#F59E0B" stroke="#0F172A" strokeWidth="1" />
          )}

          {/* Facial Features */}
          <circle cx="45" cy="30" r="1.5" fill="#0F172A" />
          <circle cx="55" cy="30" r="1.5" fill="#0F172A" />
          <path d="M47,38 Q50,40 53,38" stroke="#0F172A" strokeWidth="1" />

          {/* Crown / Cap */}
          {rank === 'K' && (
            <path d="M36,22 L42,12 L50,18 L58,12 L64,22 Z" fill={secondaryColor} stroke="#0F172A" strokeWidth="1.2" />
          )}
          {rank === 'Q' && (
            <path d="M38,22 L44,14 L50,20 L56,14 L62,22 Z" fill={secondaryColor} stroke="#0F172A" strokeWidth="1.2" />
          )}
          {rank === 'J' && (
            <path d="M36,22 C36,12 64,12 64,22 Z" fill={primaryColor} stroke="#0F172A" strokeWidth="1.2" />
          )}
        </svg>

        {/* Floating Mini Suit Inside Court Portrait */}
        <div className="absolute right-1 top-1 opacity-85">
          <SuitSVG suit={suit} className={`w-3.5 h-3.5 ${isRed ? 'text-[#DC2626]' : 'text-[#1E293B]'}`} />
        </div>
      </div>

      {/* Inverted Bottom Half (Standard 180° Symmetrical Playing Card Court) */}
      <div className="relative w-full h-1/2 flex items-center justify-center p-0.5 rotate-180">
        <svg viewBox="0 0 100 90" className="w-full h-full" fill="none">
          <path d="M15,90 L25,45 L75,45 L85,90 Z" fill={primaryColor} stroke="#0F172A" strokeWidth="1.5" />
          <path d="M35,45 L50,90 L65,45 Z" fill={secondaryColor} stroke="#0F172A" strokeWidth="1.2" />
          <path d="M40,55 L60,55 L50,85 Z" fill={tunicDark} />
          <path d="M28,45 C35,38 65,38 72,45 L68,52 C60,48 40,48 32,52 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
          {rank === 'K' && (
            <g stroke="#0F172A" strokeWidth="1.5">
              <line x1="80" y1="20" x2="80" y2="85" stroke="#94A3B8" strokeWidth="2.5" />
              <rect x="74" y="65" width="12" height="3" fill={secondaryColor} />
              <circle cx="80" cy="78" r="3" fill={secondaryColor} />
            </g>
          )}
          {rank === 'Q' && (
            <g>
              <line x1="20" y1="35" x2="20" y2="80" stroke="#0F172A" strokeWidth="2" />
              <circle cx="20" cy="30" r="5" fill={secondaryColor} stroke="#0F172A" strokeWidth="1.2" />
              <circle cx="20" cy="30" r="2" fill={primaryColor} />
            </g>
          )}
          {rank === 'J' && (
            <g stroke="#0F172A" strokeWidth="1.5">
              <line x1="22" y1="25" x2="22" y2="85" stroke="#64748B" strokeWidth="2" />
              <path d="M16,25 C16,18 28,18 28,25 L22,32 Z" fill={secondaryColor} />
            </g>
          )}
          <circle cx="50" cy="32" r="14" fill="#FED7AA" stroke="#0F172A" strokeWidth="1.2" />
          {rank === 'K' && (
            <path d="M38,32 C36,44 42,48 50,48 C58,48 64,44 62,32" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1" />
          )}
          {rank === 'Q' && (
            <path d="M36,28 C34,44 38,48 42,48 M64,28 C66,44 62,48 58,48" fill="#FBBF24" stroke="#0F172A" strokeWidth="1" />
          )}
          {rank === 'J' && (
            <path d="M38,26 C36,36 38,42 42,42 M62,26 C64,36 62,42 58,42" fill="#F59E0B" stroke="#0F172A" strokeWidth="1" />
          )}
          <circle cx="45" cy="30" r="1.5" fill="#0F172A" />
          <circle cx="55" cy="30" r="1.5" fill="#0F172A" />
          <path d="M47,38 Q50,40 53,38" stroke="#0F172A" strokeWidth="1" />
          {rank === 'K' && (
            <path d="M36,22 L42,12 L50,18 L58,12 L64,22 Z" fill={secondaryColor} stroke="#0F172A" strokeWidth="1.2" />
          )}
          {rank === 'Q' && (
            <path d="M38,22 L44,14 L50,20 L56,14 L62,22 Z" fill={secondaryColor} stroke="#0F172A" strokeWidth="1.2" />
          )}
          {rank === 'J' && (
            <path d="M36,22 C36,12 64,12 64,22 Z" fill={primaryColor} stroke="#0F172A" strokeWidth="1.2" />
          )}
        </svg>

        <div className="absolute right-1 top-1 opacity-85">
          <SuitSVG suit={suit} className={`w-3.5 h-3.5 ${isRed ? 'text-[#DC2626]' : 'text-[#1E293B]'}`} />
        </div>
      </div>
    </div>
  );
};

/**
 * Pip Layout Matrix for all standard playing cards (2 through 10)
 * Exactly mirrors standard bicycle & casino cards pip distributions (as shown in spades-cards.png and Screenshot_20260824_143921_Spades.jpg)
 */
export const PipMatrix: React.FC<{
  rank: Rank;
  suit: Suit;
  isRed: boolean;
}> = ({ rank, suit, isRed }) => {
  const suitColorClass = isRed ? 'text-[#DC2626]' : 'text-[#0F172A]';

  // Positions mapped on a percentage grid [x%, y%, isRotated180]
  let pips: Array<{ x: number; y: number; inverted?: boolean }> = [];

  switch (rank) {
    case '2':
      pips = [
        { x: 50, y: 22 },
        { x: 50, y: 78, inverted: true },
      ];
      break;
    case '3':
      pips = [
        { x: 50, y: 20 },
        { x: 50, y: 50 },
        { x: 50, y: 80, inverted: true },
      ];
      break;
    case '4':
      pips = [
        { x: 30, y: 22 },
        { x: 70, y: 22 },
        { x: 30, y: 78, inverted: true },
        { x: 70, y: 78, inverted: true },
      ];
      break;
    case '5':
      pips = [
        { x: 30, y: 22 },
        { x: 70, y: 22 },
        { x: 50, y: 50 },
        { x: 30, y: 78, inverted: true },
        { x: 70, y: 78, inverted: true },
      ];
      break;
    case '6':
      pips = [
        { x: 30, y: 22 },
        { x: 70, y: 22 },
        { x: 30, y: 50 },
        { x: 70, y: 50 },
        { x: 30, y: 78, inverted: true },
        { x: 70, y: 78, inverted: true },
      ];
      break;
    case '7':
      pips = [
        { x: 30, y: 22 },
        { x: 70, y: 22 },
        { x: 50, y: 36 },
        { x: 30, y: 50 },
        { x: 70, y: 50 },
        { x: 30, y: 78, inverted: true },
        { x: 70, y: 78, inverted: true },
      ];
      break;
    case '8':
      pips = [
        { x: 30, y: 20 },
        { x: 70, y: 20 },
        { x: 50, y: 35 },
        { x: 30, y: 50 },
        { x: 70, y: 50 },
        { x: 50, y: 65, inverted: true },
        { x: 30, y: 80, inverted: true },
        { x: 70, y: 80, inverted: true },
      ];
      break;
    case '9':
      pips = [
        { x: 30, y: 18 },
        { x: 70, y: 18 },
        { x: 30, y: 38 },
        { x: 70, y: 38 },
        { x: 50, y: 50 },
        { x: 30, y: 62, inverted: true },
        { x: 70, y: 62, inverted: true },
        { x: 30, y: 82, inverted: true },
        { x: 70, y: 82, inverted: true },
      ];
      break;
    case '10':
      pips = [
        { x: 30, y: 18 },
        { x: 70, y: 18 },
        { x: 50, y: 30 },
        { x: 30, y: 40 },
        { x: 70, y: 40 },
        { x: 30, y: 60, inverted: true },
        { x: 70, y: 60, inverted: true },
        { x: 50, y: 70, inverted: true },
        { x: 30, y: 82, inverted: true },
        { x: 70, y: 82, inverted: true },
      ];
      break;
    case 'A':
      pips = [{ x: 50, y: 50 }];
      break;
  }

  // Determine pip size based on total pips on the card
  const pipSizeClass =
    rank === 'A'
      ? 'w-10 h-10 sm:w-14 sm:h-14'
      : rank === '2' || rank === '3'
      ? 'w-7 h-7 sm:w-9 sm:h-9'
      : rank === '4' || rank === '5' || rank === '6'
      ? 'w-6 h-6 sm:w-8 sm:h-8'
      : 'w-5 h-5 sm:w-6 sm:h-6';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pips.map((pip, idx) => (
        <div
          key={idx}
          className={`absolute -translate-x-1/2 -translate-y-1/2 ${pip.inverted ? 'rotate-180' : ''}`}
          style={{ left: `${pip.x}%`, top: `${pip.y}%` }}
        >
          <SuitSVG suit={suit} className={`${pipSizeClass} ${suitColorClass}`} />
        </div>
      ))}
    </div>
  );
};

/**
 * Authentic VIP Spades Green Medallion Card Back (as shown in reference video frames 00:03 - 00:07)
 */
export const VIPSpadesCardBack: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`relative w-full h-full bg-[#FFFFFF] rounded-xl sm:rounded-2xl border-2 border-[#D1D5DB] overflow-hidden flex items-center justify-center p-1 shadow-md select-none ${className}`}>
      {/* Outer Green Filigree Frame */}
      <div className="relative w-full h-full rounded-lg border-2 border-[#15803D] bg-[#F4F9F4] flex flex-col items-center justify-center p-1 overflow-hidden">
        {/* Subtle geometric background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#15803D_1px,transparent_1px)] [background-size:5px_5px] opacity-15 pointer-events-none" />
        
        {/* Center Circular Medallion */}
        <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-[#15803D] bg-white flex flex-col items-center justify-center shadow-inner z-10 p-0.5">
          {/* Inner ring */}
          <div className="w-full h-full rounded-full border border-[#16A34A]/40 flex flex-col items-center justify-center">
            {/* VIP Text Curved or mini */}
            <span className="text-[5px] sm:text-[6px] font-black text-[#15803D] tracking-widest leading-none uppercase">
              VIP
            </span>
            {/* Green Spade */}
            <div className="w-4 h-4 sm:w-6 sm:h-6 text-[#15803D] my-0.5">
              <SuitSVG suit="spades" className="w-full h-full" />
            </div>
            {/* SPADES Text */}
            <span className="text-[4px] sm:text-[5px] font-extrabold text-[#15803D] tracking-widest leading-none uppercase">
              SPADES
            </span>
          </div>
        </div>

        {/* 4 Corner Mini Green Spades */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 text-[#15803D] opacity-80">
          <SuitSVG suit="spades" className="w-full h-full" />
        </div>
        <div className="absolute top-1 right-1 w-2.5 h-2.5 text-[#15803D] opacity-80">
          <SuitSVG suit="spades" className="w-full h-full" />
        </div>
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 text-[#15803D] opacity-80 rotate-180">
          <SuitSVG suit="spades" className="w-full h-full" />
        </div>
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 text-[#15803D] opacity-80 rotate-180">
          <SuitSVG suit="spades" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

/**
 * Authentic VIP Spades Table Watermark (frames 00:01 - 00:59)
 */
export const VIPSpadesTableWatermark: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 pointer-events-none opacity-20 flex items-center justify-center select-none">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Concentric rings */}
        <circle cx="150" cy="150" r="135" stroke="#1E658B" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <circle cx="150" cy="150" r="125" stroke="#1E658B" strokeWidth="2" fill="none" />
        <circle cx="150" cy="150" r="115" stroke="#1E658B" strokeWidth="1" fill="none" />
        <circle cx="150" cy="150" r="85" stroke="#1E658B" strokeWidth="1.5" fill="none" />

        {/* Curved Text VIP SPADES top */}
        <path id="vipSpadesPathTop" d="M 50,150 A 100,100 0 0,1 250,150" fill="none" />
        <text fill="#1E658B" fontSize="16" fontWeight="bold" letterSpacing="4" fontFamily="sans-serif">
          <textPath href="#vipSpadesPathTop" startOffset="50%" textAnchor="middle">
            VIP SPADES
          </textPath>
        </text>

        {/* Center Large Spade */}
        <g transform="translate(100, 95) scale(1)">
          <path
            d="M50,10 C42,28 15,50 9,66 C4,79 14,90 29,90 C38,90 44,84 47,77 C50,84 56,90 65,90 C80,90 90,79 85,66 C79,50 52,28 50,10 Z"
            fill="none"
            stroke="#1E658B"
            strokeWidth="2.5"
          />
          <path d="M47,74 C48,82 43,96 36,102 L64,102 C57,96 52,82 53,74 Z" fill="#1E658B" opacity="0.8" />
        </g>

        {/* 100% Badge in center */}
        <circle cx="150" cy="165" r="16" fill="#0A364E" stroke="#1E658B" strokeWidth="1" />
        <text x="150" y="169" textAnchor="middle" fill="#1E658B" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
          100%
        </text>

        {/* Curved Text www.vipspades.com bottom */}
        <path id="vipSpadesPathBottom" d="M 50,150 A 100,100 0 0,0 250,150" fill="none" />
        <text fill="#1E658B" fontSize="11" fontWeight="bold" letterSpacing="2" fontFamily="sans-serif">
          <textPath href="#vipSpadesPathBottom" startOffset="50%" textAnchor="middle">
            www.vipspades.com
          </textPath>
        </text>
      </svg>
    </div>
  );
};

