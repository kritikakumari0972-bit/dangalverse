/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CharacterDef } from '../types/game';
import { CombatHUDState } from '../game/CombatEngine';
import { Pause, Volume2, VolumeX, Sparkles, Flame } from 'lucide-react';

interface FightHUDProps {
  hud: CombatHUDState;
  p1Char: CharacterDef;
  p2Char: CharacterDef;
  onPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onTriggerSpecialP1?: () => void;
}

export const FightHUD: React.FC<FightHUDProps> = ({
  hud,
  p1Char,
  p2Char,
  onPause,
  isMuted,
  onToggleMute,
  onTriggerSpecialP1,
}) => {
  const p1HpPercent = Math.max(0, (hud.p1Health / hud.p1MaxHealth) * 100);
  const p2HpPercent = Math.max(0, (hud.p2Health / hud.p2MaxHealth) * 100);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between p-3 md:p-6 font-comic">
      {/* Top Header: Health Bars & Round Timer */}
      <div className="w-full flex items-start justify-between gap-2 md:gap-6 relative">
        {/* P1 Health & Info */}
        <div className="flex-1 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-arcade text-lg md:text-2xl text-amber-400 text-stroke-sm tracking-wider">
              {p1Char.name}
            </span>
            {/* Round wins */}
            <div className="flex gap-1 ml-2">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border border-amber-500 transition-colors ${
                    hud.p1RoundsWon > idx ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-900/80'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* P1 Health Bar Container */}
          <div className="w-full h-5 md:h-7 bg-slate-950/90 rounded-md border-2 border-slate-700/80 p-0.5 relative overflow-hidden shadow-lg">
            <div
              className="h-full bg-linear-to-r from-red-600 via-amber-500 to-emerald-500 rounded transition-all duration-150"
              style={{ width: `${p1HpPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] md:text-xs font-bold text-white/90 drop-shadow">
              <span>{Math.ceil(hud.p1Health)} HP</span>
              <span className="text-slate-300 font-sans text-[10px] hidden md:inline">{p1Char.homeCity}</span>
            </div>
          </div>

          {/* P1 Super Energy Bar */}
          <div className="w-4/5 h-2.5 md:h-3.5 bg-slate-950/90 rounded-sm border border-slate-700 mt-1.5 p-0.5 relative overflow-hidden flex items-center">
            <div
              className={`h-full rounded-xs transition-all duration-150 ${
                hud.p1Energy >= 100
                  ? 'bg-linear-to-r from-cyan-400 via-yellow-300 to-amber-400 animate-pulse'
                  : 'bg-linear-to-r from-blue-600 to-cyan-400'
              }`}
              style={{ width: `${hud.p1Energy}%` }}
            />
            {hud.p1Energy >= 100 && (
              <span className="absolute inset-0 flex items-center justify-center text-[9px] md:text-[10px] font-arcade text-slate-950 font-black tracking-widest drop-shadow-xs">
                ★ SUPER READY ★
              </span>
            )}
          </div>
        </div>

        {/* Center: Timer & Controls */}
        <div className="flex flex-col items-center shrink-0 px-2">
          {/* Round Timer */}
          <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-950/95 border-3 border-amber-500 rounded-xl flex items-center justify-center comic-shadow-amber relative -top-1">
            <span
              className={`font-arcade text-2xl md:text-4xl ${
                hud.roundTimer <= 10 ? 'text-red-500 animate-ping' : 'text-amber-400'
              }`}
            >
              {hud.roundTimer >= 900 ? '∞' : hud.roundTimer}
            </span>
            <div className="absolute -bottom-2 bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded text-[9px] md:text-[10px] font-black uppercase tracking-wider">
              R{hud.currentRound}
            </div>
          </div>

          {/* Quick Audio & Pause Buttons */}
          <div className="flex gap-2 mt-2 pointer-events-auto">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={onPause}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Pause (Esc)"
            >
              <Pause className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* P2 Health & Info */}
        <div className="flex-1 flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            {/* Round wins */}
            <div className="flex gap-1 mr-2">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border border-red-500 transition-colors ${
                    hud.p2RoundsWon > idx ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-slate-900/80'
                  }`}
                />
              ))}
            </div>
            <span className="font-arcade text-lg md:text-2xl text-red-400 text-stroke-sm tracking-wider">
              {p2Char.name}
            </span>
          </div>

          {/* P2 Health Bar Container */}
          <div className="w-full h-5 md:h-7 bg-slate-950/90 rounded-md border-2 border-slate-700/80 p-0.5 relative overflow-hidden shadow-lg flex justify-end">
            <div
              className="h-full bg-linear-to-l from-red-600 via-amber-500 to-emerald-500 rounded transition-all duration-150"
              style={{ width: `${p2HpPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] md:text-xs font-bold text-white/90 drop-shadow">
              <span className="text-slate-300 font-sans text-[10px] hidden md:inline">{p2Char.homeCity}</span>
              <span>{Math.ceil(hud.p2Health)} HP</span>
            </div>
          </div>

          {/* P2 Super Energy Bar */}
          <div className="w-4/5 h-2.5 md:h-3.5 bg-slate-950/90 rounded-sm border border-slate-700 mt-1.5 p-0.5 relative overflow-hidden flex items-center justify-end">
            <div
              className={`h-full rounded-xs transition-all duration-150 ${
                hud.p2Energy >= 100
                  ? 'bg-linear-to-l from-cyan-400 via-yellow-300 to-amber-400 animate-pulse'
                  : 'bg-linear-to-l from-blue-600 to-cyan-400'
              }`}
              style={{ width: `${hud.p2Energy}%` }}
            />
            {hud.p2Energy >= 100 && (
              <span className="absolute inset-0 flex items-center justify-center text-[9px] md:text-[10px] font-arcade text-slate-950 font-black tracking-widest drop-shadow-xs">
                ★ SUPER READY ★
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mid Screen: Round Banner & Dynamic Announcer Popups */}
      <div className="w-full flex flex-col items-center justify-center my-auto pointer-events-none">
        {hud.roundBannerText && (
          <div className="animate-bounce mb-2">
            <h1 className="font-arcade text-4xl md:text-7xl text-yellow-300 text-stroke-lg tracking-wider comic-shadow-lg text-center px-6 py-2 bg-slate-950/80 border-y-4 border-amber-400 rounded-2xl transform -rotate-2">
              {hud.roundBannerText}
            </h1>
          </div>
        )}

        {hud.announcerText && (
          <div className="px-4 py-1.5 rounded-full bg-red-600/90 border-2 border-yellow-300 text-white font-bold text-sm md:text-lg tracking-wide shadow-xl flex items-center gap-2 transform animate-pulse">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>{hud.announcerText}</span>
            <Flame className="w-4 h-4 text-amber-300" />
          </div>
        )}

        {/* Combo Indicators */}
        <div className="w-full flex justify-between px-8 mt-4">
          {hud.p1Combo >= 2 ? (
            <div className="bg-amber-500/90 border-2 border-slate-950 px-3 py-1 rounded-xl text-slate-950 font-black text-lg md:text-2xl transform -rotate-6 animate-bounce shadow-lg">
              {hud.p1Combo} HITS!
            </div>
          ) : <div />}

          {hud.p2Combo >= 2 ? (
            <div className="bg-red-500/90 border-2 border-slate-950 px-3 py-1 rounded-xl text-white font-black text-lg md:text-2xl transform rotate-6 animate-bounce shadow-lg">
              {hud.p2Combo} HITS!
            </div>
          ) : <div />}
        </div>
      </div>

      {/* Bottom Controls Hint & Mobile Super Trigger */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 font-sans pb-1">
        <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-md border border-slate-800">
          <span className="text-amber-400 font-bold">P1:</span>
          <span>A/D Move · W/Space Jump · S Crouch · J Attack · K Heavy · L Special · U Block</span>
        </div>

        {/* Mobile Super Attack Button when Ready */}
        {hud.p1Energy >= 100 && onTriggerSpecialP1 && (
          <button
            onClick={onTriggerSpecialP1}
            className="pointer-events-auto md:hidden ml-auto px-4 py-2 bg-linear-to-r from-amber-500 to-red-500 text-slate-950 font-arcade text-xs rounded-xl font-black border-2 border-yellow-300 shadow-lg animate-pulse"
          >
            ★ UNLEASH SPECIAL! ★
          </button>
        )}
      </div>
    </div>
  );
};
