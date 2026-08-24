import React from 'react';
import { GameSettings, SpadesGameState } from '../types/spades';
import { Volume2, VolumeX, Brain, BookOpen, Settings, Users, RotateCcw } from 'lucide-react';

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
  const { phase, scores, mode, roomCode, settings } = gameState;
  const isPlaying = phase !== 'lobby';

  const nsBags = scores.team_north_south.bags;
  const ewBags = scores.team_east_west.bags;

  return (
    <header className="h-16 bg-[#161616] border-b border-[#2A2A2A] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Brand & Room / Mode Ticker */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#222222] border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] font-serif text-lg font-bold shadow-md select-none">
          ♠
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-[#D4AF37] font-serif italic text-lg sm:text-xl tracking-wide font-medium">
            Grand Spades Elite
          </span>
          <div className="hidden md:block h-4 w-[1px] bg-[#333333] mx-1" />
          <div className="hidden md:flex gap-4 text-xs uppercase tracking-widest text-[#888888]">
            <span>
              Room: <span className="text-white font-mono">{roomCode || 'LOCAL-01'}</span>
            </span>
            <span>
              Mode:{' '}
              <span className="text-white">
                {mode === 'single_player' ? 'Expert Bots' : mode === 'room' ? 'Private Table' : 'Quick Match'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Match Score Ticker (VIP Lounge Style) */}
      {isPlaying && (
        <div className="hidden lg:flex items-center gap-6 bg-[#111111] px-5 py-2 rounded-xl border border-[#2A2A2A]">
          {/* Team Alpha (You) */}
          <div className="flex flex-col items-end">
            <div className="flex gap-3 items-center">
              <span className="text-[10px] text-[#888888] uppercase tracking-wider font-semibold">
                Team Alpha (You)
              </span>
              <span className="text-[#D4AF37] font-bold text-base font-mono">
                {scores.team_north_south.totalScore}
              </span>
            </div>
            <div className="flex gap-1 mt-0.5" title={`Bags: ${nsBags} / 10`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < nsBags ? (nsBags >= 7 ? 'bg-rose-500' : 'bg-[#D4AF37]') : 'bg-[#333333]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="h-7 w-[1px] bg-[#333333]" />

          {/* Team Omega (Opponents) */}
          <div className="flex flex-col items-start">
            <div className="flex gap-3 items-center">
              <span className="text-[10px] text-[#888888] uppercase tracking-wider font-semibold">
                Team Omega
              </span>
              <span className="text-white font-bold text-base font-mono">
                {scores.team_east_west.totalScore}
              </span>
            </div>
            <div className="flex gap-1 mt-0.5" title={`Bags: ${ewBags} / 10`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < ewBags ? (ewBags >= 7 ? 'bg-rose-500' : 'bg-[#D4AF37]') : 'bg-[#333333]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Card Counter & AI Brain HUD Toggle */}
        <button
          id="toggle-hud-btn"
          type="button"
          onClick={onToggleHUD}
          className={`px-3 py-1.5 rounded-lg border text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-all ${
            showHUD
              ? 'bg-[#1F1B12] border-[#D4AF37] text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
              : 'bg-[#222222] border-[#444444] text-[#E0E0E0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
          }`}
          title="Toggle AI Telemetry & Card Counter"
        >
          <Brain className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden sm:inline">Analysis</span>
        </button>

        {/* Sound Toggle */}
        <button
          id="toggle-sound-btn"
          type="button"
          onClick={onToggleMute}
          className="p-2 rounded-lg bg-[#222222] border border-[#444444] text-[#E0E0E0] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
          title={muted ? 'Unmute audio' : 'Mute audio'}
        >
          {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
        </button>

        {/* Rules Guide */}
        <button
          id="open-rules-btn"
          type="button"
          onClick={onOpenRules}
          className="px-3 py-1.5 rounded-lg bg-[#222222] border border-[#444444] text-[#E0E0E0] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-xs uppercase tracking-wider font-medium flex items-center gap-1.5"
          title="Tournament Rules"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden sm:inline">Rules</span>
        </button>

        {/* Settings */}
        <button
          id="open-settings-btn"
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-[#222222] border border-[#444444] text-[#E0E0E0] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
          title="Game Settings"
        >
          <Settings className="w-4 h-4 text-[#888888] hover:text-[#E0E0E0]" />
        </button>

        {/* Return to Lobby */}
        {isPlaying && (
          <button
            id="return-lobby-btn"
            type="button"
            onClick={onReturnToLobby}
            className="px-3 py-1.5 rounded-lg bg-[#222222] border border-[#444444] text-[#E0E0E0] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-xs uppercase tracking-wider font-medium flex items-center gap-1"
            title="Lobby"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lobby</span>
          </button>
        )}
      </div>
    </header>
  );
};
