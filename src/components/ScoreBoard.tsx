import React from 'react';
import { GameSettings, RoundScoreRecord, TeamScore } from '../types/spades';
import { Trophy, AlertTriangle } from 'lucide-react';

interface ScoreBoardProps {
  scores: {
    team_north_south: TeamScore;
    team_east_west: TeamScore;
  };
  history: RoundScoreRecord[];
  settings: GameSettings;
  roundNumber: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  history,
  settings,
  roundNumber,
}) => {
  const ns = scores.team_north_south;
  const ew = scores.team_east_west;

  return (
    <div id="scoreboard-container" className="bg-[#161616]/95 border border-[#2A2A2A] rounded-2xl p-4 text-[#E0E0E0] shadow-2xl backdrop-blur-md">
      {/* Title & Target */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-serif italic text-base font-semibold text-white tracking-wide">Match Scoreboard</h3>
        </div>
        <span className="text-xs font-mono bg-[#222222] px-3 py-1 rounded-full text-[#D4AF37] border border-[#333333]">
          Target: {settings.targetScore} Pts • Round {roundNumber}
        </span>
      </div>

      {/* Primary Score Comparison Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* North / South Team (You & Partner) */}
        <div className="bg-[#111111] border border-[#D4AF37]/40 rounded-xl p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase font-mono">
              North & South (You)
            </span>
            <span className="text-[10px] font-mono text-[#888888]">Team Alpha</span>
          </div>

          <div className="my-1">
            <span className="text-3xl font-serif font-black tracking-tight text-[#D4AF37]">{ns.totalScore}</span>
            <span className="text-xs text-[#888888] ml-1.5 font-mono">pts</span>
          </div>

          {/* Bag Progress Meter */}
          <div className="space-y-1 mt-2 pt-2 border-t border-[#222222]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#888888] font-medium flex items-center gap-1">
                Bags: <strong className="text-[#D4AF37]">{ns.bags}</strong> / {settings.bagPenaltyThreshold}
              </span>
              {ns.bags >= 7 && (
                <span className="text-[10px] text-rose-400 flex items-center gap-0.5 font-semibold animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Risk of -100!
                </span>
              )}
            </div>
            {/* Visual 10-segment bag meter */}
            <div className="grid grid-cols-10 gap-0.5 h-2 bg-[#0A0A0A] rounded-full p-0.5 overflow-hidden border border-[#2A2A2A]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm transition-colors ${
                    i < ns.bags
                      ? i >= 7
                        ? 'bg-rose-500'
                        : 'bg-[#D4AF37]'
                      : 'bg-[#222222]'
                  }`}
                />
              ))}
            </div>
            {ns.bagPenalties > 0 && (
              <span className="text-[10px] text-rose-400 block font-mono">
                Penalties suffered: {ns.bagPenalties} (-{ns.bagPenalties * 100} pts)
              </span>
            )}
          </div>
        </div>

        {/* East / West Team (Opponents) */}
        <div className="bg-[#111111] border border-[#333333] rounded-xl p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#A3A3A3] tracking-wider uppercase font-mono">
              East & West (Opponents)
            </span>
            <span className="text-[10px] font-mono text-[#888888]">Team Omega</span>
          </div>

          <div className="my-1">
            <span className="text-3xl font-serif font-black tracking-tight text-white">{ew.totalScore}</span>
            <span className="text-xs text-[#888888] ml-1.5 font-mono">pts</span>
          </div>

          {/* Bag Progress Meter */}
          <div className="space-y-1 mt-2 pt-2 border-t border-[#222222]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#888888] font-medium flex items-center gap-1">
                Bags: <strong className="text-[#D4AF37]">{ew.bags}</strong> / {settings.bagPenaltyThreshold}
              </span>
              {ew.bags >= 7 && (
                <span className="text-[10px] text-rose-400 flex items-center gap-0.5 font-semibold animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Risk of -100!
                </span>
              )}
            </div>
            {/* Visual 10-segment bag meter */}
            <div className="grid grid-cols-10 gap-0.5 h-2 bg-[#0A0A0A] rounded-full p-0.5 overflow-hidden border border-[#2A2A2A]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm transition-colors ${
                    i < ew.bags
                      ? i >= 7
                        ? 'bg-rose-500'
                        : 'bg-[#D4AF37]'
                      : 'bg-[#222222]'
                  }`}
                />
              ))}
            </div>
            {ew.bagPenalties > 0 && (
              <span className="text-[10px] text-rose-400 block font-mono">
                Penalties suffered: {ew.bagPenalties} (-{ew.bagPenalties * 100} pts)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Score History Table */}
      {history.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider font-mono">
            Round-by-Round Log
          </div>
          <div className="max-h-40 overflow-y-auto rounded-lg border border-[#2A2A2A] bg-[#0E0E0E] text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-[#888888] font-mono text-[10px] bg-[#161616]">
                  <th className="py-1.5 px-2">Rnd</th>
                  <th className="py-1.5 px-2 text-[#D4AF37]">N/S Bid (Won)</th>
                  <th className="py-1.5 px-2 text-[#D4AF37]">N/S Δ</th>
                  <th className="py-1.5 px-2 text-[#A3A3A3]">E/W Bid (Won)</th>
                  <th className="py-1.5 px-2 text-[#A3A3A3]">E/W Δ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222] font-mono">
                {history.map((rec) => (
                  <tr key={rec.roundNumber} className="hover:bg-[#1A1A1A]">
                    <td className="py-1.5 px-2 text-[#888888]">#{rec.roundNumber}</td>
                    <td className="py-1.5 px-2 text-[#E0E0E0]">
                      {rec.teamNorthSouth.bid} ({rec.teamNorthSouth.tricks})
                      {rec.teamNorthSouth.nilSuccess && (
                        <span className="text-[#D4AF37] ml-1">✓Nil</span>
                      )}
                      {rec.teamNorthSouth.nilFailed && (
                        <span className="text-rose-400 ml-1">✗Nil</span>
                      )}
                    </td>
                    <td
                      className={`py-1.5 px-2 font-bold ${
                        rec.teamNorthSouth.score >= 0 ? 'text-[#D4AF37]' : 'text-rose-400'
                      }`}
                    >
                      {rec.teamNorthSouth.score >= 0 ? `+${rec.teamNorthSouth.score}` : rec.teamNorthSouth.score}
                    </td>
                    <td className="py-1.5 px-2 text-[#E0E0E0]">
                      {rec.teamEastWest.bid} ({rec.teamEastWest.tricks})
                      {rec.teamEastWest.nilSuccess && (
                        <span className="text-[#D4AF37] ml-1">✓Nil</span>
                      )}
                      {rec.teamEastWest.nilFailed && (
                        <span className="text-rose-400 ml-1">✗Nil</span>
                      )}
                    </td>
                    <td
                      className={`py-1.5 px-2 font-bold ${
                        rec.teamEastWest.score >= 0 ? 'text-[#D4AF37]' : 'text-rose-400'
                      }`}
                    >
                      {rec.teamEastWest.score >= 0 ? `+${rec.teamEastWest.score}` : rec.teamEastWest.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
