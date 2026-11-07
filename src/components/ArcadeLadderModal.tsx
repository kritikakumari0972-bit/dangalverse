/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CharacterDef, ArenaDef } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { ARENAS } from '../data/arenas';
import { soundManager } from '../audio/soundManager';
import { ArrowLeft, Trophy, Swords, ShieldAlert, Award } from 'lucide-react';

interface ArcadeLadderModalProps {
  playerChar: CharacterDef;
  currentStage: number; // 1 to 5
  onStartStageFight: (p1: CharacterDef, p2: CharacterDef, arena: ArenaDef) => void;
  onBack: () => void;
}

export const ArcadeLadderModal: React.FC<ArcadeLadderModalProps> = ({
  playerChar,
  currentStage,
  onStartStageFight,
  onBack,
}) => {
  // 5 opponent ladder sequence
  const ladderOpponents = [
    CHARACTERS.find((c) => c.id === 'dhol_dynamo') || CHARACTERS[1],
    CHARACTERS.find((c) => c.id === 'pani_puri_pro') || CHARACTERS[2],
    CHARACTERS.find((c) => c.id === 'auto_ace') || CHARACTERS[3],
    CHARACTERS.find((c) => c.id === 'exam_topper') || CHARACTERS[5],
    CHARACTERS.find((c) => c.id === 'cricket_commentator') || CHARACTERS[4],
  ];

  const currentOpponent = ladderOpponents[Math.min(currentStage - 1, 4)];
  const currentArena = ARENAS[(currentStage - 1) % ARENAS.length];

  const handleFight = () => {
    soundManager.playRoundGong();
    onStartStageFight(playerChar, currentOpponent, currentArena);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white font-comic overflow-y-auto select-none p-4 md:p-8 flex flex-col justify-between">
      {/* Top Header */}
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
            ARCADE TOURNAMENT LADDER
          </h1>
          <span className="text-xs text-slate-400">
            Stage {currentStage} of 5 · Fight your way to the All-India Championship!
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-amber-500/40 rounded-xl text-amber-400 font-arcade text-xs">
          <Trophy className="w-4 h-4" />
          <span>STAGE {currentStage}/5</span>
        </div>
      </div>

      {/* Ladder Tree / Map */}
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center space-y-3 mb-6">
        {ladderOpponents.map((opp, idx) => {
          const stageNum = idx + 1;
          const isCurrent = currentStage === stageNum;
          const isCleared = currentStage > stageNum;
          const isUpcoming = currentStage < stageNum;

          return (
            <div
              key={opp.id}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                isCurrent
                  ? 'bg-slate-900 border-amber-400 comic-shadow-amber scale-102 ring-2 ring-amber-400/50'
                  : isCleared
                  ? 'bg-slate-900/40 border-emerald-600/50 opacity-70'
                  : 'bg-slate-900/20 border-slate-800 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-arcade text-sm font-bold ${
                    isCleared
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCleared ? '✓' : `S${stageNum}`}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-arcade text-base text-white">
                      {stageNum === 5 ? '★ GRAND FINALE: ' + opp.name : opp.name}
                    </span>
                    {stageNum === 5 && (
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white font-arcade text-[9px]">
                        BOSS
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-sans">
                    {opp.tagline}
                  </span>
                </div>
              </div>

              {isCurrent && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-400 font-arcade animate-pulse hidden sm:inline">
                    NEXT OPPONENT
                  </span>
                  <button
                    onClick={handleFight}
                    className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-arcade text-xs rounded-xl flex items-center gap-2 border-2 border-yellow-300 shadow-lg cursor-pointer"
                  >
                    <Swords className="w-4 h-4 fill-current" />
                    <span>START BATTLE</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Championship Trophy Banner Bottom */}
      <div className="w-full max-w-3xl mx-auto p-4 bg-slate-900 border-2 border-amber-500/60 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-400" />
          <div>
            <span className="font-arcade text-sm text-amber-400 block">
              Mahadangal Gold Cup
            </span>
            <span className="text-xs text-slate-400">
              Win 5 consecutive stages to claim 500 Coins & unlock secret characters!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
