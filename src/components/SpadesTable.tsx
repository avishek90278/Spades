import React, { useState, useEffect } from 'react';
import { Card, CompletedTrick, Position, SpadesGameState } from '../types/spades';
import { CardView } from './CardView';
import { PlayerAvatar } from './PlayerAvatar';
import { motion, AnimatePresence } from 'motion/react';
import { isMoveLegal } from '../engine/rules';
import { useDeviceScale } from '../hooks/useDeviceScale';
import { VIPSpadesTableWatermark } from './CardArtwork';
import { PreviousTrickHUD } from './PreviousTrickHUD';
import { SpadesBrokenBanner } from './SpadesBrokenBanner';
import {
  RotateCcw,
  BookOpen,
  Settings,
  Rocket,
  AlertCircle,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface SpadesTableProps {
  gameState: SpadesGameState;
  myPosition: Position;
  onPlayCard: (cardId: string) => void;
  onNewGame?: () => void;
  onOpenRules?: () => void;
  onOpenSettings?: () => void;
  onOpenScoreSheet?: () => void;
  onToggleBooster?: () => void;
  onSendEmoji?: (emoji: string) => void;
  chatBubbles?: Partial<Record<Position, { text: string; emoji?: string; time: number }>>;
  muted?: boolean;
  onToggleMute?: () => void;
  onReturnToLobby?: () => void;
}

export const SpadesTable: React.FC<SpadesTableProps> = ({
  gameState,
  myPosition = 'south',
  onPlayCard,
  onNewGame,
  onOpenRules,
  onOpenSettings,
  onOpenScoreSheet,
  onToggleBooster,
  onSendEmoji,
  muted,
  onToggleMute,
  onReturnToLobby,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBoosterMenu, setShowBoosterMenu] = useState<boolean>(false);
  const [showSpadesBrokenCallout, setShowSpadesBrokenCallout] = useState<boolean>(false);
  const [isDealingAnimation, setIsDealingAnimation] = useState<boolean>(false);

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
    scores,
    completedTricks,
  } = gameState;

  const myHand = hands[myPosition] || [];
  const isMyTurn = turn === myPosition && phase === 'playing';

  // Responsive device scale hook
  const { containerRef, cardConfig } = useDeviceScale(myHand.length);

  // Trigger Spades Broken Callout when spadesBroken becomes true
  useEffect(() => {
    if (spadesBroken) {
      setShowSpadesBrokenCallout(true);
      const timer = setTimeout(() => setShowSpadesBrokenCallout(false), 2400);
      return () => clearTimeout(timer);
    }
  }, [spadesBroken]);

  // Initial Deal Animation on round change
  useEffect(() => {
    if (phase === 'bidding' && gameState.roundNumber > 0 && Object.keys(bids).length === 0) {
      setIsDealingAnimation(true);
      const timer = setTimeout(() => setIsDealingAnimation(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [gameState.roundNumber, phase]);

  // Calculate remaining spades count
  const allPlayedCards: Card[] = [
    ...completedTricks.flatMap((t) => t.cards.map((c) => c.card)),
    ...currentTrick.cards.map((c) => c.card),
  ];
  const playedSpadesCount = allPlayedCards.filter((c) => c.suit === 'spades').length;
  const remainingSpades = Math.max(0, 13 - playedSpadesCount);

  // Last completed trick for top-right mini HUD
  const lastCompletedTrick: CompletedTrick | undefined =
    completedTricks.length > 0 ? completedTricks[completedTricks.length - 1] : undefined;

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
    setSelectedCardId(null);
    onPlayCard(card.id);
  };

  // Helper for trick cards at seat
  const getPlayedCardAtSeat = (pos: Position) => {
    return currentTrick.cards.find((c) => c.position === pos);
  };

  // Player helper details
  const getPlayer = (pos: Position) => players[pos];
  const getTricksText = (pos: Position) => {
    const won = tricksWon[pos] || 0;
    const bidInfo = bids[pos];
    if (!bidInfo) return '-/-';
    const bidStr = bidInfo.bid === 'nil' ? '0' : bidInfo.bid === 'blind_nil' ? '0' : `${bidInfo.bid}`;
    return `${won}/${bidStr}`;
  };

  // South hand fan transformation
  const totalCards = myHand.length;
  const getFanTransform = (index: number) => {
    if (totalCards <= 1) return { rotate: 0, translateY: 0 };
    const middleIndex = (totalCards - 1) / 2;
    const offsetFromMiddle = index - middleIndex;

    const angleStep = cardConfig.maxAngle / Math.max(1, middleIndex);
    const rotate = offsetFromMiddle * angleStep;
    const translateY = Math.abs(offsetFromMiddle) * (cardConfig.arcFactor * 0.8);

    return { rotate, translateY };
  };

  // Target coordinates for trick collection animation when trick is won
  const getSeatTrickCollectorOffset = (winnerPos?: Position) => {
    switch (winnerPos) {
      case 'north':
        return { x: 0, y: -220, opacity: 0, scale: 0.4 };
      case 'west':
        return { x: -220, y: 0, opacity: 0, scale: 0.4 };
      case 'east':
        return { x: 220, y: 0, opacity: 0, scale: 0.4 };
      case 'south':
        return { x: 0, y: 220, opacity: 0, scale: 0.4 };
      default:
        return { x: 0, y: 0, opacity: 1, scale: 1 };
    }
  };

  const isTrickCollecting = phase === 'trick_won';
  const trickWinnerPos = currentTrick.winner;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full max-h-full max-w-5xl mx-auto bg-gradient-to-b from-[#051f30] via-[#0b4869] to-[#041a29] p-1.5 sm:p-2.5 flex flex-col justify-between overflow-hidden select-none font-sans shadow-2xl"
    >
      {/* 1. Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#14638a_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

      {/* 2. Authentic VIP SPADES Watermark in Center (Frame 00:01 - 00:59) */}
      <VIPSpadesTableWatermark />

      {/* 3. Golden "Spades Broken" Callout Animation (Frame 00:40 - 00:43) */}
      <SpadesBrokenBanner show={showSpadesBrokenCallout} />

      {/* 4. TOP ACTION BAR: 3 Cream Gradient Buttons (NEW GAME, RULES, SETTINGS) */}
      <div className="relative z-20 flex items-center justify-between gap-1.5 sm:gap-3 w-full shrink-0 h-8 sm:h-10">
        {/* NEW GAME button */}
        <button
          id="top-new-game-btn"
          type="button"
          onClick={onNewGame}
          className="flex-1 h-full px-2 bg-gradient-to-b from-[#E7EBE4] via-[#DCE1D8] to-[#CDD3C8] hover:from-white hover:to-[#D8DDD4] active:scale-98 border border-[#A8B0A2] rounded-lg sm:rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center gap-1.5 cursor-pointer transition-all text-[#3F4B44]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#3F4B44] shrink-0" />
          <span className="font-extrabold text-[10px] sm:text-xs tracking-wider uppercase font-sans whitespace-nowrap">
            NEW GAME
          </span>
        </button>

        {/* RULES button */}
        <button
          id="top-rules-btn"
          type="button"
          onClick={onOpenRules}
          className="flex-1 h-full px-2 bg-gradient-to-b from-[#E7EBE4] via-[#DCE1D8] to-[#CDD3C8] hover:from-white hover:to-[#D8DDD4] active:scale-98 border border-[#A8B0A2] rounded-lg sm:rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center gap-1.5 cursor-pointer transition-all text-[#3F4B44]"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#3F4B44] shrink-0" />
          <span className="font-extrabold text-[10px] sm:text-xs tracking-wider uppercase font-sans whitespace-nowrap">
            RULES
          </span>
        </button>

        {/* SETTINGS button */}
        <button
          id="top-settings-btn"
          type="button"
          onClick={onOpenSettings}
          className="flex-1 h-full px-2 bg-gradient-to-b from-[#E7EBE4] via-[#DCE1D8] to-[#CDD3C8] hover:from-white hover:to-[#D8DDD4] active:scale-98 border border-[#A8B0A2] rounded-lg sm:rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.3)] flex items-center justify-center gap-1.5 cursor-pointer transition-all text-[#3F4B44]"
        >
          <Settings className="w-3.5 h-3.5 text-[#3F4B44] shrink-0" />
          <span className="font-extrabold text-[10px] sm:text-xs tracking-wider uppercase font-sans whitespace-nowrap">
            SETTINGS
          </span>
        </button>
      </div>

      {/* 5. TOP ROW: Score Box (Left) + North Partner (Center) + Previous Trick Mini HUD (Right) */}
      <div className="relative z-10 flex items-center justify-between mt-1 shrink-0 h-14 sm:h-16 px-1">
        {/* US / THEM Score Box */}
        <button
          type="button"
          id="top-score-box-btn"
          onClick={onOpenScoreSheet}
          className="bg-[#072435]/90 hover:bg-[#092e44] backdrop-blur-sm border border-[#144b6d] rounded-xl px-2.5 py-1.5 shadow-md min-w-[95px] sm:min-w-[120px] font-mono text-left cursor-pointer transition-all"
          title="Click to view detailed Score Sheet"
        >
          <div className="flex items-center justify-between text-[11px] sm:text-xs gap-2 leading-tight">
            <span className="font-bold text-[#38BDF8]">US</span>
            <span className="font-extrabold text-white">{scores.team_north_south.totalScore}</span>
            <span className="text-[#38BDF8] flex items-center text-[10px]">
              {scores.team_north_south.bags} 👤
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] sm:text-xs gap-2 leading-tight mt-1">
            <span className="font-bold text-[#FB7185]">THEM</span>
            <span className="font-extrabold text-white">{scores.team_east_west.totalScore}</span>
            <span className="text-[#FB7185] flex items-center text-[10px]">
              {scores.team_east_west.bags} 👤
            </span>
          </div>
        </button>

        {/* North Seat (Ashley - Partner) */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative">
            <PlayerAvatar
              position="north"
              name={getPlayer('north').name}
              isBot={getPlayer('north').type === 'bot'}
              isTurn={turn === 'north' && phase === 'playing'}
              size="md"
            />
            {dealer === 'north' && (
              <span className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white text-[9px] font-extrabold w-4 h-4 rounded-full border border-white shadow flex items-center justify-center">
                D
              </span>
            )}
          </div>

          {/* Blue Pill Badge for Ashley */}
          <div className="bg-[#0284C7] text-white rounded-lg sm:rounded-xl px-2 py-0.5 shadow flex flex-col items-center leading-tight min-w-[65px]">
            <span className="text-[10px] sm:text-xs font-bold font-sans">
              {getPlayer('north').name}
            </span>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold">
              <span>🃏</span>
              <span>{getTricksText('north')}</span>
            </div>
          </div>
        </div>

        {/* Top-Right Previous Trick Mini HUD (Frames 00:18, 00:23, 00:28...) */}
        <div className="min-w-[70px] flex justify-end">
          <PreviousTrickHUD lastTrick={lastCompletedTrick} onClick={onOpenScoreSheet} />
        </div>
      </div>

      {/* ERROR TOAST */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2A0F14]/95 border border-rose-500 text-rose-200 px-3 py-1 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2 max-w-[90%]"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. MIDDLE FELT ROW: West (Left), Center Trick Felt (Middle), East (Right) */}
      <div className="relative z-10 flex items-center justify-between flex-1 min-h-0 py-0.5 px-0.5 my-auto">
        {/* West Seat (Isabella) */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 z-10">
          <div className="relative">
            <PlayerAvatar
              position="west"
              name={getPlayer('west').name}
              isBot={getPlayer('west').type === 'bot'}
              isTurn={turn === 'west' && phase === 'playing'}
              size="md"
            />
            {dealer === 'west' && (
              <span className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white text-[9px] font-extrabold w-4 h-4 rounded-full border border-white shadow flex items-center justify-center">
                D
              </span>
            )}
          </div>

          {/* Red Pill Badge for Isabella */}
          <div className="bg-[#E11D48] text-white rounded-lg sm:rounded-xl px-2 py-0.5 shadow flex flex-col items-center leading-tight min-w-[65px]">
            <span className="text-[10px] sm:text-xs font-bold font-sans">
              {getPlayer('west').name}
            </span>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold">
              <span>🃏</span>
              <span>{getTricksText('west')}</span>
            </div>
          </div>
        </div>

        {/* CENTER TRICK FELT: 4-Card Diamond Compass Layout */}
        <div
          className="relative flex items-center justify-center mx-auto shrink-0 overflow-visible"
          style={{
            width: `${Math.max(190, cardConfig.trickCardWidth * 2.8)}px`,
            height: `${Math.max(140, cardConfig.trickCardHeight * 1.9)}px`,
          }}
        >
          {/* North played card (Top Center) */}
          {getPlayedCardAtSeat('north') && (
            <motion.div
              initial={{ scale: 0.7, y: -25, opacity: 0 }}
              animate={
                isTrickCollecting
                  ? getSeatTrickCollectorOffset(trickWinnerPos)
                  : { scale: 1, y: 0, opacity: 1 }
              }
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                position: 'absolute',
                top: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
              }}
              className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            >
              <CardView
                card={getPlayedCardAtSeat('north')?.card}
                size="trick"
                isPlayable={false}
                rotation={-2}
                customWidth={cardConfig.trickCardWidth}
                customHeight={cardConfig.trickCardHeight}
              />
            </motion.div>
          )}

          {/* West played card (Left Center) */}
          {getPlayedCardAtSeat('west') && (
            <motion.div
              initial={{ scale: 0.7, x: -25, opacity: 0 }}
              animate={
                isTrickCollecting
                  ? getSeatTrickCollectorOffset(trickWinnerPos)
                  : { scale: 1, x: 0, opacity: 1 }
              }
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                position: 'absolute',
                left: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
              }}
              className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
            >
              <CardView
                card={getPlayedCardAtSeat('west')?.card}
                size="trick"
                isPlayable={false}
                rotation={-6}
                customWidth={cardConfig.trickCardWidth}
                customHeight={cardConfig.trickCardHeight}
              />
            </motion.div>
          )}

          {/* East played card (Right Center) */}
          {getPlayedCardAtSeat('east') && (
            <motion.div
              initial={{ scale: 0.7, x: 25, opacity: 0 }}
              animate={
                isTrickCollecting
                  ? getSeatTrickCollectorOffset(trickWinnerPos)
                  : { scale: 1, x: 0, opacity: 1 }
              }
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                position: 'absolute',
                right: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
              }}
              className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
            >
              <CardView
                card={getPlayedCardAtSeat('east')?.card}
                size="trick"
                isPlayable={false}
                rotation={6}
                customWidth={cardConfig.trickCardWidth}
                customHeight={cardConfig.trickCardHeight}
              />
            </motion.div>
          )}

          {/* South played card (Bottom Center) */}
          {getPlayedCardAtSeat('south') && (
            <motion.div
              initial={{ scale: 0.7, y: 25, opacity: 0 }}
              animate={
                isTrickCollecting
                  ? getSeatTrickCollectorOffset(trickWinnerPos)
                  : { scale: 1, y: 0, opacity: 1 }
              }
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              style={{
                position: 'absolute',
                bottom: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 30,
              }}
              className="filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]"
            >
              <CardView
                card={getPlayedCardAtSeat('south')?.card}
                size="trick"
                isPlayable={false}
                rotation={2}
                customWidth={cardConfig.trickCardWidth}
                customHeight={cardConfig.trickCardHeight}
              />
            </motion.div>
          )}

          {/* Turn Prompt if no cards played */}
          {currentTrick.cards.length === 0 && !isDealingAnimation && (
            <div className="text-center text-white/45 text-[11px] sm:text-xs font-mono font-bold tracking-wide px-2">
              {turn === myPosition ? '🎯 Your Turn to Lead' : `Waiting for ${players[turn]?.name}...`}
            </div>
          )}
        </div>

        {/* East Seat (Tyler) */}
        <div className="flex flex-col items-center gap-0.5 shrink-0 z-10">
          <div className="relative">
            <PlayerAvatar
              position="east"
              name={getPlayer('east').name}
              isBot={getPlayer('east').type === 'bot'}
              isTurn={turn === 'east' && phase === 'playing'}
              size="md"
            />
            {dealer === 'east' && (
              <span className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white text-[9px] font-extrabold w-4 h-4 rounded-full border border-white shadow flex items-center justify-center">
                D
              </span>
            )}
          </div>

          {/* Red Pill Badge for Tyler */}
          <div className="bg-[#E11D48] text-white rounded-lg sm:rounded-xl px-2 py-0.5 shadow flex flex-col items-center leading-tight min-w-[65px]">
            <span className="text-[10px] sm:text-xs font-bold font-sans">
              {getPlayer('east').name}
            </span>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold">
              <span>🃏</span>
              <span>{getTricksText('east')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. LOWER ROW: Boosters & Me (Bottom-Left) + Game Info Box (Bottom-Right) */}
      <div className="relative z-20 flex items-center justify-between px-1 shrink-0 h-12 sm:h-14 mb-0.5">
        {/* Bottom Left: BOOSTERS button + Green Spade Emblem & Me Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* BOOSTERS Button */}
          <div className="relative">
            <button
              id="boosters-btn"
              type="button"
              onClick={() => setShowBoosterMenu(!showBoosterMenu)}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] active:scale-95 border border-[#FEF08A] rounded-xl shadow-lg flex flex-col items-center justify-center cursor-pointer transition-all text-[#451A03]"
            >
              <Rocket className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#451A03] text-[#451A03]" />
              <span className="font-extrabold text-[7px] sm:text-[8px] tracking-wider uppercase font-sans">
                BOOST
              </span>
            </button>

            {/* Booster Menu Popup */}
            <AnimatePresence>
              {showBoosterMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-14 left-0 z-50 bg-[#0A2E44] border border-[#1C6086] rounded-xl p-2.5 shadow-2xl w-48 space-y-1.5 text-xs text-white"
                >
                  <div className="text-[10px] font-mono font-bold text-[#FBBF24] uppercase tracking-wider">
                    Tools & Reactions
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleBooster?.();
                      setShowBoosterMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-1.5 rounded-lg bg-[#11405E] hover:bg-[#1A547A] text-left cursor-pointer text-xs"
                  >
                    <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                    <span>Card Counter HUD</span>
                  </button>
                  {onToggleMute && (
                    <button
                      type="button"
                      onClick={onToggleMute}
                      className="w-full flex items-center gap-2 p-1.5 rounded-lg bg-[#11405E] hover:bg-[#1A547A] text-left cursor-pointer text-xs"
                    >
                      {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      <span>{muted ? 'Unmute Audio' : 'Mute Audio'}</span>
                    </button>
                  )}
                  {onReturnToLobby && (
                    <button
                      type="button"
                      onClick={() => {
                        onReturnToLobby();
                        setShowBoosterMenu(false);
                      }}
                      className="w-full flex items-center gap-2 p-1.5 rounded-lg bg-[#11405E] hover:bg-[#1A547A] text-left cursor-pointer text-xs"
                    >
                      <RotateCcw className="w-4 h-4 text-[#38BDF8]" />
                      <span>Return to Lobby</span>
                    </button>
                  )}
                  {onSendEmoji && (
                    <div className="pt-1.5 border-t border-[#1C6086]/50">
                      <div className="flex gap-1 justify-between">
                        {['♠️', '🔥', '👏', '🎯', '👑'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              onSendEmoji(emoji);
                              setShowBoosterMenu(false);
                            }}
                            className="p-1 rounded bg-[#072436] hover:bg-[#145377] text-base cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Green Spade Emblem (Matching bottom left frame 00:02 - 00:59) */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#16A34A] shadow flex items-center justify-center p-1">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-[#16A34A]" aria-label="Spade Emblem">
              <path d="M12 2.2C11 5.5 6 9.8 6 13.5c0 3.2 2.5 5.5 5.5 5.5.5 0 .9-.1 1.2-.2-1 1.5-1.9 3.2-1.7 4.2h2c0-1.5 1.5-3.3 2-4 .5.7 2 2.5 2 4h2c.2-1-.7-2.7-1.7-4.2.3.1.7.2 1.2.2 3 0 5.5-2.3 5.5-5.5C22 9.8 17 5.5 16 2.2c-.7 1.5-1.9 3.8-4 3.8-2.1 0-3.3-2.3-4-3.8H12z" />
            </svg>
            {dealer === 'south' && (
              <span className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white text-[9px] font-extrabold w-4 h-4 rounded-full border border-white shadow flex items-center justify-center">
                D
              </span>
            )}
          </div>

          {/* Blue Pill Badge for Me */}
          <div className="bg-[#0284C7] text-white rounded-lg sm:rounded-xl px-2.5 py-0.5 shadow flex flex-col items-center leading-tight min-w-[65px]">
            <span className="text-[10px] sm:text-xs font-bold font-sans">Me</span>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold">
              <span>🃏</span>
              <span>{getTricksText('south')}</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Green Neon Stats Box (Matching Frames 00:02 - 00:59) */}
        <div className="bg-[#072435]/90 backdrop-blur-sm border border-[#144b6d] rounded-xl px-2.5 py-1.5 shadow min-w-[100px] sm:min-w-[125px] font-mono text-[9px] sm:text-[11px] leading-tight text-[#4ADE80]">
          <div className="flex justify-between gap-1.5">
            <span>Pairs</span>
            <span className="font-bold">{gameState.settings.targetScore}</span>
          </div>
          <div className="flex justify-between gap-1.5">
            <span>Round</span>
            <span className="font-bold">{gameState.roundNumber}/-</span>
          </div>
          <div className="flex justify-between gap-1.5">
            <span>10 Bags</span>
            <span className="font-bold">-100</span>
          </div>
          <div className="flex justify-between gap-1.5 pt-0.5 border-t border-[#144b6d]/60">
            <span>Number of ♠</span>
            <span className="font-extrabold text-[#22C55E]">{remainingSpades}/13</span>
          </div>
        </div>
      </div>

      {/* 8. BOTTOM FAN: Player's Interactive Hand (Smooth Playable vs Dimmed Contrast) */}
      <div
        className="relative z-30 w-full flex justify-center items-end shrink-0 overflow-visible pb-0.5"
        style={{ height: `${cardConfig.cardHeight + 14}px` }}
      >
        <div
          className="relative flex items-end justify-start mx-auto overflow-visible"
          style={{
            width: `${cardConfig.totalFanWidth}px`,
            height: `${cardConfig.cardHeight}px`,
          }}
        >
          {myHand.map((card, index) => {
            const isLegal = isMoveLegal(card, myHand, currentTrick, spadesBroken).legal;
            const { rotate, translateY } = getFanTransform(index);
            const isSelected = selectedCardId === card.id;
            const leftOffset = index * cardConfig.stepOffset;
            const isLastCard = index === myHand.length - 1;

            const isPlayable = isMyTurn && isLegal;
            const targetY = isSelected
              ? -22
              : isMyTurn
              ? isPlayable
                ? translateY - 10
                : translateY + 3
              : translateY;

            return (
              <motion.div
                key={card.id}
                style={{
                  position: 'absolute',
                  left: `${leftOffset}px`,
                  bottom: 0,
                  width: `${cardConfig.cardWidth}px`,
                  height: `${cardConfig.cardHeight}px`,
                  transformOrigin: 'bottom center',
                  zIndex: isSelected ? 40 : isPlayable ? index + 10 : index + 1,
                }}
                animate={{
                  rotate,
                  y: targetY,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="shrink-0"
              >
                <CardView
                  card={card}
                  size="fan"
                  isFaceDown={isDealingAnimation}
                  isSelected={isSelected}
                  isPlayable={isPlayable}
                  onClick={() => handleCardClick(card)}
                  customWidth={cardConfig.cardWidth}
                  customHeight={cardConfig.cardHeight}
                  customFontSize={cardConfig.fontSize}
                  customSuitSize={cardConfig.suitSize}
                  isLastCardInHand={isLastCard}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
