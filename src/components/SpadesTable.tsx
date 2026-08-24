import React, { useState } from 'react';
import { Card, GameSettings, Position, SpadesGameState, Suit } from '../types/spades';
import { CardView, SuitIcon } from './CardView';
import { motion, AnimatePresence } from 'motion/react';
import { isMoveLegal } from '../engine/rules';
import { AlertCircle } from 'lucide-react';

interface SpadesTableProps {
  gameState: SpadesGameState;
  myPosition: Position;
  onPlayCard: (cardId: string) => void;
  onStartRound?: () => void;
  onSendEmoji?: (emoji: string) => void;
  chatBubbles?: Partial<Record<Position, { text: string; emoji?: string; time: number }>>;
}

export const SpadesTable: React.FC<SpadesTableProps> = ({
  gameState,
  myPosition = 'south',
  onPlayCard,
  onStartRound,
  onSendEmoji,
  chatBubbles,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    phase,
    turn,
    dealer,
    players,
    hands,
    bids,
    tricksWon,
    currentTrick,
    spadesBroken,
    lastActionMessage,
  } = gameState;

  const myHand = hands[myPosition] || [];
  const isMyTurn = turn === myPosition && phase === 'playing';

  // Handle card click
  const handleCardClick = (card: Card) => {
    if (!isMyTurn) {
      setErrorMessage("It's not your turn to play!");
      setTimeout(() => setErrorMessage(null), 2500);
      return;
    }

    const validation = isMoveLegal(card, myHand, currentTrick, spadesBroken);
    if (!validation.legal) {
      setErrorMessage(validation.reason || 'Illegal move.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setErrorMessage(null);
    onPlayCard(card.id);
  };

  // Map trick cards to seat orientation
  const getPlayedCardAtSeat = (pos: Position) => {
    return currentTrick.cards.find((c) => c.position === pos);
  };

  const QUICK_EMOJIS = ['♠️', '🔥', '👏', '😱', '🤫', '👑', '😎', '💀'];

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[16/10] min-h-[580px] sm:min-h-[640px] rounded-3xl bg-[#12261A] p-4 sm:p-6 shadow-2xl border-4 border-[#1E3A28] flex flex-col justify-between overflow-hidden select-none">
      {/* Decorative Felt Border Pattern with Gold Accent */}
      <div className="absolute inset-2 sm:inset-4 rounded-2xl border border-[#D4AF37]/15 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1A3324_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {/* Top Banner / Announcement Bar (Sophisticated Dark) */}
      <div className="relative z-10 flex items-center justify-between bg-[#161616]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#2A2A2A] shadow-lg text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-semibold text-[#E0E0E0] truncate max-w-xs sm:max-w-md">
            {lastActionMessage || 'Grand Spades Elite Tournament Table'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-[#888888]">Spades:</span>
            <span
              className={`px-2 py-0.5 rounded font-bold uppercase ${
                spadesBroken
                  ? 'bg-[#1F1B12] text-[#D4AF37] border border-[#D4AF37]/50'
                  : 'bg-[#222222] text-[#888888] border border-[#333333]'
              }`}
            >
              {spadesBroken ? '♠ Broken' : 'Locked'}
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="text-[#888888]">Trick:</span>
            <span className="text-[#D4AF37] font-bold">
              {gameState.completedTricks.length + 1} / 13
            </span>
          </div>
        </div>
      </div>

      {/* Error alert toast */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-[#2A0F14] border border-rose-500/80 text-rose-200 px-4 py-2 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Seats Grid */}
      <div className="relative flex-1 flex flex-col justify-between py-2">
        {/* NORTH SEAT (Partner) */}
        <div className="flex flex-col items-center">
          <PlayerSeat
            player={players.north}
            isTurn={turn === 'north' && (phase === 'playing' || phase === 'bidding')}
            isDealer={dealer === 'north'}
            bid={bids.north}
            tricksWon={tricksWon.north}
            handCount={hands.north.length}
            chatBubble={chatBubbles?.north}
          />
        </div>

        {/* MIDDLE ROW: WEST SEAT, CENTER TRICK FELT, EAST SEAT */}
        <div className="flex items-center justify-between px-2 sm:px-6">
          {/* WEST SEAT (Opponent Left) */}
          <div className="flex flex-col items-center">
            <PlayerSeat
              player={players.west}
              isTurn={turn === 'west' && (phase === 'playing' || phase === 'bidding')}
              isDealer={dealer === 'west'}
              bid={bids.west}
              tricksWon={tricksWon.west}
              handCount={hands.west.length}
              chatBubble={chatBubbles?.west}
            />
          </div>

          {/* CENTER TRICK FELT */}
          <div
            id="center-trick-felt"
            className="relative w-64 h-52 sm:w-72 sm:h-60 rounded-2xl bg-[#0E1D14]/90 border-2 border-[#1E3A28] shadow-inner flex items-center justify-center p-2"
          >
            {/* Lead Suit Indicator */}
            {currentTrick.leadSuit && (
              <div className="absolute top-2 left-3 flex items-center gap-1 text-[11px] font-mono text-[#D4AF37] bg-[#161616]/90 px-2.5 py-0.5 rounded-md border border-[#2A2A2A]">
                <span className="text-[#888888]">Lead:</span>
                <SuitIcon suit={currentTrick.leadSuit} className="w-3.5 h-3.5" />
                <span className="capitalize text-white font-medium">{currentTrick.leadSuit}</span>
              </div>
            )}

            {/* Trick Card Positions */}
            <div className="relative w-full h-full">
              {/* North Played Card */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2">
                {getPlayedCardAtSeat('north') && (
                  <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CardView
                      card={getPlayedCardAtSeat('north')!.card}
                      size="sm"
                      isPlayable={false}
                    />
                  </motion.div>
                )}
              </div>

              {/* West Played Card */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2">
                {getPlayedCardAtSeat('west') && (
                  <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CardView
                      card={getPlayedCardAtSeat('west')!.card}
                      size="sm"
                      isPlayable={false}
                    />
                  </motion.div>
                )}
              </div>

              {/* East Played Card */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2">
                {getPlayedCardAtSeat('east') && (
                  <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CardView
                      card={getPlayedCardAtSeat('east')!.card}
                      size="sm"
                      isPlayable={false}
                    />
                  </motion.div>
                )}
              </div>

              {/* South Played Card */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                {getPlayedCardAtSeat('south') && (
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CardView
                      card={getPlayedCardAtSeat('south')!.card}
                      size="sm"
                      isPlayable={false}
                    />
                  </motion.div>
                )}
              </div>

              {/* Trick Won Celebration Banner */}
              {phase === 'trick_won' && currentTrick.winner && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]/90 rounded-xl p-2 text-center backdrop-blur-sm z-20 border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-mono font-bold">
                    Trick Taken
                  </span>
                  <p className="text-sm font-serif font-bold text-white mt-0.5">
                    {players[currentTrick.winner].name}
                  </p>
                  <span className="text-[11px] text-[#A3A3A3] mt-0.5">
                    with {currentTrick.winningCard?.rank} of {currentTrick.winningCard?.suit}
                  </span>
                </motion.div>
              )}

              {/* Empty felt prompt */}
              {currentTrick.cards.length === 0 && phase === 'playing' && (
                <div className="absolute inset-0 flex items-center justify-center text-[#2A4D35] text-xs font-mono">
                  <span>Waiting for {players[turn].name} to lead...</span>
                </div>
              )}
            </div>
          </div>

          {/* EAST SEAT (Opponent Right) */}
          <div className="flex flex-col items-center">
            <PlayerSeat
              player={players.east}
              isTurn={turn === 'east' && (phase === 'playing' || phase === 'bidding')}
              isDealer={dealer === 'east'}
              bid={bids.east}
              tricksWon={tricksWon.east}
              handCount={hands.east.length}
              chatBubble={chatBubbles?.east}
            />
          </div>
        </div>

        {/* SOUTH SEAT (You) */}
        <div className="flex flex-col items-center">
          <PlayerSeat
            player={players.south}
            isTurn={turn === 'south' && (phase === 'playing' || phase === 'bidding')}
            isDealer={dealer === 'south'}
            bid={bids.south}
            tricksWon={tricksWon.south}
            handCount={myHand.length}
            isSelf={true}
            chatBubble={chatBubbles?.south}
          />
        </div>
      </div>

      {/* BOTTOM: HUMAN PLAYER INTERACTIVE HAND (Sophisticated Dark Panel) */}
      <div className="relative z-20 mt-2 bg-[#161616]/95 backdrop-blur-md rounded-2xl p-3 border border-[#2A2A2A] shadow-2xl">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#888888]">
              Your Hand ({myHand.length} cards)
            </span>
            {isMyTurn && (
              <span className="bg-[#D4AF37] text-black font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.4)] animate-pulse">
                ★ YOUR TURN
              </span>
            )}
          </div>

          {/* Quick Reaction Emojis */}
          {onSendEmoji && (
            <div className="flex items-center gap-1">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSendEmoji(emoji)}
                  className="hover:scale-125 transition-transform text-sm px-1.5 py-0.5 rounded-md hover:bg-[#222222]"
                  title={`Send ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Card Row */}
        <div className="flex items-center justify-center -space-x-4 sm:-space-x-5 overflow-x-auto py-2.5 px-2">
          {myHand.map((card, idx) => {
            const validation = isMoveLegal(card, myHand, currentTrick, spadesBroken);
            const isPlayable = isMyTurn && validation.legal;

            return (
              <div
                key={card.id}
                className="transition-transform duration-150 hover:z-30 hover:-translate-y-2"
                style={{ zIndex: idx }}
              >
                <CardView
                  card={card}
                  size="md"
                  isPlayable={isPlayable}
                  isSelected={selectedCardId === card.id}
                  onClick={() => handleCardClick(card)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Player Seat Component (Sophisticated Dark)
interface PlayerSeatProps {
  player: {
    name: string;
    avatar: string;
    type: string;
    botDifficulty?: string;
    position: Position;
  };
  isTurn: boolean;
  isDealer: boolean;
  bid?: { bid: number | 'nil' | 'blind_nil'; isBlindNil?: boolean };
  tricksWon: number;
  handCount: number;
  isSelf?: boolean;
  chatBubble?: { text: string; emoji?: string; time: number };
}

const PlayerSeat: React.FC<PlayerSeatProps> = ({
  player,
  isTurn,
  isDealer,
  bid,
  tricksWon,
  handCount,
  isSelf = false,
  chatBubble,
}) => {
  return (
    <div className="relative flex flex-col items-center gap-1 text-center select-none">
      {/* Speech / Reaction Bubble */}
      <AnimatePresence>
        {chatBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-10 z-30 bg-[#161616] text-[#E0E0E0] text-xs px-3 py-1 rounded-xl border border-[#D4AF37]/60 shadow-xl flex items-center gap-1.5 font-sans"
          >
            {chatBubble.emoji && <span>{chatBubble.emoji}</span>}
            <span>{chatBubble.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Container with Gold Active Turn Glow */}
      <div className="relative">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all duration-300 ${
            isTurn
              ? 'bg-[#1F1B12] border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
              : 'bg-[#161616]/95 border border-[#2A2A2A]'
          }`}
        >
          <span>{player.avatar}</span>
        </div>

        {/* Dealer 'D' Badge */}
        {isDealer && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-black flex items-center justify-center shadow-md border border-[#F2D06B]">
            D
          </span>
        )}

        {/* Bot difficulty indicator */}
        {player.type === 'bot' && player.botDifficulty && (
          <span
            className="absolute -bottom-1 -left-1 text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase shadow bg-[#222222] text-[#D4AF37] border border-[#333333]"
          >
            {player.botDifficulty}
          </span>
        )}
      </div>

      {/* Name and Seat Label */}
      <div className="flex flex-col items-center leading-tight mt-0.5">
        <span className="text-xs font-semibold text-[#E0E0E0] max-w-[100px] truncate">
          {player.name}
        </span>
        <span className="text-[9px] uppercase font-mono text-[#888888] tracking-wider">
          {player.position}
        </span>
      </div>

      {/* Bid & Tricks Stats Pill */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono bg-[#111111] px-2.5 py-0.5 rounded-full border border-[#2A2A2A] shadow">
        <span className="text-[#D4AF37] font-bold">
          Bid: {bid ? (bid.bid === 'nil' ? 'NIL' : bid.bid === 'blind_nil' ? 'B-NIL' : bid.bid) : '-'}
        </span>
        <span className="text-[#444444]">•</span>
        <span className="text-[#E0E0E0] font-bold">Won: {tricksWon}</span>
      </div>
    </div>
  );
};
