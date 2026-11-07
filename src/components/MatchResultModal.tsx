/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { CharacterDef, MatchStats, GameLanguage } from '../types/game';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Users, Home, Coins, Flame } from 'lucide-react';

interface MatchResultModalProps {
  stats: MatchStats;
  p1Char: CharacterDef;
  p2Char: CharacterDef;
  isP1Human: boolean;
  language: GameLanguage;
  onRematch: () => void;
  onSelectCharacter: () => void;
  onMainMenu: () => void;
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({
  stats,
  p1Char,
  p2Char,
  isP1Human,
  language,
  onRematch,
  onSelectCharacter,
  onMainMenu,
}) => {
  const isP1Winner = stats.winner === 1;
  const isPlayerWinner = isP1Human ? isP1Winner : stats.winner === 2;
  const winnerChar = isP1Winner ? p1Char : p2Char;

  // Pick random victory quote for the winning character
  const quotes = winnerChar.victoryQuotes[language] || winnerChar.victoryQuotes.hinglish;
  const victoryQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    if (isPlayerWinner) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899'],
      });
    }
  }, [isPlayerWinner]);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-comic animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-4 border-amber-500 rounded-3xl p-6 md:p-8 comic-shadow-amber flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className={`absolute -top-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isPlayerWinner ? 'bg-amber-500' : 'bg-red-600'
          }`}
        />

        {/* Victory Header */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-3 rounded-2xl bg-slate-950 border-2 border-amber-400 mb-3 comic-shadow">
            <Trophy
              className={`w-10 h-10 ${
                isPlayerWinner ? 'text-amber-400 animate-bounce' : 'text-slate-500'
              }`}
            />
          </div>

          <h2
            className={`font-arcade text-4xl md:text-5xl text-stroke-md tracking-wider mb-1 ${
              isPlayerWinner ? 'text-yellow-400' : 'text-red-400'
            }`}
          >
            {isPlayerWinner ? 'VICTORY!' : 'DEFEATED!'}
          </h2>

          <p className="text-amber-300 text-lg font-bold">
            {winnerChar.name} WINS THE DANGAL!
          </p>
        </div>

        {/* Winner Dialogue Speech Bubble */}
        <div className="relative z-10 w-full my-4 bg-slate-950/80 border-2 border-amber-500/80 rounded-2xl p-4 shadow-inner">
          <span className="text-xs uppercase text-amber-400 font-bold tracking-wider block mb-1">
            💬 {winnerChar.name} says:
          </span>
          <p className="text-white text-base md:text-lg italic font-medium">
            "{victoryQuote}"
          </p>
        </div>

        {/* Match Statistics */}
        <div className="relative z-10 w-full grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-xs text-slate-400">Total Damage Dealt</span>
            <span className="text-xl font-arcade text-amber-400">
              {stats.totalDamageP1}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-xs text-slate-400">Max Combo Streak</span>
            <div className="flex items-center gap-1 text-xl font-arcade text-yellow-400">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{stats.maxComboP1}x Hits</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-xs text-slate-400">Match Duration</span>
            <span className="text-lg font-arcade text-slate-200">
              {stats.matchDurationSeconds}s
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 flex flex-col items-center">
            <span className="text-xs text-slate-400">Rewards Gained</span>
            <div className="flex items-center gap-1.5 text-lg font-arcade text-emerald-400">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>+{stats.coinsEarned} Coins</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 w-full flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRematch}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-arcade text-sm rounded-xl flex items-center justify-center gap-2 border-2 border-yellow-300 shadow-md cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            REMATCH
          </button>

          <button
            onClick={onSelectCharacter}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-white font-arcade text-sm rounded-xl flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-all"
          >
            <Users className="w-4 h-4" />
            SELECT FIGHTER
          </button>

          <button
            onClick={onMainMenu}
            className="sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 hover:text-white font-arcade text-sm rounded-xl flex items-center justify-center cursor-pointer transition-all"
            title="Main Menu"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
