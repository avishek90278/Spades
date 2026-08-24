import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BidValue,
  BotDifficulty,
  Card,
  GameSettings,
  Position,
  SpadesGameState,
  WSClientAction,
  WSServerMessage,
} from './types/spades';
import {
  advanceToNextTrick,
  createDefaultPlayers,
  createInitialGameState,
  DEFAULT_SETTINGS,
  placePlayerBid,
  playCardMove,
  startNewRound,
  restartSameDeal,
} from './engine/spadesGame';
import { calculateBotBid, selectBotCard } from './engine/botAI';
import { useSound } from './hooks/useSound';
import { Navbar } from './components/Navbar';
import { SpadesTable } from './components/SpadesTable';
import { BiddingModal } from './components/BiddingModal';
import { ScoreBoard } from './components/ScoreBoard';
import { ScoreSheetModal } from './components/ScoreSheetModal';
import { NewGameModal } from './components/NewGameModal';
import { CardCounterHUD } from './components/CardCounterHUD';
import { RoomLobby } from './components/RoomLobby';
import { RulesGuideModal } from './components/RulesGuideModal';
import { GameSettingsModal } from './components/GameSettingsModal';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { Brain, Trophy, Users, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<SpadesGameState>(() =>
    createInitialGameState('local_game', 'single_player', undefined, createDefaultPlayers('You', 'expert'))
  );

  const [myPosition, setMyPosition] = useState<Position>('south');
  const [playerName, setPlayerName] = useState<string>('Ace Player');
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(true);

  // Modals & Panels
  const [showHUD, setShowHUD] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showScoreSheet, setShowScoreSheet] = useState<boolean>(false);
  const [showNewGameModal, setShowNewGameModal] = useState<boolean>(false);

  // Matchmaking State
  const [isSearchingMatch, setIsSearchingMatch] = useState<boolean>(false);
  const [matchmakingQueueSize, setMatchmakingQueueSize] = useState<number>(0);

  // Chat/Emoji Bubbles
  const [chatBubbles, setChatBubbles] = useState<
    Record<Position, { text: string; emoji?: string; time: number }>
  >({
    north: { text: '', time: 0 },
    east: { text: '', time: 0 },
    south: { text: '', time: 0 },
    west: { text: '', time: 0 },
  });

  // Sound Engine
  const {
    muted,
    setMuted,
    playCardSound,
    playTrickWonSound,
    playSpadesBrokenSound,
    playVictorySound,
    playBagWarningSound,
  } = useSound();

  // WebSocket Ref for Real-time multiplayer
  const wsRef = useRef<WebSocket | null>(null);
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or connect WebSocket when needed
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return wsRef.current;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg: WSServerMessage = JSON.parse(event.data);
          if (msg.type === 'state_update') {
            setGameState(msg.state);
          } else if (msg.type === 'room_joined') {
            setMyPosition(msg.position);
          } else if (msg.type === 'matchmaking_waiting') {
            setIsSearchingMatch(true);
            setMatchmakingQueueSize(msg.queueSize);
          } else if (msg.type === 'matchmaking_found') {
            setIsSearchingMatch(false);
          } else if (msg.type === 'chat_broadcast') {
            setChatBubbles((prev) => ({
              ...prev,
              [msg.position]: { text: msg.message, emoji: msg.emoji, time: Date.now() },
            }));
            setTimeout(() => {
              setChatBubbles((prev) => ({
                ...prev,
                [msg.position]: { text: '', time: 0 },
              }));
            }, 3000);
          }
        } catch (e) {
          console.error('Error handling WS message:', e);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
      };

      return ws;
    } catch {
      return null;
    }
  }, []);

  const sendWSAction = useCallback((action: WSClientAction) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(action));
    }
  }, []);

  // --- LOCAL SINGLE PLAYER BOT ENGINE LOOP ---
  useEffect(() => {
    if (gameState.mode !== 'single_player') return;
    if (gameState.phase !== 'bidding' && gameState.phase !== 'playing') return;

    const currentTurn = gameState.turn;
    const player = gameState.players[currentTurn];

    if (player && player.type === 'bot') {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);

      const delay = gameState.settings.botSpeedMs || 700;

      botTimerRef.current = setTimeout(() => {
        setGameState((prevState) => {
          if (prevState.mode !== 'single_player') return prevState;
          if (prevState.turn !== currentTurn) return prevState;

          const botDiff = player.botDifficulty || 'expert';

          if (prevState.phase === 'bidding') {
            const hand = prevState.hands[currentTurn];
            const bidResult = calculateBotBid(hand, currentTurn, botDiff, prevState);
            const res = placePlayerBid(prevState, currentTurn, bidResult.bid);
            return {
              ...res.newState,
              aiExplanation: {
                position: currentTurn,
                reasoning: bidResult.reasoning,
                metrics: { difficulty: botDiff, bid: bidResult.bid },
              },
            };
          } else if (prevState.phase === 'playing') {
            const hand = prevState.hands[currentTurn];
            const decision = selectBotCard(currentTurn, hand, prevState, botDiff);
            const res = playCardMove(prevState, currentTurn, decision.card.id);

            playCardSound();

            if (res.newState.phase === 'trick_won') {
              playTrickWonSound();
              // Schedule auto-advance to next trick
              setTimeout(() => {
                setGameState((s) => (s.phase === 'trick_won' ? advanceToNextTrick(s) : s));
              }, 1400);
            }

            return {
              ...res.newState,
              aiExplanation: {
                position: currentTurn,
                reasoning: decision.reasoning,
                metrics: decision.metrics,
              },
            };
          }

          return prevState;
        });
      }, delay);
    }

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [gameState.phase, gameState.turn, gameState.mode, playCardSound, playTrickWonSound]);

  // Audio cues on state changes
  const prevSpadesBrokenRef = useRef(gameState.spadesBroken);
  useEffect(() => {
    if (!prevSpadesBrokenRef.current && gameState.spadesBroken) {
      playSpadesBrokenSound();
    }
    prevSpadesBrokenRef.current = gameState.spadesBroken;
  }, [gameState.spadesBroken, playSpadesBrokenSound]);

  const prevPhaseRef = useRef(gameState.phase);
  useEffect(() => {
    if (gameState.phase === 'game_over' && prevPhaseRef.current !== 'game_over') {
      playVictorySound();
    }
    prevPhaseRef.current = gameState.phase;
  }, [gameState.phase, playVictorySound]);

  // --- ACTIONS ---

  // Start Single Player Game
  const handleStartSinglePlayer = (difficulty: BotDifficulty) => {
    const players = createDefaultPlayers(playerName || 'You', difficulty);
    let state = createInitialGameState('local_' + Date.now(), 'single_player', undefined, players, gameState.settings);
    state = startNewRound(state);
    setGameState(state);
    setMyPosition('south');
  };

  // Create Multiplayer Room
  const handleCreateRoom = () => {
    const ws = connectWebSocket();
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        sendWSAction({
          type: 'create_room',
          playerName: playerName || 'Host',
          avatar: '👑',
          settings: gameState.settings,
        });
      } else {
        ws.onopen = () => {
          sendWSAction({
            type: 'create_room',
            playerName: playerName || 'Host',
            avatar: '👑',
            settings: gameState.settings,
          });
        };
      }
    }
    setIsHost(true);
  };

  // Join Room
  const handleJoinRoom = (code: string) => {
    const ws = connectWebSocket();
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        sendWSAction({
          type: 'join_room',
          roomCode: code.toUpperCase(),
          playerName: playerName || 'Guest',
          avatar: '⭐',
        });
      } else {
        ws.onopen = () => {
          sendWSAction({
            type: 'join_room',
            roomCode: code.toUpperCase(),
            playerName: playerName || 'Guest',
            avatar: '⭐',
          });
        };
      }
    }
    setIsHost(false);
  };

  // Start Online Game (Room)
  const handleStartOnlineGame = () => {
    sendWSAction({ type: 'start_game' });
  };

  // Seat change in room
  const handleJoinSeat = (position: Position) => {
    sendWSAction({ type: 'join_seat', position });
    setMyPosition(position);
  };

  const handleSetSeatBot = (position: Position, difficulty: BotDifficulty) => {
    sendWSAction({ type: 'set_seat_bot', position, difficulty });
  };

  // Matchmaking
  const handleStartMatchmaking = () => {
    const ws = connectWebSocket();
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        sendWSAction({ type: 'join_matchmaking', playerName: playerName || 'Contender' });
      } else {
        ws.onopen = () => {
          sendWSAction({ type: 'join_matchmaking', playerName: playerName || 'Contender' });
        };
      }
    }
    setIsSearchingMatch(true);
  };

  const handleCancelMatchmaking = () => {
    sendWSAction({ type: 'leave_matchmaking' });
    setIsSearchingMatch(false);
  };

  // Place Human Bid
  const handlePlaceBid = (bid: BidValue, isBlindNil: boolean = false) => {
    if (gameState.mode === 'single_player') {
      const res = placePlayerBid(gameState, myPosition, bid, isBlindNil);
      setGameState(res.newState);
    } else {
      sendWSAction({ type: 'place_bid', bid, isBlindNil });
    }
  };

  // Play Human Card
  const handlePlayCard = (cardId: string) => {
    playCardSound();
    if (gameState.mode === 'single_player') {
      const res = playCardMove(gameState, myPosition, cardId);
      if (res.newState.phase === 'trick_won') {
        playTrickWonSound();
        setTimeout(() => {
          setGameState((s) => (s.phase === 'trick_won' ? advanceToNextTrick(s) : s));
        }, 1400);
      }
      setGameState(res.newState);
    } else {
      sendWSAction({ type: 'play_card', cardId });
    }
  };

  // Next Round
  const handleNextRound = () => {
    if (gameState.mode === 'single_player') {
      setGameState(startNewRound(gameState));
    } else {
      sendWSAction({ type: 'next_round' });
    }
  };

  // Restart Match
  const handleRestartGame = () => {
    if (gameState.mode === 'single_player') {
      const state = createInitialGameState('local_' + Date.now(), 'single_player', undefined, gameState.players, gameState.settings);
      setGameState(startNewRound(state));
    } else {
      sendWSAction({ type: 'restart_game' });
    }
  };

  // Replay Same Deal
  const handleSameDeal = () => {
    if (gameState.mode === 'single_player') {
      setGameState(restartSameDeal(gameState));
    }
  };

  // Send Emoji / Taunt
  const handleSendEmoji = (emoji: string) => {
    if (gameState.mode === 'single_player') {
      setChatBubbles((prev) => ({
        ...prev,
        [myPosition]: { text: emoji, emoji, time: Date.now() },
      }));
      setTimeout(() => {
        setChatBubbles((prev) => ({
          ...prev,
          [myPosition]: { text: '', time: 0 },
        }));
      }, 2500);
    } else {
      sendWSAction({ type: 'send_chat', message: emoji, emoji });
    }
  };

  const handleReturnToLobby = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'lobby',
    }));
  };

  // Check if human needs to bid
  const isHumanBidding =
    gameState.phase === 'bidding' && gameState.turn === myPosition;

  const partnerPosition: Position = myPosition === 'north' ? 'south' : myPosition === 'south' ? 'north' : myPosition === 'east' ? 'west' : 'east';

  return (
    <div className={`bg-gradient-to-b from-[#051f30] via-[#0b4869] to-[#041a29] text-[#E2F1F8] flex flex-col font-sans selection:bg-[#FBBF24] selection:text-[#09293B] overflow-x-hidden ${
      gameState.phase === 'lobby' ? 'min-h-screen overflow-y-auto' : 'h-screen max-h-screen overflow-hidden'
    }`}>
      {/* Top Navigation (Shown in Lobby mode) */}
      {gameState.phase === 'lobby' && (
        <Navbar
          gameState={gameState}
          muted={muted}
          onToggleMute={() => setMuted(!muted)}
          showHUD={showHUD}
          onToggleHUD={() => setShowHUD(!showHUD)}
          onOpenRules={() => setShowRules(true)}
          onOpenSettings={() => setShowSettings(true)}
          onReturnToLobby={handleReturnToLobby}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto flex flex-col justify-center ${
        gameState.phase === 'lobby'
          ? 'max-w-7xl p-2 sm:p-4 md:p-6'
          : 'p-0 max-w-5xl h-full max-h-full overflow-hidden items-center'
      }`}>
        {gameState.phase === 'lobby' ? (
          /* Lobby / Game Mode Selection View */
          <div className="w-full flex justify-center py-4">
            <RoomLobby
              mode={gameState.mode}
              gameState={gameState}
              myPosition={myPosition}
              playerName={playerName}
              roomCodeInput={roomCodeInput}
              isHost={isHost}
              matchmakingQueueSize={matchmakingQueueSize}
              isSearchingMatch={isSearchingMatch}
              onSetPlayerName={setPlayerName}
              onSetRoomCodeInput={setRoomCodeInput}
              onStartSinglePlayer={handleStartSinglePlayer}
              onCreateRoom={handleCreateRoom}
              onJoinRoom={handleJoinRoom}
              onStartGame={handleStartOnlineGame}
              onSetSeatBot={handleSetSeatBot}
              onJoinSeat={handleJoinSeat}
              onStartMatchmaking={handleStartMatchmaking}
              onCancelMatchmaking={handleCancelMatchmaking}
              onSwitchMode={(mode) =>
                setGameState((prev) => ({
                  ...prev,
                  mode,
                  roomCode: mode === 'single_player' ? undefined : prev.roomCode,
                }))
              }
            />
          </div>
        ) : (
          /* Active Playing Table (Full-bleed mobile, centered on desktop) */
          <div className="w-full h-full max-h-full flex flex-col justify-center overflow-hidden">
            <SpadesTable
              gameState={gameState}
              myPosition={myPosition}
              onPlayCard={handlePlayCard}
              onNewGame={() => setShowNewGameModal(true)}
              onOpenRules={() => setShowRules(true)}
              onOpenSettings={() => setShowSettings(true)}
              onOpenScoreSheet={() => setShowScoreSheet(true)}
              onToggleBooster={() => setShowHUD(!showHUD)}
              onSendEmoji={handleSendEmoji}
              chatBubbles={chatBubbles}
              muted={muted}
              onToggleMute={() => setMuted(!muted)}
              onReturnToLobby={handleReturnToLobby}
            />
          </div>
        )}
      </main>

      {/* MODALS */}

      {/* Forfeit / New Game Modal (Frame 00:00) */}
      <NewGameModal
        isOpen={showNewGameModal}
        onClose={() => setShowNewGameModal(false)}
        onSameDeal={handleSameDeal}
        onNewGame={() => handleStartSinglePlayer('expert')}
      />

      {/* Match Score Sheet Modal */}
      <ScoreSheetModal
        isOpen={showScoreSheet}
        onClose={() => setShowScoreSheet(false)}
        scores={gameState.scores}
        history={gameState.history}
        settings={gameState.settings}
        roundNumber={gameState.roundNumber}
      />

      {/* Bidding Modal */}
      {isHumanBidding && (
        <BiddingModal
          position={myPosition}
          playerName={playerName}
          partnerName={gameState.players[partnerPosition].name}
          partnerBid={gameState.bids[partnerPosition]}
          settings={gameState.settings}
          onPlaceBid={handlePlaceBid}
        />
      )}

      {/* Round Summary & Final Victory Modal */}
      <RoundSummaryModal
        gameState={gameState}
        onNextRound={handleNextRound}
        onRestartGame={handleRestartGame}
      />

      {/* Rules Guide Modal */}
      <RulesGuideModal isOpen={showRules} onClose={() => setShowRules(false)} />

      {/* House Rules / Settings Modal */}
      <GameSettingsModal
        isOpen={showSettings}
        settings={gameState.settings}
        onUpdateSettings={(newSettings) =>
          setGameState((prev) => ({ ...prev, settings: newSettings }))
        }
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
