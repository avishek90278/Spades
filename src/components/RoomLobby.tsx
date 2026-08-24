import React, { useState } from 'react';
import { BotDifficulty, GameSettings, Position, SpadesGameState } from '../types/spades';
import { Users, Bot, Globe, Play, Copy, Check, Shield, Zap, Sparkles } from 'lucide-react';

interface RoomLobbyProps {
  mode: 'single_player' | 'room' | 'matchmaking';
  gameState: SpadesGameState;
  myPosition: Position;
  playerName: string;
  roomCodeInput: string;
  isHost: boolean;
  matchmakingQueueSize: number;
  isSearchingMatch: boolean;
  onSetPlayerName: (name: string) => void;
  onSetRoomCodeInput: (code: string) => void;
  onStartSinglePlayer: (botDiff: BotDifficulty) => void;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
  onStartGame: () => void;
  onSetSeatBot: (position: Position, difficulty: BotDifficulty) => void;
  onJoinSeat: (position: Position) => void;
  onStartMatchmaking: () => void;
  onCancelMatchmaking: () => void;
  onSwitchMode: (mode: 'single_player' | 'room' | 'matchmaking') => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  mode,
  gameState,
  myPosition,
  playerName,
  roomCodeInput,
  isHost,
  matchmakingQueueSize,
  isSearchingMatch,
  onSetPlayerName,
  onSetRoomCodeInput,
  onStartSinglePlayer,
  onCreateRoom,
  onJoinRoom,
  onStartGame,
  onSetSeatBot,
  onJoinSeat,
  onStartMatchmaking,
  onCancelMatchmaking,
  onSwitchMode,
}) => {
  const [selectedBotDiff, setSelectedBotDiff] = useState<BotDifficulty>('expert');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const seats: Position[] = ['north', 'south', 'east', 'west'];

  return (
    <div id="room-lobby" className="w-full max-w-3xl mx-auto bg-[#161616]/95 border border-[#2A2A2A] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#E0E0E0] backdrop-blur-md space-y-6">
      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-[#0A0A0A] p-1.5 rounded-2xl border border-[#2A2A2A]">
        <button
          id="tab-single-player"
          type="button"
          onClick={() => onSwitchMode('single_player')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'single_player'
              ? 'bg-[#D4AF37] text-black shadow-lg font-black'
              : 'text-[#888888] hover:text-[#E0E0E0] hover:bg-[#222222]'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Play vs Bots</span>
        </button>

        <button
          id="tab-friends-room"
          type="button"
          onClick={() => onSwitchMode('room')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'room'
              ? 'bg-[#D4AF37] text-black shadow-lg font-black'
              : 'text-[#888888] hover:text-[#E0E0E0] hover:bg-[#222222]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Friends Table</span>
        </button>

        <button
          id="tab-matchmaking"
          type="button"
          onClick={() => onSwitchMode('matchmaking')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'matchmaking'
              ? 'bg-[#D4AF37] text-black shadow-lg font-black'
              : 'text-[#888888] hover:text-[#E0E0E0] hover:bg-[#222222]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Quick Match</span>
        </button>
      </div>

      {/* Profile Name Input */}
      <div className="flex items-center gap-3 bg-[#111111] p-3 rounded-2xl border border-[#2A2A2A]">
        <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider font-mono">
          Nickname:
        </span>
        <input
          id="player-name-input"
          type="text"
          value={playerName}
          onChange={(e) => onSetPlayerName(e.target.value)}
          maxLength={15}
          placeholder="Enter player handle..."
          className="flex-1 bg-[#161616] border border-[#333333] rounded-xl px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
        />
      </div>

      {/* MODE 1: SINGLE PLAYER VS AI BOTS */}
      {mode === 'single_player' && (
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#888888] uppercase tracking-wider block font-mono">
              Select AI Bot Intelligence Level:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  {
                    diff: 'easy',
                    label: 'Casual (Easy)',
                    desc: 'Relaxed moves, basic standard following rules.',
                    icon: '🌱',
                  },
                  {
                    diff: 'medium',
                    label: 'Tactical (Medium)',
                    desc: 'Counts honors, solid bidding and trumping.',
                    icon: '🤖',
                  },
                  {
                    diff: 'expert',
                    label: 'Grandmaster (Expert)',
                    desc: 'Full card counting, Nil shielding, bag forcing.',
                    icon: '🧠',
                  },
                ] as const
              ).map((item) => (
                <button
                  key={item.diff}
                  type="button"
                  onClick={() => setSelectedBotDiff(item.diff)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    selectedBotDiff === item.diff
                      ? 'bg-[#1F1B12] border-[#D4AF37] text-white ring-1 ring-[#D4AF37] shadow-xl'
                      : 'bg-[#111111] border-[#2A2A2A] hover:bg-[#1A1A1A] text-[#CCCCCC]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-bold text-sm text-white font-serif">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-[#888888] leading-tight">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0E0E0E] border border-[#2A2A2A] rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 font-mono uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Included Tournament Features:</span>
            </span>
            <ul className="text-xs text-[#888888] space-y-1 list-disc list-inside">
              <li>Strict Spades Rules: Deal 13 cards, follow suit, broken spades check.</li>
              <li>Bidding with Nil (+100/-100) & Blind Nil (+200/-200).</li>
              <li>10-Bag Penalty (-100 points) and Sandbagging tactical defense.</li>
              <li>First Team to 500 Points wins the match.</li>
            </ul>
          </div>

          <button
            id="start-single-player-btn"
            type="button"
            onClick={() => onStartSinglePlayer(selectedBotDiff)}
            className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#C69214] text-black font-extrabold rounded-2xl shadow-xl text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] uppercase tracking-wider"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>Deal Deck & Start Match</span>
          </button>
        </div>
      )}

      {/* MODE 2: PLAY WITH FRIENDS (ROOM CODE) */}
      {mode === 'room' && (
        <div className="space-y-5">
          {!gameState.roomCode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Create Room */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif italic font-bold text-white text-base mb-1">Create Private Table</h3>
                  <p className="text-xs text-[#888888]">
                    Host a game, invite up to 3 friends with a 6-digit code, or fill empty seats with AI bots.
                  </p>
                </div>
                <button
                  id="create-room-btn"
                  type="button"
                  onClick={onCreateRoom}
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-extrabold rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider text-xs"
                >
                  Create New Room
                </button>
              </div>

              {/* Join Room */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif italic font-bold text-white text-base mb-1">Join with Room Code</h3>
                  <p className="text-xs text-[#888888]">
                    Enter the 6-character room code shared by your friend to join the table.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    id="room-code-input"
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => onSetRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="e.g. SPD842"
                    maxLength={8}
                    className="flex-1 bg-[#161616] border border-[#333333] rounded-xl px-3 py-2 text-sm font-mono text-white uppercase focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <button
                    id="join-room-btn"
                    type="button"
                    onClick={() => onJoinRoom(roomCodeInput)}
                    disabled={!roomCodeInput.trim()}
                    className="px-4 py-2 bg-[#222222] hover:bg-[#333333] border border-[#444444] disabled:opacity-50 text-[#D4AF37] font-bold rounded-xl shadow-md transition-all cursor-pointer font-mono"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active Room Lobby Seat Manager */
            <div className="space-y-4">
              {/* Room Code Share Bar */}
              <div className="flex items-center justify-between bg-[#0E0E0E] p-3.5 rounded-2xl border border-[#D4AF37]/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#888888] uppercase font-mono">Room Code:</span>
                  <span className="text-lg font-black font-mono text-[#D4AF37]">
                    {gameState.roomCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(gameState.roomCode!)}
                  className="flex items-center gap-1.5 bg-[#222222] hover:bg-[#2A2A2A] text-[#E0E0E0] text-xs px-3 py-1.5 rounded-lg border border-[#333333] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* 4 Seat Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {seats.map((pos) => {
                  const player = gameState.players[pos];
                  const isMySeat = myPosition === pos;

                  return (
                    <div
                      key={pos}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        isMySeat
                          ? 'bg-[#1F1B12] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                          : 'bg-[#111111] border-[#2A2A2A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{player.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white">{player.name}</span>
                            {isMySeat && (
                              <span className="text-[10px] bg-[#D4AF37] text-black px-1.5 py-0.2 rounded font-mono font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#888888] uppercase">
                            Seat: {pos} ({pos === 'north' || pos === 'south' ? 'Team Alpha' : 'Team Omega'})
                          </span>
                        </div>
                      </div>

                      {/* Seat Controls */}
                      <div className="flex items-center gap-1">
                        {!isMySeat && (
                          <button
                            type="button"
                            onClick={() => onJoinSeat(pos)}
                            className="text-xs bg-[#222222] hover:bg-[#333333] text-[#E0E0E0] px-2 py-1 rounded-lg border border-[#333333] cursor-pointer"
                          >
                            Sit Here
                          </button>
                        )}
                        {player.type === 'bot' && (
                          <select
                            value={player.botDifficulty || 'expert'}
                            onChange={(e) => onSetSeatBot(pos, e.target.value as BotDifficulty)}
                            className="text-[11px] bg-[#161616] border border-[#333333] text-[#CCCCCC] rounded px-1.5 py-1 font-mono"
                          >
                            <option value="easy">Easy Bot</option>
                            <option value="medium">Med Bot</option>
                            <option value="expert">Expert Bot</option>
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Start Button */}
              <button
                id="start-room-game-btn"
                type="button"
                onClick={onStartGame}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#C69214] text-black font-extrabold rounded-2xl shadow-xl text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] uppercase tracking-wider"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>Launch Table & Deal</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: GLOBAL MATCHMAKING */}
      {mode === 'matchmaking' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1F1B12] text-[#D4AF37] flex items-center justify-center mx-auto border border-[#D4AF37]/40 animate-pulse">
            <Globe className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-serif italic font-bold text-white">Global Quick Match</h3>
            <p className="text-xs text-[#888888] max-w-sm mx-auto mt-1">
              Join the live matchmaking queue. When 4 players connect, you will instantly be seated in a live Spades match!
            </p>
          </div>

          {isSearchingMatch ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm font-mono text-[#D4AF37]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
                <span>Searching for opponents... ({matchmakingQueueSize}/4 in queue)</span>
              </div>
              <button
                type="button"
                onClick={onCancelMatchmaking}
                className="px-6 py-2.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer uppercase tracking-wider"
              >
                Cancel Queue
              </button>
            </div>
          ) : (
            <button
              id="start-queue-btn"
              type="button"
              onClick={onStartMatchmaking}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#E5C158] hover:to-[#C69214] text-black font-extrabold rounded-2xl text-sm shadow-xl transition-all cursor-pointer uppercase tracking-wider"
            >
              Find Match Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};
