import React from 'react';
import { BidValue, Position, GameSettings } from '../types/spades';
import { motion } from 'motion/react';

interface BiddingModalProps {
  position: Position;
  playerName: string;
  partnerName: string;
  partnerBid?: { bid: BidValue; isBlindNil?: boolean };
  settings: GameSettings;
  onPlaceBid: (bid: BidValue, isBlindNil?: boolean) => void;
}

export const BiddingModal: React.FC<BiddingModalProps> = ({
  onPlaceBid,
}) => {
  // 14 Bids: 0 to 13 matching video frame 00:08 - 00:14
  const row1 = [0, 1, 2, 3];
  const row2 = [4, 5, 6, 7];
  const row3 = [8, 9, 10, 11];
  const row4 = [12, 13];

  const handleSelectBid = (num: number) => {
    if (num === 0) {
      onPlaceBid('nil', false);
    } else {
      onPlaceBid(num as BidValue, false);
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-2 select-none pointer-events-auto bg-black/35 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 10 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        id="bidding-modal-dialog"
        className="w-[260px] sm:w-[300px] bg-gradient-to-b from-[#062c1e] via-[#042015] to-[#02170f] border-2 border-[#15803d] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(34,197,94,0.3)] overflow-hidden flex flex-col p-2.5 sm:p-3"
      >
        {/* Header Bar */}
        <div className="w-full bg-gradient-to-r from-[#0d4f30] via-[#15803d] to-[#0d4f30] border border-[#22c55e]/40 rounded-xl py-1.5 px-3 text-center mb-2.5 shadow-inner">
          <span className="font-extrabold text-xs sm:text-sm tracking-widest text-[#FEF08A] uppercase font-sans drop-shadow">
            SELECT BID
          </span>
        </div>

        {/* 4-Column Golden Grid Matching Frame 00:08 */}
        <div className="flex flex-col gap-1.5">
          {/* Row 1: 0, 1, 2, 3 */}
          <div className="grid grid-cols-4 gap-1.5">
            {row1.map((num) => (
              <button
                key={num}
                id={`bid-btn-${num}`}
                type="button"
                onClick={() => handleSelectBid(num)}
                className={`h-11 sm:h-12 rounded-xl font-black text-base sm:text-lg font-mono flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-[0_3px_8px_rgba(0,0,0,0.5)] border ${
                  num === 0
                    ? 'bg-gradient-to-b from-[#A3E635] via-[#84CC16] to-[#65A30D] hover:from-[#BEF264] text-[#1A2E05] border-[#D9F99D]'
                    : 'bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#CA8A04] hover:from-[#FEF08A] hover:to-[#EAB308] text-[#3A2203] border-[#FEF08A]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Row 2: 4, 5, 6, 7 */}
          <div className="grid grid-cols-4 gap-1.5">
            {row2.map((num) => (
              <button
                key={num}
                id={`bid-btn-${num}`}
                type="button"
                onClick={() => handleSelectBid(num)}
                className="h-11 sm:h-12 rounded-xl font-black text-base sm:text-lg font-mono flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-[0_3px_8px_rgba(0,0,0,0.5)] bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#CA8A04] hover:from-[#FEF08A] hover:to-[#EAB308] text-[#3A2203] border border-[#FEF08A]"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Row 3: 8, 9, 10, 11 */}
          <div className="grid grid-cols-4 gap-1.5">
            {row3.map((num) => (
              <button
                key={num}
                id={`bid-btn-${num}`}
                type="button"
                onClick={() => handleSelectBid(num)}
                className="h-11 sm:h-12 rounded-xl font-black text-base sm:text-lg font-mono flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-[0_3px_8px_rgba(0,0,0,0.5)] bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#CA8A04] hover:from-[#FEF08A] hover:to-[#EAB308] text-[#3A2203] border border-[#FEF08A]"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Row 4: 12, 13 (Centered) */}
          <div className="grid grid-cols-4 gap-1.5">
            <div />
            {row4.map((num) => (
              <button
                key={num}
                id={`bid-btn-${num}`}
                type="button"
                onClick={() => handleSelectBid(num)}
                className="h-11 sm:h-12 rounded-xl font-black text-base sm:text-lg font-mono flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-[0_3px_8px_rgba(0,0,0,0.5)] bg-gradient-to-b from-[#FDE047] via-[#EAB308] to-[#CA8A04] hover:from-[#FEF08A] hover:to-[#EAB308] text-[#3A2203] border border-[#FEF08A]"
              >
                {num}
              </button>
            ))}
            <div />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
