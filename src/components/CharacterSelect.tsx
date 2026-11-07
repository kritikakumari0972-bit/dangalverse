/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CharacterDef, GameMode, AIDifficulty, UserProgress } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { soundManager } from '../audio/soundManager';
import { unlockCharacter } from '../utils/storage';
import {
  ArrowLeft,
  Shuffle,
  Swords,
  Lock,
  Coins,
  Zap,
  Flame,
  Shield,
  Activity,
  Laugh,
  MapPin,
} from 'lucide-react';

interface CharacterSelectProps {
  mode: GameMode;
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onConfirmSelection: (p1: CharacterDef, p2: CharacterDef, difficulty: AIDifficulty) => void;
  onBack: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  mode,
  userProgress,
  onUpdateProgress,
  onConfirmSelection,
  onBack,
}) => {
  const [p1Index, setP1Index] = useState<number>(0);
  const [p2Index, setP2Index] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'p1' | 'p2'>('p1');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('normal');
  const [isVsTransition, setIsVsTransition] = useState<boolean>(false);

  const selectedChar = activeTab === 'p1' ? CHARACTERS[p1Index] : CHARACTERS[p2Index];
  const p1Char = CHARACTERS[p1Index];
  const p2Char = CHARACTERS[p2Index];

  const isCharUnlocked = (char: CharacterDef) => {
    return char.unlocked || userProgress.unlockedCharacters.includes(char.id);
  };

  const handleSelectChar = (index: number) => {
    const char = CHARACTERS[index];
    soundManager.playClick();

    if (!isCharUnlocked(char)) {
      // Try unlock with coins
      if (char.unlockCost && userProgress.coins >= char.unlockCost) {
        const updated = unlockCharacter(userProgress, char.id, char.unlockCost);
        if (updated) {
          onUpdateProgress(updated);
          soundManager.playSelect();
        }
      }
      return;
    }

    if (activeTab === 'p1') {
      setP1Index(index);
      if (mode === 'local_2p') {
        setActiveTab('p2');
      }
    } else {
      setP2Index(index);
    }
  };

  const handleRandomize = () => {
    soundManager.playSelect();
    const available = CHARACTERS.filter(isCharUnlocked);
    const rand = available[Math.floor(Math.random() * available.length)];
    const randIdx = CHARACTERS.findIndex((c) => c.id === rand.id);
    if (activeTab === 'p1') setP1Index(randIdx);
    else setP2Index(randIdx);
  };

  const handleStartFight = () => {
    if (!isCharUnlocked(p1Char) || !isCharUnlocked(p2Char)) return;
    soundManager.playRoundGong();
    setIsVsTransition(true);

    setTimeout(() => {
      onConfirmSelection(p1Char, p2Char, difficulty);
    }, 1600);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white font-comic overflow-y-auto select-none p-4 md:p-8 flex flex-col justify-between">
      {/* VS Splash Screen Transition */}
      {isVsTransition && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col md:flex-row items-center justify-between p-8 overflow-hidden animate-fade-in">
          {/* P1 Splash */}
          <div className="flex-1 flex flex-col items-center justify-center animate-slide-in-left">
            <span className="font-arcade text-3xl md:text-5xl text-amber-400 text-stroke-md mb-2">
              {p1Char.name}
            </span>
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center comic-shadow-amber relative overflow-hidden">
              <div
                className="w-36 h-36 rounded-full"
                style={{ backgroundColor: p1Char.primaryColor }}
              />
              <span className="absolute bottom-2 text-xs font-bold text-amber-300">
                {p1Char.homeCity}
              </span>
            </div>
          </div>

          {/* VS Center Emblem */}
          <div className="my-4 md:my-0 flex flex-col items-center justify-center animate-scale-up">
            <h1 className="font-arcade text-6xl md:text-9xl text-yellow-300 text-stroke-lg italic comic-shadow-lg tracking-wider transform -rotate-6">
              VS
            </h1>
            <span className="font-arcade text-sm md:text-base text-red-500 tracking-widest mt-2 uppercase">
              MAHADANGAL CLASH
            </span>
          </div>

          {/* P2 Splash */}
          <div className="flex-1 flex flex-col items-center justify-center animate-slide-in-right">
            <span className="font-arcade text-3xl md:text-5xl text-red-400 text-stroke-md mb-2">
              {p2Char.name}
            </span>
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-red-500/20 border-4 border-red-400 flex items-center justify-center comic-shadow-red relative overflow-hidden">
              <div
                className="w-36 h-36 rounded-full"
                style={{ backgroundColor: p2Char.primaryColor }}
              />
              <span className="absolute bottom-2 text-xs font-bold text-red-300">
                {p2Char.homeCity}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 flex items-center gap-2 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-arcade text-xs">BACK</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="font-arcade text-2xl md:text-4xl text-amber-400 text-stroke-sm tracking-wider">
            CHOOSE YOUR FIGHTER
          </h1>
          <span className="text-xs text-slate-400">
            {mode === 'local_2p'
              ? 'Player 1 & Player 2 Roster Selection'
              : 'Pick your character & battle the CPU opponent'}
          </span>
        </div>

        {/* Coin Balance */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-amber-500/40 rounded-xl text-amber-400 font-arcade text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{userProgress.coins}</span>
        </div>
      </div>

      {/* Main Selection Area: Left Roster Grid, Right Details Card */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Fighter Grid & Tabs */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Player Tab Selector (for Local 2P or selecting CPU) */}
          <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-4">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('p1');
              }}
              className={`flex-1 py-2 rounded-xl font-arcade text-xs transition-all cursor-pointer ${
                activeTab === 'p1'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PLAYER 1: {p1Char.name}
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab('p2');
              }}
              className={`flex-1 py-2 rounded-xl font-arcade text-xs transition-all cursor-pointer ${
                activeTab === 'p2'
                  ? 'bg-red-500 text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'local_2p' ? 'PLAYER 2' : 'CPU OPPONENT'}: {p2Char.name}
            </button>
          </div>

          {/* Fighter Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHARACTERS.map((char, index) => {
              const isUnlocked = isCharUnlocked(char);
              const isP1 = p1Index === index;
              const isP2 = p2Index === index;
              const isCurrent = (activeTab === 'p1' && isP1) || (activeTab === 'p2' && isP2);

              return (
                <div
                  key={char.id}
                  onClick={() => handleSelectChar(index)}
                  className={`group relative rounded-2xl p-3 border-2 transition-all cursor-pointer overflow-hidden flex flex-col items-center text-center ${
                    isCurrent
                      ? 'bg-slate-900 border-amber-400 comic-shadow-amber scale-102 ring-2 ring-amber-400/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:scale-101'
                  }`}
                >
                  {/* P1 / P2 Badges */}
                  <div className="absolute top-2 left-2 flex gap-1 z-10">
                    {isP1 && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-arcade font-black">
                        P1
                      </span>
                    )}
                    {isP2 && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-arcade font-black">
                        {mode === 'local_2p' ? 'P2' : 'CPU'}
                      </span>
                    )}
                  </div>

                  {/* Character Avatar Circle */}
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-slate-700/80 mb-2 flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${char.primaryColor}25` }}
                  >
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-inner"
                      style={{ backgroundColor: char.primaryColor }}
                    />
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-slate-400">
                        <Lock className="w-5 h-5 text-amber-400 mb-1" />
                        <span className="text-[10px] font-bold text-amber-400">{char.unlockCost} Coins</span>
                      </div>
                    )}
                  </div>

                  {/* Character Name & City */}
                  <span className="font-arcade text-xs text-white tracking-wider line-clamp-1">
                    {char.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans line-clamp-1">
                    {char.hindiName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Randomizer & Difficulty Options */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 p-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <button
              onClick={handleRandomize}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl text-xs font-arcade flex items-center gap-2 cursor-pointer transition-all border border-slate-700"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>RANDOM FIGHTER</span>
            </button>

            {mode !== 'local_2p' && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">CPU AI:</span>
                {(['easy', 'normal', 'hard'] as AIDifficulty[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      soundManager.playClick();
                      setDifficulty(lvl);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-arcade uppercase transition-all cursor-pointer ${
                      difficulty === lvl
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Fighter Profile & Stats Dossier */}
        <div className="lg:col-span-5 bg-slate-900 border-3 border-amber-500/80 rounded-3xl p-5 comic-shadow-amber flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-arcade text-2xl text-amber-400 text-stroke-sm">
                    {selectedChar.name}
                  </h2>
                  <span className="text-sm text-slate-400 font-bold">{selectedChar.hindiName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>{selectedChar.homeCity}</span>
                </div>
              </div>

              <span
                className="px-2.5 py-1 rounded-lg text-[10px] font-arcade font-bold border"
                style={{
                  backgroundColor: `${selectedChar.primaryColor}20`,
                  borderColor: selectedChar.primaryColor,
                  color: selectedChar.primaryColor,
                }}
              >
                {selectedChar.difficulty} Difficulty
              </span>
            </div>

            {/* Tagline & Bio */}
            <p className="text-amber-300 text-xs italic font-bold mb-2">
              "{selectedChar.tagline}"
            </p>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              {selectedChar.bio}
            </p>

            {/* Special Ability Card */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40 mb-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-arcade text-xs mb-1">
                <Zap className="w-4 h-4 fill-current text-yellow-400" />
                <span>SPECIAL: {selectedChar.specialAbilityName}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedChar.specialAbilityDesc}
              </p>
            </div>

            {/* Stats Radar / Bars */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Fighter Combat Attributes
              </span>

              {/* Power */}
              <div className="flex items-center text-xs">
                <div className="w-20 flex items-center gap-1 text-slate-300">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>Power</span>
                </div>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${selectedChar.stats.power * 10}%` }}
                  />
                </div>
                <span className="w-8 text-right font-arcade text-amber-400 text-[10px]">
                  {selectedChar.stats.power}/10
                </span>
              </div>

              {/* Speed */}
              <div className="flex items-center text-xs">
                <div className="w-20 flex items-center gap-1 text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Speed</span>
                </div>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${selectedChar.stats.speed * 10}%` }}
                  />
                </div>
                <span className="w-8 text-right font-arcade text-amber-400 text-[10px]">
                  {selectedChar.stats.speed}/10
                </span>
              </div>

              {/* Defense */}
              <div className="flex items-center text-xs">
                <div className="w-20 flex items-center gap-1 text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>Defense</span>
                </div>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${selectedChar.stats.defense * 10}%` }}
                  />
                </div>
                <span className="w-8 text-right font-arcade text-amber-400 text-[10px]">
                  {selectedChar.stats.defense}/10
                </span>
              </div>

              {/* Comedy Rating */}
              <div className="flex items-center text-xs">
                <div className="w-20 flex items-center gap-1 text-slate-300">
                  <Laugh className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Comedy</span>
                </div>
                <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${selectedChar.stats.comedy * 10}%` }}
                  />
                </div>
                <span className="w-8 text-right font-arcade text-amber-400 text-[10px]">
                  {selectedChar.stats.comedy}/10
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Lock In / Start Clash */}
          <button
            onClick={handleStartFight}
            disabled={!isCharUnlocked(p1Char) || !isCharUnlocked(p2Char)}
            className="w-full py-4 bg-linear-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 active:scale-98 text-slate-950 font-arcade text-lg md:text-xl rounded-2xl flex items-center justify-center gap-3 border-3 border-yellow-300 shadow-xl comic-shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Swords className="w-6 h-6 fill-current" />
            <span>FIGHT NOW!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
