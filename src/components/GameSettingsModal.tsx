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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#09293B] to-[#061D2B] border-2 border-[#165173] rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#165173] pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-lg font-black text-white tracking-wide">
              Spades House Rules & Settings
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

        <div className="space-y-2.5 text-xs">
          {/* Target Score */}
          <div className="flex items-center justify-between bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
            <div>
              <span className="font-bold text-white block font-sans">Winning Target Score</span>
              <span className="text-[#94A3B8]">Total points required to win match</span>
            </div>
            <select
              value={settings.targetScore}
              onChange={(e) =>
                onUpdateSettings({ ...settings, targetScore: Number(e.target.value) })
              }
              className="bg-[#061D2B] border border-[#165173] text-[#4ADE80] font-mono font-black rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="300">300 Pts (Quick)</option>
              <option value="500">500 Pts (Standard)</option>
              <option value="750">750 Pts (Extended)</option>
            </select>
          </div>

          {/* Blind Nil Toggle */}
          <div className="flex items-center justify-between bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
            <div>
              <span className="font-bold text-white block font-sans">Allow Blind Nil</span>
              <span className="text-[#94A3B8]">+200 / -200 Nil bidding option</span>
            </div>
            <input
              type="checkbox"
              checked={settings.allowBlindNil}
              onChange={(e) =>
                onUpdateSettings({ ...settings, allowBlindNil: e.target.checked })
              }
              className="w-5 h-5 accent-[#F59E0B] rounded cursor-pointer"
            />
          </div>

          {/* Sandbag Penalty */}
          <div className="flex items-center justify-between bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
            <div>
              <span className="font-bold text-white block font-sans">Sandbag Penalty (10 Bags)</span>
              <span className="text-[#94A3B8]">Deduction when rolling over 10 bags</span>
            </div>
            <span className="font-mono font-black text-rose-400 bg-[#061D2B] px-2.5 py-1 rounded-xl border border-[#165173]">
              -100 Pts
            </span>
          </div>

          {/* Bot Speed */}
          <div className="flex items-center justify-between bg-[#0B3147] p-3.5 rounded-2xl border border-[#165173]">
            <div>
              <span className="font-bold text-white block font-sans">Bot Speed</span>
              <span className="text-[#94A3B8]">Delay for bot turns during single player</span>
            </div>
            <select
              value={settings.botSpeedMs}
              onChange={(e) =>
                onUpdateSettings({ ...settings, botSpeedMs: Number(e.target.value) })
              }
              className="bg-[#061D2B] border border-[#165173] text-white font-mono font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="350">Fast (350ms)</option>
              <option value="700">Natural (700ms)</option>
              <option value="1200">Relaxed (1200ms)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-b from-[#EFEFE8] via-[#E4E4DC] to-[#D5D5CB] hover:from-white hover:to-[#DFDFD6] text-[#3D3D38] font-black rounded-2xl border border-[#B0B0A2] text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
