/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArenaDef, UserProgress } from '../types/game';
import { ARENAS } from '../data/arenas';
import { soundManager } from '../audio/soundManager';
import { unlockArena } from '../utils/storage';
import { ArrowLeft, MapPin, Check, Lock, Coins, Sparkles } from 'lucide-react';

interface ArenaSelectProps {
  currentArena: ArenaDef;
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onSelectArena: (arena: ArenaDef) => void;
  onBack: () => void;
}

export const ArenaSelect: React.FC<ArenaSelectProps> = ({
  currentArena,
  userProgress,
  onUpdateProgress,
  onSelectArena,
  onBack,
}) => {
  const [selectedArena, setSelectedArena] = useState<ArenaDef>(currentArena);

  const isArenaUnlocked = (arena: ArenaDef) => {
    return arena.unlocked || userProgress.unlockedArenas.includes(arena.id);
  };

  const handleChoose = (arena: ArenaDef) => {
    soundManager.playClick();
    setSelectedArena(arena);
    if (isArenaUnlocked(arena)) {
      onSelectArena(arena);
    }
  };

  const handleUnlock = (arena: ArenaDef) => {
    if (!arena.unlockCost || userProgress.coins < arena.unlockCost) return;
    const updated = unlockArena(userProgress, arena.id, arena.unlockCost);
    if (updated) {
      soundManager.playRoundGong();
      onUpdateProgress(updated);
      onSelectArena(arena);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white font-comic overflow-y-auto select-none p-4 md:p-8 flex flex-col justify-between">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-arcade text-xs">BACK</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-arcade text-2xl md:text-4xl text-amber-400 text-stroke-sm tracking-wider">
            ARENA SELECTION
          </h1>
          <span className="text-xs text-slate-400">
            Choose your Indian battleground across the subcontinent
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-amber-500/40 rounded-xl text-amber-400 font-arcade text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{userProgress.coins}</span>
        </div>
      </div>

      {/* Arenas Grid */}
      <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {ARENAS.map((arena) => {
          const isSelected = selectedArena.id === arena.id;
          const isUnlocked = isArenaUnlocked(arena);

          return (
            <div
              key={arena.id}
              onClick={() => handleChoose(arena)}
              className={`group relative rounded-3xl p-5 border-3 transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-amber-400 comic-shadow-amber scale-102 ring-2 ring-amber-400/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Stage Visual Card Top */}
              <div
                className="w-full h-32 rounded-2xl mb-4 border border-slate-700/80 relative overflow-hidden flex flex-col justify-end p-3 transition-transform group-hover:scale-101"
                style={{ backgroundColor: arena.bgColor }}
              >
                {/* Parallax Ground Color Accent */}
                <div
                  className="absolute bottom-0 inset-x-0 h-6 opacity-80"
                  style={{ backgroundColor: arena.groundColor }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{arena.location}</span>
                  </div>

                  {isSelected && (
                    <div className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-arcade text-[10px] font-black flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      SELECTED
                    </div>
                  )}
                </div>

                {!isUnlocked && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-2">
                    <Lock className="w-7 h-7 text-amber-400 mb-1" />
                    <span className="text-xs font-arcade text-amber-400">
                      LOCKED ARENA
                    </span>
                    <span className="text-[11px] text-slate-300 mt-0.5">
                      {arena.unlockCost} Coins to Unlock
                    </span>
                  </div>
                )}
              </div>

              {/* Arena Details */}
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-arcade text-lg text-white group-hover:text-amber-400 transition-colors">
                    {arena.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-bold">{arena.hindiName}</span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed mb-3">
                  {arena.tagline}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 italic">
                  <span className="text-amber-400 font-bold not-italic">Crowd Cheer: </span>
                  "{arena.crowdCheer}"
                </div>
              </div>

              {/* Unlock Action if Locked */}
              {!isUnlocked && arena.unlockCost && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlock(arena);
                  }}
                  disabled={userProgress.coins < arena.unlockCost}
                  className="w-full mt-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-arcade text-xs rounded-xl flex items-center justify-center gap-2 border-2 border-yellow-300 shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>UNLOCK FOR {arena.unlockCost} COINS</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Confirmation Bar */}
      <div className="w-full flex items-center justify-between p-4 bg-slate-900 border-2 border-amber-500/60 rounded-2xl">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold text-white">
            Current Arena: <span className="text-amber-400 font-arcade">{selectedArena.name}</span>
          </span>
        </div>

        <button
          onClick={() => {
            if (isArenaUnlocked(selectedArena)) {
              soundManager.playSelect();
              onSelectArena(selectedArena);
              onBack();
            }
          }}
          disabled={!isArenaUnlocked(selectedArena)}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-arcade text-xs rounded-xl border border-yellow-300 shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          CONFIRM ARENA
        </button>
      </div>
    </div>
  );
};
