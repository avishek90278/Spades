import React from 'react';
import { X, BookOpen, CheckCircle, ShieldAlert, Award } from 'lucide-react';

interface RulesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-gradient-to-b from-[#09293B] to-[#061D2B] border-2 border-[#165173] rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#165173] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-lg font-black text-white tracking-wide">
              Official Spades Tournament Rules
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#0E3E5C] text-[#BAE6FD] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Overview & Teams */}
        <div className="space-y-1.5 bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
          <h3 className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#4ADE80]" /> 1. Game Setup & Partnerships
          </h3>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Spades is a 4-player trick-taking card game played with a standard 52-card deck. Players sitting opposite each other are fixed partners (North & South vs East & West). All 52 cards are dealt (13 cards per player).
          </p>
        </div>

        {/* Section 2: Strict Trick Rules */}
        <div className="space-y-1.5 bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
          <h3 className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#4ADE80]" /> 2. Strict Trick-Taking Rules & Spades Broken
          </h3>
          <ul className="text-xs text-[#CBD5E1] space-y-1.5 list-disc list-inside leading-relaxed">
            <li><strong>Following Suit:</strong> You MUST follow the led suit if you have cards of that suit in hand.</li>
            <li><strong>Void in Suit:</strong> If you have no cards of the led suit, you may play ANY card—including Spades (trump) or discard off-suit.</li>
            <li><strong>Breaking Spades:</strong> A player cannot lead a Spade until Spades have been "broken" (played on a previous trick where a player couldn't follow suit), OR unless the player only holds Spades in hand.</li>
            <li><strong>Trick Winner:</strong> Highest Spade wins the trick; if no Spade was played, highest card of the led suit wins. Ace is high, 2 is low.</li>
          </ul>
        </div>

        {/* Section 3: Bidding, Nil, & Blind Nil */}
        <div className="space-y-1.5 bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
          <h3 className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#FBBF24]" /> 3. Bidding, Nil & Blind Nil
          </h3>
          <ul className="text-xs text-[#CBD5E1] space-y-1.5 list-disc list-inside leading-relaxed">
            <li><strong>Contract Bidding:</strong> Each player bids the number of tricks (books) they expect to win. Partner bids are summed into a combined Team Contract.</li>
            <li><strong>Standard Scoring:</strong> Making the bid awards 10 points per bid book + 1 point per extra trick (bag). Failing to make the combined bid subtracts 10 points per bid book.</li>
            <li><strong>Nil (0 Tricks):</strong> A player who bids Nil must take 0 tricks. Success earns <strong>+100 points</strong>; taking even 1 trick results in a <strong>-100 points</strong> penalty.</li>
            <li><strong>Blind Nil:</strong> High stakes Nil bid with <strong>+200 / -200 points</strong>.</li>
          </ul>
        </div>

        {/* Section 4: Sandbag Penalty */}
        <div className="space-y-1.5 bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
          <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> 4. Bags & The -100 Sandbag Penalty
          </h3>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Extra tricks taken over the contract are called "Bags" (Overtricks). Bags accumulate across rounds. When a team accumulates <strong>10 bags</strong>, a <strong>-100 point sandbag penalty</strong> is automatically deducted from their score, and the 10 bags reset.
          </p>
        </div>

        {/* Section 5: Winning the Game */}
        <div className="space-y-1.5 bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
          <h3 className="text-xs font-bold text-[#4ADE80] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#4ADE80]" /> 5. Victory Condition
          </h3>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            The first team to reach <strong>500 points</strong> (or configured target score) wins the game! If both teams reach 500 in the same round, the team with the higher score wins.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-b from-[#EFEFE8] via-[#E4E4DC] to-[#D5D5CB] hover:from-white hover:to-[#DFDFD6] text-[#3D3D38] font-black rounded-2xl border border-[#B0B0A2] text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
};
