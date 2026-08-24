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
    <div id="scoreboard-container" className="bg-gradient-to-b from-[#09293B] to-[#061D2B] border-2 border-[#165173] rounded-3xl p-4 text-white shadow-2xl backdrop-blur-md select-none">
      {/* Title & Target */}
      <div className="flex items-center justify-between border-b border-[#165173] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#FBBF24]" />
          <h3 className="text-sm sm:text-base font-black text-white tracking-wide">Match Scoreboard</h3>
        </div>
        <span className="text-xs font-mono bg-[#061D2B] px-3 py-1 rounded-xl text-[#4ADE80] border border-[#165173] font-bold">
          Target: {settings.targetScore} Pts • Round {roundNumber}
        </span>
      </div>

      {/* Primary Score Comparison Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* North / South Team (US) */}
        <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#38BDF8] tracking-wider uppercase font-mono">
              US (North & South)
            </span>
          </div>

          <div className="my-1">
            <span className="text-3xl font-black tracking-tight text-[#38BDF8] font-mono">{ns.totalScore}</span>
            <span className="text-xs text-[#94A3B8] ml-1.5 font-mono">pts</span>
          </div>

          {/* Bag Progress Meter */}
          <div className="space-y-1 mt-2 pt-2 border-t border-[#165173]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#CBD5E1] font-medium flex items-center gap-1">
                Bags: <strong className="text-[#38BDF8]">{ns.bags}</strong> / {settings.bagPenaltyThreshold}
              </span>
              {ns.bags >= 7 && (
                <span className="text-[10px] text-rose-400 flex items-center gap-0.5 font-semibold animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Risk of -100!
                </span>
              )}
            </div>
            {/* Visual 10-segment bag meter */}
            <div className="grid grid-cols-10 gap-0.5 h-2 bg-[#061D2B] rounded-full p-0.5 overflow-hidden border border-[#165173]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm transition-colors ${
                    i < ns.bags
                      ? i >= 7
                        ? 'bg-rose-500'
                        : 'bg-[#38BDF8]'
                      : 'bg-[#0B3147]'
                  }`}
                />
              ))}
            </div>
            {ns.bagPenalties > 0 && (
              <span className="text-[10px] text-rose-400 font-mono block">
                Penalties incurred: {ns.bagPenalties} (-{ns.bagPenalties * 100} pts)
              </span>
            )}
          </div>
        </div>

        {/* East / West Team (THEM) */}
        <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-3.5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#FB7185] tracking-wider uppercase font-mono">
              THEM (East & West)
            </span>
          </div>

          <div className="my-1">
            <span className="text-3xl font-black tracking-tight text-[#FB7185] font-mono">{ew.totalScore}</span>
            <span className="text-xs text-[#94A3B8] ml-1.5 font-mono">pts</span>
          </div>

          {/* Bag Progress Meter */}
          <div className="space-y-1 mt-2 pt-2 border-t border-[#165173]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#CBD5E1] font-medium flex items-center gap-1">
                Bags: <strong className="text-[#FB7185]">{ew.bags}</strong> / {settings.bagPenaltyThreshold}
              </span>
              {ew.bags >= 7 && (
                <span className="text-[10px] text-rose-400 flex items-center gap-0.5 font-semibold animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Risk of -100!
                </span>
              )}
            </div>
            {/* Visual 10-segment bag meter */}
            <div className="grid grid-cols-10 gap-0.5 h-2 bg-[#061D2B] rounded-full p-0.5 overflow-hidden border border-[#165173]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm transition-colors ${
                    i < ew.bags
                      ? i >= 7
                        ? 'bg-rose-500'
                        : 'bg-[#FB7185]'
                      : 'bg-[#0B3147]'
                  }`}
                />
              ))}
            </div>
            {ew.bagPenalties > 0 && (
              <span className="text-[10px] text-rose-400 font-mono block">
                Penalties incurred: {ew.bagPenalties} (-{ew.bagPenalties * 100} pts)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Historic Round By Round Table */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-[#7DD3FC] uppercase tracking-wider font-mono block">
          Round Score Log
        </span>

        {history.length === 0 ? (
          <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-4 text-center text-xs text-[#94A3B8] font-mono">
            Round 1 in progress. Results will log here at round conclusion.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#165173] bg-[#061D2B]">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-[#0B3147] text-[#BAE6FD] text-[10px] uppercase border-b border-[#165173]">
                <tr>
                  <th className="py-2 px-3">Rnd</th>
                  <th className="py-2 px-3">US (Bid/Trk)</th>
                  <th className="py-2 px-3">US Delta</th>
                  <th className="py-2 px-3">THEM (Bid/Trk)</th>
                  <th className="py-2 px-3">THEM Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#165173]/50">
                {history.map((record) => (
                  <tr key={record.roundNumber} className="hover:bg-[#0B3147]/50 transition-colors">
                    <td className="py-2 px-3 font-bold text-white">#{record.roundNumber}</td>
                    <td className="py-2 px-3 text-[#38BDF8]">
                      {record.teamNorthSouth.bid}/{record.teamNorthSouth.tricks}
                    </td>
                    <td
                      className={`py-2 px-3 font-bold ${
                        record.teamNorthSouth.score >= 0 ? 'text-[#4ADE80]' : 'text-rose-400'
                      }`}
                    >
                      {record.teamNorthSouth.score >= 0 ? '+' : ''}
                      {record.teamNorthSouth.score}
                    </td>
                    <td className="py-2 px-3 text-[#FB7185]">
                      {record.teamEastWest.bid}/{record.teamEastWest.tricks}
                    </td>
                    <td
                      className={`py-2 px-3 font-bold ${
                        record.teamEastWest.score >= 0 ? 'text-[#4ADE80]' : 'text-rose-400'
                      }`}
                    >
                      {record.teamEastWest.score >= 0 ? '+' : ''}
                      {record.teamEastWest.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
