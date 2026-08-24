import React from 'react';
import { GameSettings, SpadesGameState } from '../types/spades';
import { Volume2, VolumeX, Activity, HelpCircle, Settings, Home, Trophy } from 'lucide-react';

interface NavbarProps {
  gameState: SpadesGameState;
  muted: boolean;
  onToggleMute: () => void;
  showHUD: boolean;
  onToggleHUD: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onReturnToLobby: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  gameState,
  muted,
  onToggleMute,
  showHUD,
  onToggleHUD,
  onOpenRules,
  onOpenSettings,
  onReturnToLobby,
}) => {
  const { phase, scores, mode, roomCode } = gameState;
  const isPlaying = phase !== 'lobby';

  const nsBags = scores.team_north_south.bags;
  const ewBags = scores.team_east_west.bags;

  return (
    <header className="h-14 sm:h-16 bg-[#08283B]/90 backdrop-blur-md border-b border-[#144F70] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 text-white select-none">
      {/* Left: Brand & Room / Mode Ticker */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 rounded-xl bg-white border border-[#16A34A] shadow-md flex items-center justify-center p-1">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-[#16A34A]" aria-label="Spades">
            <path d="M12 2.2C11 5.5 6 9.8 6 13.5c0 3.2 2.5 5.5 5.5 5.5.5 0 .9-.1 1.2-.2-1 1.5-1.9 3.2-1.7 4.2h2c0-1.5 1.5-3.3 2-4 .5.7 2 2.5 2 4h2c.2-1-.7-2.7-1.7-4.2.3.1.7.2 1.2.2 3 0 5.5-2.3 5.5-5.5C22 9.8 17 5.5 16 2.2c-.7 1.5-1.9 3.8-4 3.8-2.1 0-3.3-2.3-4-3.8H12z" />
          </svg>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-extrabold text-base sm:text-lg tracking-wide text-white drop-shadow">
            SPADES
          </span>
          <div className="hidden md:block h-4 w-[1px] bg-[#165173] mx-1" />
          <div className="hidden md:flex gap-3 text-xs uppercase tracking-wider text-[#7DD3FC]">
            <span>
              Room: <span className="text-white font-mono font-bold">{roomCode || 'LOCAL-01'}</span>
            </span>
            <span>
              Mode:{' '}
              <span className="text-white font-bold">
                {mode === 'single_player' ? 'Single Player' : mode === 'room' ? 'Private' : 'Multiplayer'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Match Score Ticker (Desktop) */}
      {isPlaying && (
        <div className="hidden lg:flex items-center gap-5 bg-[#09293B] px-4 py-1.5 rounded-xl border border-[#165173] shadow-md font-mono">
          {/* Team US */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-[#38BDF8] uppercase font-bold">
              US
            </span>
            <span className="text-white font-black text-base">
              {scores.team_north_south.totalScore}
            </span>
            <div className="flex gap-1" title={`Bags: ${nsBags} / 10`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < nsBags ? (nsBags >= 7 ? 'bg-rose-500' : 'bg-[#38BDF8]') : 'bg-[#0E3E5C]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="h-5 w-[1px] bg-[#165173]" />

          {/* Team THEM */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-[#FB7185] uppercase font-bold">
              THEM
            </span>
            <span className="text-white font-black text-base">
              {scores.team_east_west.totalScore}
            </span>
            <div className="flex gap-1" title={`Bags: ${ewBags} / 10`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < ewBags ? (ewBags >= 7 ? 'bg-rose-500' : 'bg-[#FB7185]') : 'bg-[#0E3E5C]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Toggle Card Counter HUD */}
        {isPlaying && (
          <button
            id="nav-toggle-hud-btn"
            type="button"
            onClick={onToggleHUD}
            title={showHUD ? 'Hide Counter HUD' : 'Show Counter HUD'}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              showHUD
                ? 'bg-[#F59E0B] border-[#FEF08A] text-[#451A03] font-bold shadow-md'
                : 'bg-[#0E3E5C] border-[#165173] text-[#BAE6FD] hover:bg-[#155075]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline font-sans text-xs">HUD</span>
          </button>
        )}

        {/* Audio Mute Toggle */}
        <button
          id="nav-mute-toggle-btn"
          type="button"
          onClick={onToggleMute}
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            muted
              ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
              : 'bg-[#0E3E5C] border-[#165173] text-[#BAE6FD] hover:bg-[#155075]'
          }`}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Rules button */}
        <button
          id="nav-rules-btn"
          type="button"
          onClick={onOpenRules}
          title="Game Rules"
          className="p-2 rounded-xl bg-[#0E3E5C] hover:bg-[#155075] border border-[#165173] text-[#BAE6FD] transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          id="nav-settings-btn"
          type="button"
          onClick={onOpenSettings}
          title="Game Settings"
          className="p-2 rounded-xl bg-[#0E3E5C] hover:bg-[#155075] border border-[#165173] text-[#BAE6FD] transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Return to Lobby */}
        {isPlaying && (
          <button
            id="nav-lobby-btn"
            type="button"
            onClick={onReturnToLobby}
            title="Leave Match to Lobby"
            className="p-2 rounded-xl bg-[#0E3E5C] hover:bg-rose-900/60 border border-[#165173] text-[#BAE6FD] hover:text-rose-200 transition-all cursor-pointer ml-1"
          >
            <Home className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
