/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameMode, UserProgress, GameSettings } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { CHARACTERS } from '../data/characters';
import {
  Play,
  BookOpen,
  Trophy,
  Swords,
  Users,
  Layers,
  MapPin,
  Settings,
  Info,
  Volume2,
  VolumeX,
  Coins,
  Sparkles,
  Flame,
} from 'lucide-react';

interface MainMenuProps {
  userProgress: UserProgress;
  settings: GameSettings;
  onSelectMode: (mode: GameMode) => void;
  onOpenCollection: () => void;
  onOpenArenas: () => void;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  userProgress,
  settings,
  onSelectMode,
  onOpenCollection,
  onOpenArenas,
  onOpenSettings,
  onOpenCredits,
  isMuted,
  onToggleMute,
}) => {
  const [activeFighterIdx, setActiveFighterIdx] = useState<number>(0);
  const featuredFighter = CHARACTERS[activeFighterIdx];

  // Rotate featured character every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFighterIdx((prev) => (prev + 1) % CHARACTERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleMenuClick = (action: () => void) => {
    soundManager.playClick();
    action();
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white font-comic overflow-y-auto select-none p-4 md:p-8 flex flex-col justify-between">
      {/* Background Indian Atmospheric Sky & Silhouettes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-amber-500 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-red-600 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/30 blur-3xl" />
      </div>

      {/* Top Bar: Player Level, Coins & Audio Toggle */}
      <div className="relative z-10 w-full flex items-center justify-between">
        {/* User Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-3 py-1.5 shadow-md">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-arcade">
            <Coins className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{userProgress.coins} COINS</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="text-xs text-slate-300 font-bold">
            LVL {userProgress.level}
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleMute();
          }}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
        </button>
      </div>

      {/* Centerpiece: Animated Logo & Hero Showcase */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-auto flex flex-col items-center text-center py-4">
        {/* Bespoke DANGALVERSE Logo */}
        <div className="mb-2 relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-amber-500 animate-pulse" />
            <span className="font-arcade text-xs md:text-sm tracking-widest text-amber-400 uppercase">
              INDIA'S FUNNIEST CARTOON FIGHTING UNIVERSE
            </span>
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-red-500 animate-pulse" />
          </div>

          <h1 className="font-arcade text-5xl md:text-8xl tracking-wider text-yellow-400 text-stroke-lg comic-shadow-lg transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
            DANGALVERSE
          </h1>

          <div className="mt-2 inline-block bg-linear-to-r from-red-600 to-amber-500 px-4 py-1 rounded-full text-white font-bold text-xs md:text-sm shadow-md">
            ★ THE GREAT INDIAN CARTOON CLASH ★
          </div>
        </div>

        {/* Featured Fighter Spotlight Box */}
        <div className="my-3 px-5 py-2.5 bg-slate-900/80 border-2 border-amber-500/60 rounded-2xl flex items-center gap-3 shadow-lg max-w-md">
          <div
            className="w-8 h-8 rounded-full border border-yellow-300 flex items-center justify-center font-arcade text-xs font-black shadow-inner"
            style={{ backgroundColor: featuredFighter.primaryColor }}
          >
            !
          </div>
          <div className="text-left">
            <span className="text-[11px] font-bold text-amber-400 block">
              Featured: {featuredFighter.name} ({featuredFighter.homeCity})
            </span>
            <span className="text-xs text-slate-300 italic">
              "{featuredFighter.tagline}"
            </span>
          </div>
        </div>

        {/* Main 9 Menu Navigation Buttons */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-2">
          {/* 1. PLAY NOW (VS CPU) */}
          <button
            onClick={() => handleMenuClick(() => onSelectMode('vs_cpu'))}
            className="group py-3.5 px-4 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-slate-950 font-arcade text-base rounded-2xl flex items-center justify-center gap-2.5 border-3 border-yellow-300 shadow-xl comic-shadow transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            <span>PLAY NOW</span>
          </button>

          {/* 2. STORY MODE */}
          <button
            onClick={() => handleMenuClick(() => onSelectMode('story'))}
            className="group py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-arcade text-sm rounded-2xl flex items-center justify-center gap-2.5 border-2 border-amber-500/80 hover:border-amber-400 shadow-md transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>STORY MODE</span>
          </button>

          {/* 3. ARCADE MODE */}
          <button
            onClick={() => handleMenuClick(() => onSelectMode('arcade'))}
            className="group py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-arcade text-sm rounded-2xl flex items-center justify-center gap-2.5 border-2 border-red-500/80 hover:border-red-400 shadow-md transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
            <span>ARCADE LADDER</span>
          </button>

          {/* 4. PRACTICE MODE */}
          <button
            onClick={() => handleMenuClick(() => onSelectMode('practice'))}
            className="group py-3 px-4 bg-slate-900/90 hover:bg-slate-800 active:scale-98 text-slate-200 font-arcade text-xs rounded-2xl flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Swords className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>PRACTICE MODE</span>
          </button>

          {/* 5. LOCAL 2 PLAYER */}
          <button
            onClick={() => handleMenuClick(() => onSelectMode('local_2p'))}
            className="group py-3 px-4 bg-slate-900/90 hover:bg-slate-800 active:scale-98 text-slate-200 font-arcade text-xs rounded-2xl flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>LOCAL 2 PLAYER</span>
          </button>

          {/* 6. CHARACTER COLLECTION */}
          <button
            onClick={() => handleMenuClick(onOpenCollection)}
            className="group py-3 px-4 bg-slate-900/90 hover:bg-slate-800 active:scale-98 text-slate-200 font-arcade text-xs rounded-2xl flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span>ROSTER COLLECTION</span>
          </button>

          {/* 7. ARENA SELECTION */}
          <button
            onClick={() => handleMenuClick(onOpenArenas)}
            className="group py-3 px-4 bg-slate-900/70 hover:bg-slate-800 active:scale-98 text-slate-300 font-arcade text-xs rounded-2xl flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
            <span>INDIAN ARENAS</span>
          </button>

          {/* 8. SETTINGS */}
          <button
            onClick={() => handleMenuClick(onOpenSettings)}
            className="group py-3 px-4 bg-slate-900/70 hover:bg-slate-800 active:scale-98 text-slate-300 font-arcade text-xs rounded-2xl flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>SETTINGS</span>
          </button>

          {/* 9. CREDITS */}
          <button
            onClick={() => handleMenuClick(onOpenCredits)}
            className="group py-3 px-4 bg-slate-900/70 hover:bg-slate-800 active:scale-98 text-slate-300 font-arcade text-xs rounded-2xl flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>CREDITS</span>
          </button>
        </div>
      </div>

      {/* Bottom Control Hint Banner */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs text-slate-400 font-sans pt-2 border-t border-slate-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Language: <b className="text-amber-400 uppercase font-arcade">{settings.language}</b></span>
        </div>

        <div className="hidden sm:block">
          WASD Move · Space Jump · J Attack · K Heavy · L Special · Esc Pause
        </div>

        <div className="text-[11px] text-slate-400">
          6 Fighters Unlocked · 6 Stages
        </div>
      </div>
    </div>
  );
};
