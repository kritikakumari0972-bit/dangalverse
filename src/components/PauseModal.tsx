/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, HelpCircle } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onResume, onRestart, onExit }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-comic animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-3 border-amber-500 rounded-3xl p-6 comic-shadow-amber flex flex-col items-center text-center">
        <h2 className="font-arcade text-3xl md:text-4xl text-amber-400 text-stroke-sm mb-2">
          PAUSED
        </h2>
        <p className="text-slate-300 text-sm mb-6">
          Taking a breath before the next knockout punch?
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <button
            onClick={onResume}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-arcade text-lg rounded-xl flex items-center justify-center gap-2 border-2 border-yellow-300 shadow-md transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            RESUME MATCH
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-white font-arcade text-sm rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            RESTART ROUND
          </button>

          <button
            onClick={onExit}
            className="w-full py-3 bg-red-950/60 hover:bg-red-900/80 active:scale-98 text-red-200 font-arcade text-sm rounded-xl flex items-center justify-center gap-2 border border-red-800 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            EXIT TO MENU
          </button>
        </div>

        {/* Controls Quick Reference */}
        <div className="w-full bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-left text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Controls Guide:</span>
          </div>
          <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px]">
            <div><b className="text-white">A / D:</b> Move Left / Right</div>
            <div><b className="text-white">J:</b> Cartoon Attack</div>
            <div><b className="text-white">W / Space:</b> Jump</div>
            <div><b className="text-white">K:</b> Heavy Attack</div>
            <div><b className="text-white">S:</b> Crouch</div>
            <div><b className="text-white">L:</b> Super Special</div>
            <div><b className="text-white">U:</b> Defensive Block</div>
            <div><b className="text-white">Esc:</b> Pause Menu</div>
          </div>
        </div>
      </div>
    </div>
  );
};
