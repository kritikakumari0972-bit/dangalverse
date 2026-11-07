/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CharacterDef, ArenaDef, UserProgress, GameLanguage } from '../types/game';
import { STORY_CHAPTERS, StoryChapter } from '../data/story';
import { CHARACTERS } from '../data/characters';
import { ARENAS } from '../data/arenas';
import { soundManager } from '../audio/soundManager';
import { ArrowLeft, BookOpen, ChevronRight, Swords, Coins, CheckCircle, Sparkles } from 'lucide-react';

interface StoryModeModalProps {
  userProgress: UserProgress;
  language: GameLanguage;
  onStartChapterFight: (p1: CharacterDef, p2: CharacterDef, arena: ArenaDef, chapterId: number) => void;
  onBack: () => void;
}

export const StoryModeModal: React.FC<StoryModeModalProps> = ({
  userProgress,
  language,
  onStartChapterFight,
  onBack,
}) => {
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(
    Math.min(userProgress.storyProgress, STORY_CHAPTERS.length - 1)
  );
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);
  const [viewingCutscene, setViewingCutscene] = useState<boolean>(false);

  const chapter: StoryChapter = STORY_CHAPTERS[selectedChapterIdx];
  const p1Char = CHARACTERS.find((c) => c.id === 'chai_champ') || CHARACTERS[0];
  const p2Char = CHARACTERS.find((c) => c.id === chapter.opponentId) || CHARACTERS[1];
  const arena = ARENAS.find((a) => a.id === chapter.arenaId) || ARENAS[0];

  const currentDialogue = chapter.introDialogues[dialogueIdx];
  const isLastDialogue = dialogueIdx >= chapter.introDialogues.length - 1;

  const handleStartCutscene = (idx: number) => {
    soundManager.playClick();
    setSelectedChapterIdx(idx);
    setDialogueIdx(0);
    setViewingCutscene(true);
  };

  const handleNextDialogue = () => {
    soundManager.playClick();
    if (isLastDialogue) {
      // Launch chapter fight!
      soundManager.playRoundGong();
      onStartChapterFight(p1Char, p2Char, arena, chapter.id);
    } else {
      setDialogueIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 text-white font-comic overflow-y-auto select-none p-4 md:p-8 flex flex-col justify-between">
      {/* Cutscene Visual Novel Overlay */}
      {viewingCutscene && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between p-6 md:p-12 animate-fade-in">
          {/* Top Stage Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="font-arcade text-lg md:text-xl text-amber-400">
                {chapter.title}
              </h2>
            </div>
            <button
              onClick={() => {
                soundManager.playRoundGong();
                onStartChapterFight(p1Char, p2Char, arena, chapter.id);
              }}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-white rounded-lg border border-slate-700 cursor-pointer"
            >
              SKIP CUTSCENE &gt;&gt;
            </button>
          </div>

          {/* Comic Stage Center: Two Face-to-Face Fighter Avatars */}
          <div className="flex-1 flex items-center justify-around my-6">
            {/* Speaker Left: Chai Champ */}
            <div
              className={`flex flex-col items-center transition-all duration-300 ${
                currentDialogue.speaker === 'Chai Champ'
                  ? 'scale-110 opacity-100'
                  : 'scale-90 opacity-40'
              }`}
            >
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-3xl bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center comic-shadow-amber relative overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-amber-500" />
              </div>
              <span className="font-arcade text-base md:text-xl text-amber-400 mt-2">
                Chai Champ
              </span>
            </div>

            {/* VS Shockwave Divider */}
            <div className="text-3xl md:text-5xl font-arcade text-red-500 italic transform -rotate-12">
              ⚡
            </div>

            {/* Speaker Right: Opponent */}
            <div
              className={`flex flex-col items-center transition-all duration-300 ${
                currentDialogue.speaker !== 'Chai Champ'
                  ? 'scale-110 opacity-100'
                  : 'scale-90 opacity-40'
              }`}
            >
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-3xl bg-red-500/20 border-4 border-red-400 flex items-center justify-center comic-shadow-red relative overflow-hidden">
                <div
                  className="w-24 h-24 rounded-full"
                  style={{ backgroundColor: p2Char.primaryColor }}
                />
              </div>
              <span className="font-arcade text-base md:text-xl text-red-400 mt-2">
                {p2Char.name}
              </span>
            </div>
          </div>

          {/* Bottom Speech Box */}
          <div className="w-full max-w-4xl mx-auto bg-slate-900 border-3 border-amber-500 rounded-3xl p-6 comic-shadow-amber flex flex-col justify-between">
            <div>
              <span className="font-arcade text-sm text-yellow-400 uppercase tracking-wider block mb-2">
                {currentDialogue.speaker}
              </span>
              <p className="text-white text-base md:text-xl leading-relaxed font-medium">
                "{language === 'hindi' ? currentDialogue.hindiText : currentDialogue.text}"
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleNextDialogue}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-arcade text-sm rounded-xl flex items-center gap-2 border-2 border-yellow-300 shadow-md cursor-pointer"
              >
                <span>{isLastDialogue ? 'ENTER DANGAL!' : 'NEXT'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chapter Selection View */}
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
            STORY MODE: MAHADANGAL
          </h1>
          <span className="text-xs text-slate-400">
            Follow Chai Champ's hilarious quest across India for the Golden Chai Trophy!
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-amber-500/40 rounded-xl text-amber-400 font-arcade text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{userProgress.coins}</span>
        </div>
      </div>

      {/* Chapters List */}
      <div className="w-full max-w-4xl mx-auto flex-1 space-y-4 mb-6">
        {STORY_CHAPTERS.map((chap, idx) => {
          const isCompleted = userProgress.storyProgress > idx;
          const isAvailable = userProgress.storyProgress >= idx;
          const oppChar = CHARACTERS.find((c) => c.id === chap.opponentId);

          return (
            <div
              key={chap.id}
              onClick={() => isAvailable && handleStartCutscene(idx)}
              className={`p-5 rounded-3xl border-3 transition-all flex items-center justify-between gap-4 ${
                isAvailable
                  ? 'bg-slate-900/90 border-amber-500/80 hover:border-amber-400 cursor-pointer comic-shadow-amber'
                  : 'bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-arcade text-xl ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : isAvailable
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-7 h-7" /> : chap.id}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-arcade text-base md:text-xl text-white">
                      {chap.title}
                    </h3>
                  </div>
                  <span className="text-xs text-amber-400 font-bold block">
                    {chap.subtitle} · Rival: {oppChar?.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1 text-xs font-arcade text-yellow-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Coins className="w-3.5 h-3.5" />
                  <span>+{chap.coinReward} Coins</span>
                </div>

                {isAvailable && (
                  <button className="px-4 py-2 bg-amber-500 text-slate-950 font-arcade text-xs rounded-xl flex items-center gap-1.5 border border-yellow-300 shadow">
                    <Swords className="w-3.5 h-3.5" />
                    <span>PLAY</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
