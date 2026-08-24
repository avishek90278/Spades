import React from 'react';
import { X, RotateCcw, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSameDeal: () => void;
  onNewGame: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onSameDeal,
  onNewGame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 select-none">
      {/* Background card fan illustration matching frame 00:00 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 10 }}
        id="new-game-dialog"
        className="relative w-full max-w-sm bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EEF2F6] rounded-3xl p-6 shadow-2xl text-center border border-white/50 overflow-hidden"
      >
        {/* Close "X" Button Top Right */}
        <button
          id="close-new-game-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] active:scale-95 text-[#475569] flex items-center justify-center cursor-pointer transition-all shadow-sm z-20"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Decorative Card Fan Header Artwork (as shown in video) */}
        <div className="flex justify-center -mt-2 mb-4 pointer-events-none opacity-90">
          <div className="relative w-28 h-16 flex items-center justify-center">
            <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-white to-[#E2E8F0] border border-[#CBD5E1] shadow-md -rotate-15 -translate-x-3 flex items-center justify-center font-bold text-xs text-[#DC2626]">
              A♥
            </div>
            <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-white to-[#E2E8F0] border border-[#CBD5E1] shadow-lg z-10 flex items-center justify-center font-bold text-xs text-[#0F172A]">
              ♠
            </div>
            <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-white to-[#E2E8F0] border border-[#CBD5E1] shadow-md rotate-15 translate-x-3 flex items-center justify-center font-bold text-xs text-[#DC2626]">
              K♦
            </div>
          </div>
        </div>

        {/* Modal Text */}
        <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] leading-snug">
          Do you want to forfeit the current game?
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1 mb-6 font-medium">
          Select new game type:
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {/* SAME DEAL button (Cream/light-gray) */}
          <button
            id="modal-same-deal-btn"
            type="button"
            onClick={() => {
              onSameDeal();
              onClose();
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-b from-[#EFEFE8] via-[#E4E4DC] to-[#D5D5CB] hover:from-white hover:to-[#E2E2D8] active:scale-98 border border-[#B8B8AA] rounded-2xl shadow-md text-[#33332D] font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4 text-[#33332D]" />
            <span>SAME DEAL</span>
          </button>

          {/* NEW GAME button (Bright green pill button) */}
          <button
            id="modal-new-game-btn"
            type="button"
            onClick={() => {
              onNewGame();
              onClose();
            }}
            className="w-full py-3.5 px-4 bg-gradient-to-b from-[#22C55E] via-[#16A34A] to-[#15803D] hover:from-[#4ADE80] hover:to-[#166534] active:scale-98 border border-[#86EFAC] rounded-2xl shadow-[0_6px_20px_rgba(22,163,74,0.4)] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            <span>NEW GAME</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
