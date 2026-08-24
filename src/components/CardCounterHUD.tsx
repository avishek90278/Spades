import React from 'react';
import { CardTrackerState, Position, SpadesGameState, Suit } from '../types/spades';
import { Brain, Cpu, Zap } from 'lucide-react';
import { SUIT_SYMBOLS } from '../engine/deck';

interface CardCounterHUDProps {
  tracker: CardTrackerState;
  gameState: SpadesGameState;
}

export const CardCounterHUD: React.FC<CardCounterHUDProps> = ({
  tracker,
  gameState,
}) => {
  const suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  const positions: Position[] = ['north', 'east', 'south', 'west'];

  return (
    <div id="card-counter-hud" className="bg-[#161616]/95 border border-[#2A2A2A] rounded-2xl p-4 text-[#E0E0E0] shadow-2xl space-y-4 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2.5">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-serif italic text-base font-semibold text-white tracking-wide">
            Telemetry & Card Counter
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-[#222222] text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#D4AF37]" /> Bot Engine Active
        </span>
      </div>

      {/* Spades & Trump Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#888888] font-mono block">
            Remaining Spades (Trump)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#D4AF37] font-mono">{tracker.remainingSpades}</span>
            <span className="text-xs text-[#888888] font-mono">/ 13 in game</span>
          </div>
          <div className="w-full bg-[#0A0A0A] h-1.5 rounded-full mt-2 overflow-hidden border border-[#222222]">
            <div
              className="bg-[#D4AF37] h-full transition-all duration-300"
              style={{ width: `${(tracker.remainingSpades / 13) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#888888] font-mono block">
            Spades Broken Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase font-mono ${
                gameState.spadesBroken
                  ? 'bg-[#1F1B12] text-[#D4AF37] border border-[#D4AF37]/50'
                  : 'bg-[#222222] text-[#888888] border border-[#333333]'
              }`}
            >
              {gameState.spadesBroken ? '✓ Broken (Lead OK)' : '✗ Not Broken'}
            </span>
          </div>
          <span className="text-[10px] text-[#888888] mt-1">
            {gameState.spadesBroken ? 'Any player may lead Spades.' : 'Cannot lead Spades unless only trumps remain.'}
          </span>
        </div>
      </div>

      {/* Unplayed Boss Cards (Aces & Kings) Tracker */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider block font-mono">
          Boss Cards Tracker (Aces & Kings)
        </span>
        <div className="grid grid-cols-4 gap-2">
          {suits.map((suit) => {
            const aceUnplayed = tracker.unplayedAces[suit];
            const kingUnplayed = tracker.unplayedKings[suit];
            return (
              <div
                key={suit}
                className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-2 flex flex-col items-center gap-1 text-center"
              >
                <span className="text-xs font-bold text-[#E0E0E0]">
                  {SUIT_SYMBOLS[suit]} {suit.slice(0, 3).toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold ${
                      aceUnplayed ? 'bg-[#1F1B12] text-[#D4AF37] border border-[#D4AF37]/50' : 'text-[#444444] line-through'
                    }`}
                  >
                    A
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold ${
                      kingUnplayed ? 'bg-[#222222] text-white border border-[#444444]' : 'text-[#444444] line-through'
                    }`}
                  >
                    K
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Known Void Matrix */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider block font-mono">
          Inferred Player Suit Voids
        </span>
        <div className="rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] overflow-hidden text-xs">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[10px] text-[#888888] bg-[#161616]">
                <th className="py-1.5 px-2 text-left">Player</th>
                <th className="py-1.5 px-1">♠ Spd</th>
                <th className="py-1.5 px-1">♥ Hrt</th>
                <th className="py-1.5 px-1">♦ Dia</th>
                <th className="py-1.5 px-1">♣ Clb</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222] font-mono text-[11px]">
              {positions.map((pos) => {
                const player = gameState.players[pos];
                const voids = tracker.playerKnownVoids[pos];
                return (
                  <tr key={pos} className="hover:bg-[#1A1A1A]">
                    <td className="py-1.5 px-2 text-left font-medium text-[#E0E0E0] flex items-center gap-1.5">
                      <span>{player.avatar}</span>
                      <span className="truncate max-w-[80px]">{player.name}</span>
                    </td>
                    {suits.map((suit) => (
                      <td key={suit} className="py-1.5 px-1">
                        {voids[suit] ? (
                          <span className="text-rose-400 font-bold text-[10px] bg-[#2A0F14] px-1.5 py-0.5 rounded border border-rose-900/40">
                            VOID
                          </span>
                        ) : (
                          <span className="text-[#444444]">--</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Reasoning Telemetry */}
      {gameState.aiExplanation && (
        <div className="bg-[#111111] border border-[#D4AF37]/30 rounded-xl p-3 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">Latest Bot Logic ({gameState.players[gameState.aiExplanation.position].name}):</span>
          </div>
          <p className="text-[#CCCCCC] leading-relaxed font-sans text-xs">
            "{gameState.aiExplanation.reasoning}"
          </p>
          {gameState.aiExplanation.metrics?.evaluatedCandidates && (
            <div className="pt-1.5 flex flex-wrap gap-1">
              <span className="text-[10px] text-[#888888] font-mono">Scores:</span>
              {gameState.aiExplanation.metrics.evaluatedCandidates.slice(0, 4).map((c: any, i: number) => (
                <span key={i} className="text-[10px] font-mono bg-[#161616] px-1.5 py-0.5 rounded text-[#E0E0E0] border border-[#2A2A2A]">
                  {c.card}: {c.score}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
