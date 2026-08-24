import React, { useEffect } from 'react';
import { RoundScoreRecord, SpadesGameState } from '../types/spades';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

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
  const { phase, scores, history, winner, roundNumber } = gameState;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div
        id="round-summary-modal"
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#09293B] to-[#061D2B] border-2 border-[#165173] rounded-3xl p-4 sm:p-6 text-white shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          {isGameOver ? (
            <div className="flex flex-col items-center gap-1">
              <div className="p-3 bg-gradient-to-b from-[#F59E0B] to-[#D97706] text-[#451A03] rounded-2xl border-2 border-[#FEF08A] shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FBBF24] font-black">
                MATCH VICTORY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {winner === 'team_north_south' ? 'US (North & South) Win!' : 'THEM (East & West) Win!'}
              </h2>
            </div>
          ) : (
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-[#4ADE80] font-bold">
                Round {roundNumber} Completed
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Round Scoring Breakdown</h2>
            </div>
          )}
        </div>

        {/* Score Comparison Cards for this Round */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* North & South (US) */}
          <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-[#165173] pb-2">
              <span className="text-xs font-bold text-[#38BDF8] uppercase font-mono">US (North & South)</span>
              <span className="text-xs font-mono font-black text-white">
                Total: {ns.totalScore} pts
              </span>
            </div>

            {latestRecord && (
              <div className="text-xs space-y-1 text-[#CBD5E1] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Bid (Books):</span>
                  <span className="font-bold text-white">{latestRecord.teamNorthSouth.bid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Tricks Won:</span>
                  <span className="font-bold text-white">{latestRecord.teamNorthSouth.tricks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">New Bags:</span>
                  <span className="font-bold text-[#38BDF8]">
                    +{latestRecord.teamNorthSouth.bags}
                  </span>
                </div>
                {latestRecord.teamNorthSouth.bagPenalty && (
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>Sandbag Penalty:</span>
                    <span>-100 pts</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-[#165173] font-bold">
                  <span>Round Delta:</span>
                  <span
                    className={
                      latestRecord.teamNorthSouth.score >= 0
                        ? 'text-[#4ADE80]'
                        : 'text-rose-400'
                    }
                  >
                    {latestRecord.teamNorthSouth.score >= 0 ? '+' : ''}
                    {latestRecord.teamNorthSouth.score} pts
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* East & West (THEM) */}
          <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-[#165173] pb-2">
              <span className="text-xs font-bold text-[#FB7185] uppercase font-mono">THEM (East & West)</span>
              <span className="text-xs font-mono font-black text-white">
                Total: {ew.totalScore} pts
              </span>
            </div>

            {latestRecord && (
              <div className="text-xs space-y-1 text-[#CBD5E1] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Bid (Books):</span>
                  <span className="font-bold text-white">{latestRecord.teamEastWest.bid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Tricks Won:</span>
                  <span className="font-bold text-white">{latestRecord.teamEastWest.tricks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">New Bags:</span>
                  <span className="font-bold text-[#FB7185]">
                    +{latestRecord.teamEastWest.bags}
                  </span>
                </div>
                {latestRecord.teamEastWest.bagPenalty && (
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>Sandbag Penalty:</span>
                    <span>-100 pts</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-[#165173] font-bold">
                  <span>Round Delta:</span>
                  <span
                    className={
                      latestRecord.teamEastWest.score >= 0
                        ? 'text-[#4ADE80]'
                        : 'text-rose-400'
                    }
                  >
                    {latestRecord.teamEastWest.score >= 0 ? '+' : ''}
                    {latestRecord.teamEastWest.score} pts
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Total Standings Progress */}
        <div className="bg-[#061D2B] border border-[#165173] p-3 rounded-2xl space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#38BDF8] font-bold">US: {ns.totalScore} pts ({ns.bags} bags)</span>
            <span className="text-[#FB7185] font-bold">THEM: {ew.totalScore} pts ({ew.bags} bags)</span>
          </div>
          <div className="w-full h-2 bg-[#0A293B] rounded-full overflow-hidden flex border border-[#165173]">
            <div
              className="bg-[#38BDF8] h-full transition-all"
              style={{
                width: `${Math.max(
                  5,
                  Math.min(
                    95,
                    (Math.max(0, ns.totalScore) /
                      (Math.max(1, ns.totalScore) + Math.max(1, ew.totalScore))) *
                      100
                  )
                )}%`,
              }}
            />
            <div
              className="bg-[#FB7185] h-full transition-all"
              style={{
                width: `${Math.max(
                  5,
                  Math.min(
                    95,
                    (Math.max(0, ew.totalScore) /
                      (Math.max(1, ns.totalScore) + Math.max(1, ew.totalScore))) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2">
          {isGameOver ? (
            <button
              id="summary-play-again-btn"
              type="button"
              onClick={onRestartGame}
              className="w-full py-3.5 bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#451A03] font-black rounded-2xl border-2 border-[#FEF08A] shadow-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#451A03] stroke-[3]" />
              <span>Start New Match</span>
            </button>
          ) : (
            <button
              id="summary-next-round-btn"
              type="button"
              onClick={onNextRound}
              className="w-full py-3.5 bg-gradient-to-b from-[#EFEFE8] via-[#E4E4DC] to-[#D5D5CB] hover:from-white hover:to-[#DFDFD6] text-[#3D3D38] font-black rounded-2xl border border-[#B0B0A2] shadow-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Next Round</span>
              <ArrowRight className="w-4 h-4 text-[#3D3D38] stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
