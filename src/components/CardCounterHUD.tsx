import React from 'react';
import { CardTrackerState, Position, SpadesGameState, Suit } from '../types/spades';
import { Activity, Cpu, Zap, Lock, Check } from 'lucide-react';
import { SUIT_SYMBOLS } from '../engine/deck';
import { SuitIcon } from './CardView';

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
    <div id="card-counter-hud" className="bg-gradient-to-b from-[#09293B] to-[#061D2B] border-2 border-[#165173] rounded-3xl p-3.5 sm:p-4 text-white shadow-2xl space-y-3.5 sm:space-y-4 backdrop-blur-md select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#165173] pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FBBF24]" />
          <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
            Card Counter & AI Analytics
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-[#061D2B] text-[#4ADE80] border border-[#165173] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
          <Zap className="w-3 h-3 text-[#4ADE80]" /> Active
        </span>
      </div>

      {/* Spades & Trump Status */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-2.5 sm:p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#7DD3FC] font-mono font-bold block">
            Remaining Spades
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-[#4ADE80] font-mono">{tracker.remainingSpades}</span>
            <span className="text-[11px] text-[#94A3B8] font-mono">/ 13 total</span>
          </div>
          <div className="w-full bg-[#061D2B] h-1.5 rounded-full mt-2 overflow-hidden border border-[#165173]">
            <div
              className="bg-[#4ADE80] h-full transition-all duration-300"
              style={{ width: `${(tracker.remainingSpades / 13) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#7DD3FC] font-mono font-bold block">
            Spades Lead Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-xl uppercase font-mono flex items-center gap-1 ${
                gameState.spadesBroken
                  ? 'bg-[#061D2B] text-[#4ADE80] border border-[#165173]'
                  : 'bg-[#061D2B] text-[#94A3B8] border border-[#165173]'
              }`}
            >
              {gameState.spadesBroken ? (
                <>
                  <Check className="w-3 h-3 text-[#4ADE80]" />
                  <span>Broken</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-[#94A3B8]" />
                  <span>Locked</span>
                </>
              )}
            </span>
          </div>
          <span className="text-[10px] text-[#94A3B8] mt-1 truncate">
            {gameState.spadesBroken ? 'Lead legal' : 'Cannot lead spades yet'}
          </span>
        </div>
      </div>

      {/* Suit Counts Table */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7DD3FC] font-bold block">
          Played Cards by Suit:
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {suits.map((suit) => {
            const played = tracker.suitCounts[suit];
            const remaining = 13 - played;
            const isSpade = suit === 'spades';
            const isRed = suit === 'hearts' || suit === 'diamonds';

            return (
              <div
                key={suit}
                className="bg-[#0B3147] border border-[#165173] rounded-xl p-2 text-center"
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <SuitIcon suit={suit} className="w-3.5 h-3.5" />
                  <span
                    className={`text-xs font-mono font-bold uppercase ${
                      isSpade
                        ? 'text-[#4ADE80]'
                        : isRed
                        ? 'text-[#FB7185]'
                        : 'text-[#38BDF8]'
                    }`}
                  >
                    {suit.slice(0, 1)}
                  </span>
                </div>
                <div className="text-xs font-bold text-white font-mono">{remaining} left</div>
                <div className="text-[9px] text-[#94A3B8] font-mono">{played} out</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Void Detectors for All Players */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7DD3FC] font-bold block">
          Player Suit Voids:
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
          {positions.map((pos) => {
            const voids = tracker.knownVoids[pos] || [];
            const playerName = gameState.players[pos]?.name || pos;
            const isUs = pos === 'north' || pos === 'south';

            return (
              <div
                key={pos}
                className="bg-[#0B3147] border border-[#165173] rounded-xl p-2 flex items-center justify-between"
              >
                <span className={`font-bold ${isUs ? 'text-[#38BDF8]' : 'text-[#FB7185]'}`}>
                  {playerName}
                </span>
                <div className="flex gap-1">
                  {voids.length === 0 ? (
                    <span className="text-[10px] text-[#94A3B8]">None</span>
                  ) : (
                    voids.map((v) => (
                      <span
                        key={v}
                        className="text-[9px] bg-rose-950 text-rose-300 px-1 py-0.2 rounded border border-rose-800"
                        title={`Void in ${v}`}
                      >
                        {SUIT_SYMBOLS[v]}
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
