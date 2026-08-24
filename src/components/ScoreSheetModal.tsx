import React from 'react';
import { GameSettings, RoundScoreRecord, TeamScore } from '../types/spades';
import { ScoreBoard } from './ScoreBoard';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface ScoreSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: {
    team_north_south: TeamScore;
    team_east_west: TeamScore;
  };
  history: RoundScoreRecord[];
  settings: GameSettings;
  roundNumber: number;
}

export const ScoreSheetModal: React.FC<ScoreSheetModalProps> = ({
  isOpen,
  onClose,
  scores,
  history,
  settings,
  roundNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        className="relative w-full max-w-lg bg-[#072435] border-2 border-[#164F73] rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          id="close-scoresheet-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0A2E44] hover:bg-[#11405E] active:scale-95 text-[#94A3B8] hover:text-white flex items-center justify-center cursor-pointer transition-all border border-[#164F73] z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto pr-1">
          <ScoreBoard
            scores={scores}
            history={history}
            settings={settings}
            roundNumber={roundNumber}
          />
        </div>
      </motion.div>
    </div>
  );
};
