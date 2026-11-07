/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';

interface CreditsModalProps {
  onBack: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onBack }) => {
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
            DANGALVERSE CREDITS
          </h1>
          <span className="text-xs text-slate-400">
            The Great Indian Cartoon Clash
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* Credits Card */}
      <div className="w-full max-w-2xl mx-auto bg-slate-900 border-3 border-amber-500 rounded-3xl p-6 md:p-8 comic-shadow-amber space-y-6 text-center">
        <div>
          <h2 className="font-arcade text-2xl text-yellow-400 mb-1">
            EXECUTIVE GAME DESIGN & DIRECTION
          </h2>
          <p className="text-sm text-slate-300">
            Dangalverse Creative Studios
          </p>
        </div>

        <div>
          <h3 className="font-arcade text-lg text-amber-400 mb-1">
            2D COMBAT ENGINE & PHASER INTEGRATION
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Phaser 3.90 HTML5 Canvas Arcade Physics Engine
            <br />
            Sub-millisecond frame data & Hitstop mechanics
          </p>
        </div>

        <div>
          <h3 className="font-arcade text-lg text-amber-400 mb-1">
            PROCEDURAL AUDIO & SOUND DESIGN
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Custom Web Audio API Sound Synthesizer & Indian Dholak Rhythm Sequencer
            <br />
            Web Speech Synthesis Commentary Engine
          </p>
        </div>

        <div>
          <h3 className="font-arcade text-lg text-amber-400 mb-1">
            CARTOON FIGHTERS & COMEDY CONCEPT
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Chai Champ · Dhol Dynamo · Pani Puri Pro · Auto Ace
            <br />
            Cricket Commentator · Exam Topper · Pehlwan Paaji · Bollywood Hero
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Dedicated to Indian Street Culture, Comedy & Cinema</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </div>
          <span className="text-[11px] text-slate-400">
            Version 1.0.0 · Made for pure browser gaming entertainment
          </span>
        </div>
      </div>

      <div className="w-full text-center py-4">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-arcade text-xs rounded-xl border border-yellow-300 shadow cursor-pointer"
        >
          RETURN TO MAIN MENU
        </button>
      </div>
    </div>
  );
};
