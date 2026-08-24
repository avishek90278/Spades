import React from 'react';
import { CompletedTrick, Position, Suit } from '../types/spades';
import { SuitSVG } from './CardArtwork';
import { motion } from 'motion/react';

interface PreviousTrickHUDProps {
  lastTrick?: CompletedTrick;
  onClick?: () => void;
}

export const PreviousTrickHUD: React.FC<PreviousTrickHUDProps> = ({ lastTrick, onClick }) => {
  if (!lastTrick || !lastTrick.cards || lastTrick.cards.length === 0) {
    return null;
  }

  const getCardForPosition = (pos: Position) => {
    return lastTrick.cards.find((c) => c.position === pos);
  };

  const northCard = getCardForPosition('north');
  const westCard = getCardForPosition('west');
  const eastCard = getCardForPosition('east');
  const southCard = getCardForPosition('south');

  const winnerPos = lastTrick.winner;

  const renderMiniCard = (
    playedItem?: { position: Position; card: { id: string; rank: string; suit: Suit } },
    posName?: Position
  ) => {
    if (!playedItem) {
      return (
        <div className="w-5 h-7 sm:w-6 sm:h-8 rounded bg-[#092b3e]/60 border border-[#144b6d]/40 flex items-center justify-center text-[9px] text-[#47708a]">
          -
        </div>
      );
    }

    const { card, position } = playedItem;
    const isWinner = position === winnerPos;
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

    return (
      <div
        className={`w-5 h-7 sm:w-6 sm:h-8 rounded flex flex-col items-center justify-center p-0.5 shadow transition-all shrink-0 ${
          isWinner
            ? 'bg-[#E8FDF0] border-2 border-[#16A34A] ring-1 ring-[#22C55E] scale-105 z-10'
            : 'bg-[#F8FAFC] border border-[#94A3B8]'
        }`}
      >
        <span
          className={`font-['Bebas_Neue',sans-serif] text-[10px] sm:text-xs font-black leading-none ${
            isRed ? 'text-[#DC2626]' : 'text-[#0F172A]'
          }`}
        >
          {card.rank}
        </span>
        <div className={`mt-0.2 ${isRed ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>
          <SuitSVG suit={card.suit} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </div>
      </div>
    );
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      type="button"
      id="previous-trick-hud-btn"
      onClick={onClick}
      className="bg-[#072435]/90 hover:bg-[#0A2E44] border border-[#164F73] rounded-xl p-1.5 shadow-lg flex flex-col items-center justify-center cursor-pointer transition-all w-16 sm:w-20 h-16 sm:h-20 select-none group"
      title="Previous Trick (Click for Trick Log)"
    >
      {/* 4 Compass Seats Mini Display */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* North */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          {renderMiniCard(northCard, 'north')}
        </div>
        {/* West */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          {renderMiniCard(westCard, 'west')}
        </div>
        {/* East */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {renderMiniCard(eastCard, 'east')}
        </div>
        {/* South */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {renderMiniCard(southCard, 'south')}
        </div>
      </div>
    </motion.button>
  );
};
