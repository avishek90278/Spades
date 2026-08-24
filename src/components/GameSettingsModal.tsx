import React from 'react';
import { GameSettings } from '../types/spades';
import { Settings, X } from 'lucide-react';

interface GameSettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#161616] border border-[#2A2A2A] rounded-3xl p-6 text-[#E0E0E0] shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-lg font-serif italic font-bold text-white tracking-wide">
              Spades House Rules & Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#222222] text-[#888888] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Target Score */}
          <div className="flex items-center justify-between bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <div>
              <span className="font-bold text-white block font-sans">Winning Target Score</span>
              <span className="text-[#888888]">Total points required to win match</span>
            </div>
            <select
              value={settings.targetScore}
              onChange={(e) =>
                onUpdateSettings({ ...settings, targetScore: Number(e.target.value) })
              }
              className="bg-[#161616] border border-[#333333] text-[#D4AF37] font-mono font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="300">300 Pts (Quick)</option>
              <option value="500">500 Pts (Standard)</option>
              <option value="750">750 Pts (Extended)</option>
            </select>
          </div>

          {/* Blind Nil Toggle */}
          <div className="flex items-center justify-between bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <div>
              <span className="font-bold text-white block font-sans">Allow Blind Nil</span>
              <span className="text-[#888888]">+200 / -200 Nil bidding option</span>
            </div>
            <input
              type="checkbox"
              checked={settings.allowBlindNil}
              onChange={(e) =>
                onUpdateSettings({ ...settings, allowBlindNil: e.target.checked })
              }
              className="w-5 h-5 accent-[#D4AF37] rounded cursor-pointer"
            />
          </div>

          {/* Sandbag Penalty */}
          <div className="flex items-center justify-between bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <div>
              <span className="font-bold text-white block font-sans">Sandbag Penalty (10 Bags)</span>
              <span className="text-[#888888]">Deduction when rolling over 10 bags</span>
            </div>
            <span className="font-mono font-bold text-rose-400 bg-[#161616] px-2.5 py-1 rounded border border-[#2A2A2A]">
              -100 Pts
            </span>
          </div>

          {/* Bot Speed */}
          <div className="flex items-center justify-between bg-[#111111] p-3.5 rounded-xl border border-[#2A2A2A]">
            <div>
              <span className="font-bold text-white block font-sans">Bot Speed</span>
              <span className="text-[#888888]">Delay for bot turns during single player</span>
            </div>
            <select
              value={settings.botSpeedMs}
              onChange={(e) =>
                onUpdateSettings({ ...settings, botSpeedMs: Number(e.target.value) })
              }
              className="bg-[#161616] border border-[#333333] text-[#E0E0E0] font-mono font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="350">Fast (350ms)</option>
              <option value="700">Natural (700ms)</option>
              <option value="1200">Relaxed (1.2s)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E5C158] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
