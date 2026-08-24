import React, { useState } from 'react';
import { BidValue, Card, GameSettings, Position } from '../types/spades';
import { CardView } from './CardView';
import { Sparkles, ShieldAlert } from 'lucide-react';

interface BiddingModalProps {
  hand: Card[];
  position: Position;
  playerName: string;
  partnerName: string;
  partnerBid?: { bid: BidValue; isBlindNil?: boolean };
  settings: GameSettings;
  onPlaceBid: (bid: BidValue, isBlindNil?: boolean) => void;
}

export const BiddingModal: React.FC<BiddingModalProps> = ({
  hand,
  position,
  playerName,
  partnerName,
  partnerBid,
  settings,
  onPlaceBid,
}) => {
  const [selectedBid, setSelectedBid] = useState<BidValue>(3);
  const [isBlindNilSelected, setIsBlindNilSelected] = useState<boolean>(false);

  // Quick hand evaluation for advisory
  const spades = hand.filter((c) => c.suit === 'spades');
  const aces = hand.filter((c) => c.rank === 'A');
  const kings = hand.filter((c) => c.rank === 'K');

  let suggestedBid = aces.length;
  if (spades.length > 3) suggestedBid += spades.length - 3;
  if (kings.length > 0) suggestedBid += Math.round(kings.length * 0.7);
  suggestedBid = Math.max(1, Math.min(8, suggestedBid));

  const isNilSafe = aces.length === 0 && kings.length === 0 && spades.every((c) => c.value <= 9);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="bidding-modal-dialog"
        className="w-full max-w-xl bg-[#161616] border border-[#2A2A2A] rounded-2xl p-6 shadow-2xl text-[#E0E0E0] flex flex-col gap-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] font-semibold">
              Bidding Phase • Round Active
            </span>
            <h2 className="text-xl font-serif italic font-bold text-white flex items-center gap-2">
              <span>Your Turn to Bid, {playerName}</span>
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#888888]">Partner ({partnerName}):</span>
            <p className="text-sm font-semibold text-[#D4AF37] font-mono">
              {partnerBid
                ? partnerBid.bid === 'nil'
                  ? 'NIL (0)'
                  : partnerBid.bid === 'blind_nil'
                  ? 'BLIND NIL'
                  : `${partnerBid.bid} Books`
                : 'Not bid yet'}
            </p>
          </div>
        </div>

        {/* AI Hand Advisory */}
        <div className="bg-[#111111] border border-[#D4AF37]/30 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 bg-[#1F1B12] text-[#D4AF37] rounded-lg shrink-0 mt-0.5 border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1 text-[#CCCCCC]">
            <div className="font-semibold text-white flex items-center gap-2">
              <span>AI Hand Advisor:</span>
              <span className="bg-[#222222] text-[#D4AF37] px-2 py-0.5 rounded font-mono text-[11px] border border-[#333333]">
                Recommended Bid: {suggestedBid}
              </span>
            </div>
            <p>
              Holding {spades.length} Spades (Trumps), {aces.length} Aces, and {kings.length} Kings.
              {isNilSafe
                ? ' Your hand has low rank cards and no Aces—Nil could be lucrative!'
                : ' Aces and high trumps make taking books very reliable.'}
            </p>
          </div>
        </div>

        {/* Hand Preview (compact) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs uppercase tracking-wider font-mono text-[#888888]">Your Dealt Hand (13 Cards):</span>
            <span className="text-[11px] text-[#888888] font-mono">
              ♠ {spades.length} | ♥ {hand.filter((c) => c.suit === 'hearts').length} | ♦ {hand.filter((c) => c.suit === 'diamonds').length} | ♣ {hand.filter((c) => c.suit === 'clubs').length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 bg-[#0E0E0E] p-2.5 rounded-xl border border-[#2A2A2A] justify-center">
            {hand.map((card) => (
              <div key={card.id} className="scale-75 origin-top -mx-2.5 hover:z-10 transition-transform">
                <CardView card={card} size="sm" isPlayable={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Bid Selection Buttons */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-mono text-[#888888] block">
            Select Your Target Books (Tricks):
          </label>
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
              <button
                key={num}
                id={`bid-btn-${num}`}
                type="button"
                onClick={() => {
                  setSelectedBid(num);
                  setIsBlindNilSelected(false);
                }}
                className={`py-2 text-sm font-bold font-mono rounded-lg transition-all border ${
                  selectedBid === num && !isBlindNilSelected
                    ? 'bg-[#D4AF37] border-[#F2D06B] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105'
                    : 'bg-[#222222] border-[#333333] hover:bg-[#2A2A2A] hover:border-[#444444] text-[#E0E0E0]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Nil & Blind Nil Special Options */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            id="bid-btn-nil"
            type="button"
            onClick={() => {
              setSelectedBid('nil');
              setIsBlindNilSelected(false);
            }}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
              selectedBid === 'nil' && !isBlindNilSelected
                ? 'bg-[#1F1B12] border-[#D4AF37] ring-1 ring-[#D4AF37] text-white shadow-lg'
                : 'bg-[#111111] border-[#2A2A2A] hover:bg-[#1A1A1A] text-[#CCCCCC]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#D4AF37]">NIL BID (0 Tricks)</span>
              <span className="text-[10px] font-mono bg-[#222222] text-[#D4AF37] px-2 py-0.5 rounded border border-[#333333]">
                +{settings.nilBonus} / -{settings.nilBonus} pts
              </span>
            </div>
            <span className="text-[11px] text-[#888888] leading-tight">
              You must win ZERO tricks. High reward, but 1 trick taken fails.
            </span>
          </button>

          {settings.allowBlindNil && (
            <button
              id="bid-btn-blind-nil"
              type="button"
              onClick={() => {
                setSelectedBid('blind_nil');
                setIsBlindNilSelected(true);
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                isBlindNilSelected
                  ? 'bg-[#2A0F14] border-rose-500 ring-1 ring-rose-400 text-white shadow-lg'
                  : 'bg-[#111111] border-[#2A2A2A] hover:bg-[#1A1A1A] text-[#CCCCCC]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-rose-300 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> BLIND NIL
                </span>
                <span className="text-[10px] font-mono bg-[#222222] text-rose-300 px-2 py-0.5 rounded border border-[#333333]">
                  +{settings.blindNilBonus} / -{settings.blindNilBonus} pts
                </span>
              </div>
              <span className="text-[11px] text-[#888888] leading-tight">
                Extreme gamble: Win zero tricks for doubled point swings!
              </span>
            </button>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            id="confirm-bid-btn"
            type="button"
            onClick={() => onPlaceBid(selectedBid, isBlindNilSelected)}
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#C69214] text-black font-extrabold rounded-xl shadow-xl transition-all active:scale-[0.99] text-base cursor-pointer uppercase tracking-wider"
          >
            Confirm Bid: {selectedBid === 'nil' ? 'NIL (0)' : selectedBid === 'blind_nil' ? 'BLIND NIL' : `${selectedBid} Books`}
          </button>
        </div>
      </div>
    </div>
  );
};
