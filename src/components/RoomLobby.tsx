import React, { useState } from 'react';
import { BotDifficulty, Position, SpadesGameState } from '../types/spades';
import { PlayerAvatar } from './PlayerAvatar';
import { Users, Bot, Globe, Play, Copy, Check, Sparkles, Cpu, Zap } from 'lucide-react';

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
    <div id="room-lobby" className="w-full max-w-3xl mx-auto bg-gradient-to-b from-[#09293B] to-[#061D2B] border-2 border-[#165173] rounded-3xl p-4 sm:p-8 shadow-2xl text-white backdrop-blur-md space-y-5 select-none">
      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-[#061D2B] p-1.5 rounded-2xl border border-[#165173]">
        <button
          id="tab-single-player"
          type="button"
          onClick={() => onSwitchMode('single_player')}
          className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
            mode === 'single_player'
              ? 'bg-gradient-to-b from-[#EFEFE8] via-[#E4E4DC] to-[#D5D5CB] text-[#3D3D38] shadow-md font-black border border-[#B0B0A2]'
              : 'text-[#BAE6FD] hover:text-white hover:bg-[#0B3147]'
          }`}
        >
          <Bot className="w-4 h-4 shrink-0" />
          <span className="truncate">VS Bots</span>
        </button>

        <button
          id="tab-friends-room"
          type="button"
          onClick={() => onSwitchMode('room')}
          className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
            mode === 'room'
              ? 'bg-gradient-to-b from-[#EFEFE8] via-[#E4E4DC] to-[#D5D5CB] text-[#3D3D38] shadow-md font-black border border-[#B0B0A2]'
              : 'text-[#BAE6FD] hover:text-white hover:bg-[#0B3147]'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span className="truncate">Private Room</span>
        </button>

        <button
          id="tab-matchmaking"
          type="button"
          onClick={() => onSwitchMode('matchmaking')}
          className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
            mode === 'matchmaking'
              ? 'bg-gradient-to-b from-[#EFEFE8] via-[#E4E4DC] to-[#D5D5CB] text-[#3D3D38] shadow-md font-black border border-[#B0B0A2]'
              : 'text-[#BAE6FD] hover:text-white hover:bg-[#0B3147]'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span className="truncate">Quick Match</span>
        </button>
      </div>

      {/* Profile Name Input */}
      <div className="flex items-center gap-2 sm:gap-3 bg-[#0B3147] p-2.5 sm:p-3 rounded-2xl border border-[#165173]">
        <span className="text-xs font-bold text-[#7DD3FC] uppercase tracking-wider font-mono shrink-0">
          Player Handle:
        </span>
        <input
          id="player-name-input"
          type="text"
          value={playerName}
          onChange={(e) => onSetPlayerName(e.target.value)}
          maxLength={15}
          placeholder="Enter player handle..."
          className="flex-1 bg-[#061D2B] border border-[#165173] rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-[#38BDF8]"
        />
      </div>

      {/* MODE 1: SINGLE PLAYER VS AI BOTS */}
      {mode === 'single_player' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7DD3FC] uppercase tracking-wider block font-mono">
              Select AI Bot Intelligence:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {(
                [
                  {
                    diff: 'easy',
                    label: 'Casual (Easy)',
                    desc: 'Relaxed moves, basic standard following rules.',
                    icon: Zap,
                  },
                  {
                    diff: 'medium',
                    label: 'Tactical (Medium)',
                    desc: 'Counts honors, solid bidding and trumping.',
                    icon: Cpu,
                  },
                  {
                    diff: 'expert',
                    label: 'Grandmaster (Expert)',
                    desc: 'Full card counting, Nil shielding, bag forcing.',
                    icon: Sparkles,
                  },
                ] as const
              ).map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedBotDiff === item.diff;
                return (
                  <button
                    key={item.diff}
                    type="button"
                    onClick={() => setSelectedBotDiff(item.diff)}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E476B] border-[#38BDF8] text-white ring-2 ring-[#38BDF8] shadow-lg'
                        : 'bg-[#0B3147] border-[#165173] hover:bg-[#0F3F5C] text-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-xl bg-[#061D2B] text-[#FBBF24] border border-[#165173]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-white">{item.label}</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-tight mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-3 sm:p-4 space-y-1.5">
            <span className="text-xs font-bold text-[#4ADE80] flex items-center gap-1.5 font-mono uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#4ADE80]" />
              <span>Official Tournament Rules:</span>
            </span>
            <ul className="text-[11px] sm:text-xs text-[#CBD5E1] space-y-1 list-disc list-inside">
              <li>Strict Spades Rules: 13 cards per hand, follow suit, broken spades check.</li>
              <li>Bidding with Nil (+100/-100) & Blind Nil (+200/-200).</li>
              <li>10-Bag Penalty (-100 points) and tactical sandbagging avoidance.</li>
              <li>First team to 500 Points wins the match.</li>
            </ul>
          </div>

          <button
            id="start-single-player-btn"
            type="button"
            onClick={() => onStartSinglePlayer(selectedBotDiff)}
            className="w-full py-3.5 sm:py-4 bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#451A03] font-black rounded-2xl border-2 border-[#FEF08A] shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] uppercase tracking-wider"
          >
            <Play className="w-5 h-5 fill-[#451A03]" />
            <span>Deal Deck & Start Match</span>
          </button>
        </div>
      )}

      {/* MODE 2: PLAY WITH FRIENDS (ROOM CODE) */}
      {mode === 'room' && (
        <div className="space-y-4">
          {!gameState.roomCode ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Create Room */}
              <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Create Private Table</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Host a game, invite up to 3 friends with a room code, or fill empty seats with AI bots.
                  </p>
                </div>
                <button
                  id="create-room-btn"
                  type="button"
                  onClick={onCreateRoom}
                  className="w-full py-3 bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#451A03] font-black rounded-xl border border-[#FEF08A] shadow-lg transition-all cursor-pointer uppercase tracking-wider text-xs"
                >
                  Create New Room
                </button>
              </div>

              {/* Join Room */}
              <div className="bg-[#0B3147] border border-[#165173] rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Join with Room Code</h3>
                  <p className="text-xs text-[#94A3B8]">
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
                    className="flex-1 bg-[#061D2B] border border-[#165173] rounded-xl px-3 py-2 text-sm font-mono text-white uppercase focus:outline-none focus:border-[#38BDF8]"
                  />
                  <button
                    id="join-room-btn"
                    type="button"
                    onClick={() => onJoinRoom(roomCodeInput)}
                    disabled={!roomCodeInput.trim()}
                    className="px-4 py-2 bg-gradient-to-b from-[#EFEFE8] via-[#E4E4DC] to-[#D5D5CB] hover:from-white hover:to-[#DFDFD6] border border-[#B0B0A2] disabled:opacity-50 text-[#3D3D38] font-black rounded-xl shadow-md transition-all cursor-pointer font-mono text-xs uppercase"
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
              <div className="flex items-center justify-between bg-[#061D2B] p-3 rounded-2xl border border-[#165173]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8] uppercase font-mono">Room Code:</span>
                  <span className="text-base sm:text-lg font-black font-mono text-[#FBBF24]">
                    {gameState.roomCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(gameState.roomCode!)}
                  className="flex items-center gap-1.5 bg-[#0B3147] hover:bg-[#0F3F5C] text-white text-xs px-3 py-1.5 rounded-xl border border-[#165173] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5 text-[#38BDF8]" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* 4 Seat Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {seats.map((pos) => {
                  const player = gameState.players[pos];
                  const isMySeat = myPosition === pos;

                  return (
                    <div
                      key={pos}
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        isMySeat
                          ? 'bg-[#0E476B] border-[#38BDF8] ring-2 ring-[#38BDF8]'
                          : 'bg-[#0B3147] border-[#165173]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <PlayerAvatar
                          position={pos}
                          name={player.name}
                          isSelf={isMySeat}
                          isBot={player.type === 'bot'}
                          botDifficulty={player.botDifficulty}
                          size="sm"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-white">{player.name}</span>
                            {isMySeat && (
                              <span className="text-[9px] bg-[#38BDF8] text-[#061D2B] px-1.5 py-0.2 rounded font-mono font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-mono text-[#94A3B8] uppercase">
                            Seat: {pos} ({pos === 'north' || pos === 'south' ? 'US' : 'THEM'})
                          </span>
                        </div>
                      </div>

                      {/* Seat Controls */}
                      <div className="flex items-center gap-1">
                        {!isMySeat && (
                          <button
                            type="button"
                            onClick={() => onJoinSeat(pos)}
                            className="text-xs bg-[#061D2B] hover:bg-[#144F70] text-white px-2 py-1 rounded-lg border border-[#165173] cursor-pointer font-bold"
                          >
                            Sit
                          </button>
                        )}
                        {player.type === 'bot' && (
                          <select
                            value={player.botDifficulty || 'expert'}
                            onChange={(e) => onSetSeatBot(pos, e.target.value as BotDifficulty)}
                            className="text-[10px] sm:text-[11px] bg-[#061D2B] border border-[#165173] text-[#BAE6FD] rounded-lg px-1.5 py-1 font-mono font-bold"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Med</option>
                            <option value="expert">Expert</option>
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
                className="w-full py-3.5 sm:py-4 bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#451A03] font-black rounded-2xl border-2 border-[#FEF08A] shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] uppercase tracking-wider"
              >
                <Play className="w-5 h-5 fill-[#451A03]" />
                <span>Launch Table & Deal</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: GLOBAL MATCHMAKING */}
      {mode === 'matchmaking' && (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B3147] text-[#38BDF8] flex items-center justify-center mx-auto border border-[#165173] animate-pulse">
            <Globe className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Global Quick Match</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1">
              Join the live queue. When 4 players connect, you will instantly be seated at the table!
            </p>
          </div>

          {isSearchingMatch ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-[#FBBF24]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] animate-ping" />
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
              className="px-8 py-3.5 bg-gradient-to-b from-[#F59E0B] via-[#EAB308] to-[#D97706] hover:from-[#FBBF24] hover:to-[#B45309] text-[#451A03] font-black rounded-2xl border-2 border-[#FEF08A] text-xs sm:text-sm shadow-xl transition-all cursor-pointer uppercase tracking-wider"
            >
              Find Match Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};
