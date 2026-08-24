import React, { useEffect } from 'react';
import { RoundScoreRecord, SpadesGameState, TeamId } from '../types/spades';
import confetti from 'canvas-confetti';
import { Trophy, Award, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

interface RoundSummaryModalProps {
  gameState: SpadesGameState;
  onNextRound: () => void;
  onRestartGame: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  gameState,
  onNextRound,
  onRestartGame,
}) => {
  const { phase, scores, history, winner, roundNumber, settings } = gameState;
  const isGameOver = phase === 'game_over' || !!winner;

  const latestRecord: RoundScoreRecord | undefined = history[history.length - 1];
  const ns = scores.team_north_south;
  const ew = scores.team_east_west;

  useEffect(() => {
    if (isGameOver) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isGameOver]);

  if (phase !== 'round_summary' && phase !== 'game_over') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        id="round-summary-modal"
        className="w-full max-w-xl bg-[#161616] border border-[#2A2A2A] rounded-3xl p-6 text-[#E0E0E0] shadow-2xl space-y-5"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          {isGameOver ? (
            <div className="flex flex-col items-center gap-1">
              <div className="p-3 bg-[#1F1B12] text-[#D4AF37] rounded-2xl border border-[#D4AF37]/50 shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] font-bold">
                Game Over • Final Victory
              </span>
              <h2 className="text-2xl font-serif italic font-bold text-white">
                {winner === 'team_north_south' ? 'North & South Team Wins!' : 'East & West Team Wins!'}
              </h2>
            </div>
          ) : (
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-[#D4AF37] font-bold">
                Round {roundNumber} Completed
              </span>
              <h2 className="text-xl font-serif italic font-bold text-white">Round Scoring Breakdown</h2>
            </div>
          )}
        </div>

        {/* Score Comparison Cards for this Round */}
        <div className="grid grid-cols-2 gap-3">
          {/* North & South */}
          <div className="bg-[#111111] border border-[#D4AF37]/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-[#222222] pb-2">
              <span className="text-xs font-bold text-[#D4AF37] uppercase font-mono">North & South</span>
              <span className="text-xs font-mono font-bold text-white">
                Total: {ns.totalScore} pts
              </span>
            </div>

            {latestRecord && (
              <div className="text-xs space-y-1 text-[#CCCCCC] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#888888]">Bid (Books):</span>
                  <span className="font-semibold text-white">{latestRecord.teamNorthSouth.bid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Tricks Won:</span>
                  <span className="font-semibold text-white">{latestRecord.teamNorthSouth.tricks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">New Bags:</span>
                  <span className="font-semibold text-[#D4AF37]">
                    +{latestRecord.teamNorthSouth.bags}
                  </span>
                </div>
                {latestRecord.teamNorthSouth.bagPenalty && (
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>Sandbag Penalty:</span>
                    <span>-100 pts</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-[#222222] font-bold">
                  <span>Round Delta:</span>
                  <span className={latestRecord.teamNorthSouth.score >= 0 ? 'text-[#D4AF37]' : 'text-rose-400'}>
                    {latestRecord.teamNorthSouth.score >= 0 ? `+${latestRecord.teamNorthSouth.score}` : latestRecord.teamNorthSouth.score} pts
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* East & West */}
          <div className="bg-[#111111] border border-[#333333] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-[#222222] pb-2">
              <span className="text-xs font-bold text-[#A3A3A3] uppercase font-mono">East & West</span>
              <span className="text-xs font-mono font-bold text-white">
                Total: {ew.totalScore} pts
              </span>
            </div>

            {latestRecord && (
              <div className="text-xs space-y-1 text-[#CCCCCC] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#888888]">Bid (Books):</span>
                  <span className="font-semibold text-white">{latestRecord.teamEastWest.bid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Tricks Won:</span>
                  <span className="font-semibold text-white">{latestRecord.teamEastWest.tricks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">New Bags:</span>
                  <span className="font-semibold text-[#D4AF37]">
                    +{latestRecord.teamEastWest.bags}
                  </span>
                </div>
                {latestRecord.teamEastWest.bagPenalty && (
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>Sandbag Penalty:</span>
                    <span>-100 pts</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-[#222222] font-bold">
                  <span>Round Delta:</span>
                  <span className={latestRecord.teamEastWest.score >= 0 ? 'text-[#D4AF37]' : 'text-rose-400'}>
                    {latestRecord.teamEastWest.score >= 0 ? `+${latestRecord.teamEastWest.score}` : latestRecord.teamEastWest.score} pts
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isGameOver ? (
            <button
              id="restart-game-btn"
              type="button"
              onClick={onRestartGame}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#C69214] text-black font-extrabold rounded-2xl shadow-xl text-base flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Start New Match</span>
            </button>
          ) : (
            <button
              id="next-round-btn"
              type="button"
              onClick={onNextRound}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#C69214] text-black font-extrabold rounded-2xl shadow-xl text-base flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
            >
              <span>Deal Round #{roundNumber + 1}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
