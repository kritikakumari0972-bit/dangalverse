/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CharacterDef, UserProgress, GameLanguage } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { soundManager } from '../audio/soundManager';
import { unlockCharacter } from '../utils/storage';
import {
  ArrowLeft,
  Volume2,
  Lock,
  Coins,
  MapPin,
  Flame,
  Activity,
  Shield,
  Laugh,
  Zap,
} from 'lucide-react';

interface CharacterCollectionModalProps {
  userProgress: UserProgress;
  language: GameLanguage;
  onUpdateProgress: (updated: UserProgress) => void;
  onBack: () => void;
}

export const CharacterCollectionModal: React.FC<CharacterCollectionModalProps> = ({
  userProgress,
  language,
  onUpdateProgress,
  onBack,
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterDef>(CHARACTERS[0]);

  const isUnlocked = (c: CharacterDef) =>
    c.unlocked || userProgress.unlockedCharacters.includes(c.id);

  const handleSelect = (c: CharacterDef) => {
    soundManager.playClick();
    setSelectedChar(c);
  };

  const handleUnlock = (c: CharacterDef) => {
    if (!c.unlockCost || userProgress.coins < c.unlockCost) return;
    const updated = unlockCharacter(userProgress, c.id, c.unlockCost);
    if (updated) {
      soundManager.playRoundGong();
      onUpdateProgress(updated);
    }
  };

  const handlePlayVoice = (c: CharacterDef) => {
    soundManager.playSelect();
    const phrase = c.voiceCatchphrase[language] || c.voiceCatchphrase.hinglish;
    soundManager.speakAnnouncer(phrase, language);
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
            CHARACTER COLLECTION
          </h1>
          <span className="text-xs text-slate-400">
            Fighter Lore, Backstories & Voice Quotes
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-amber-500/40 rounded-xl text-amber-400 font-arcade text-xs">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>{userProgress.coins}</span>
        </div>
      </div>

      {/* Roster & Details Split */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-4">
        {/* Left: Fighter List */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {CHARACTERS.map((char) => {
            const unlocked = isUnlocked(char);
            const isSelected = selectedChar.id === char.id;

            return (
              <div
                key={char.id}
                onClick={() => handleSelect(char)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 comic-shadow-amber scale-102 ring-2 ring-amber-400/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-16 h-16 rounded-2xl mb-2 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: `${char.primaryColor}25` }}
                >
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: char.primaryColor }}
                  />
                  {!unlocked && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                </div>
                <span className="font-arcade text-xs text-white line-clamp-1">{char.name}</span>
                <span className="text-[10px] text-slate-400">{char.hindiName}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Full Dossier */}
        <div className="lg:col-span-7 bg-slate-900 border-3 border-amber-500 rounded-3xl p-6 comic-shadow-amber">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-arcade text-2xl md:text-3xl text-amber-400 text-stroke-sm">
                  {selectedChar.name}
                </h2>
                <span className="text-base text-slate-400 font-bold">{selectedChar.hindiName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Home City: {selectedChar.homeCity}</span>
              </div>
            </div>

            {/* Voice Catchphrase Trigger */}
            <button
              onClick={() => handlePlayVoice(selectedChar)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 rounded-xl border border-slate-700 flex items-center gap-1.5 font-arcade text-xs cursor-pointer shadow transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>VOICE LINE</span>
            </button>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/40 mb-4">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Fighter Catchphrase:
            </span>
            <p className="text-white text-sm italic font-medium">
              "{selectedChar.voiceCatchphrase[language] || selectedChar.voiceCatchphrase.hinglish}"
            </p>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed mb-4">
            {selectedChar.bio}
          </p>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 mb-4">
            <div className="flex items-center gap-1.5 text-amber-400 font-arcade text-xs mb-1">
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-400" />
              <span>SUPER ABILITY: {selectedChar.specialAbilityName}</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {selectedChar.specialAbilityDesc}
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="text-slate-300 flex-1">Power</span>
              <span className="font-arcade text-amber-400">{selectedChar.stats.power}/10</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 flex-1">Speed</span>
              <span className="font-arcade text-amber-400">{selectedChar.stats.speed}/10</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 flex-1">Defense</span>
              <span className="font-arcade text-amber-400">{selectedChar.stats.defense}/10</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
              <Laugh className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300 flex-1">Comedy</span>
              <span className="font-arcade text-amber-400">{selectedChar.stats.comedy}/10</span>
            </div>
          </div>

          {/* Unlock button if locked */}
          {!isUnlocked(selectedChar) && selectedChar.unlockCost && (
            <button
              onClick={() => handleUnlock(selectedChar)}
              disabled={userProgress.coins < selectedChar.unlockCost}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-arcade text-sm rounded-xl flex items-center justify-center gap-2 border-2 border-yellow-300 shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coins className="w-4 h-4" />
              <span>UNLOCK FIGHTER FOR {selectedChar.unlockCost} COINS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
