/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CombatEngine } from '../game/CombatEngine';
import { RotateCcw, Zap, Shield, Swords } from 'lucide-react';

interface PracticePanelProps {
  engine: CombatEngine | null;
  onResetMeters: () => void;
}

export const PracticePanel: React.FC<PracticePanelProps> = ({ engine, onResetMeters }) => {
  return (
    <div className="absolute top-20 left-4 z-20 pointer-events-auto bg-slate-950/85 border-2 border-cyan-500/80 rounded-2xl p-3 font-comic text-xs space-y-2 shadow-xl backdrop-blur-xs max-w-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <span className="font-arcade text-cyan-400 font-bold">
          PRACTICE LAB
        </span>
        <span className="text-[10px] text-slate-400">Dummy Dojo</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onResetMeters}
          className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          <span>Refill Health</span>
        </button>

        <button
          onClick={() => {
            if (engine) {
              (engine as unknown as { p1Energy: number; p2Energy: number }).p1Energy = 100;
              (engine as unknown as { p1Energy: number; p2Energy: number }).p2Energy = 100;
            }
          }}
          className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
        >
          <Zap className="w-3 h-3 text-yellow-400" />
          <span>Max Super</span>
        </button>
      </div>

      <div className="text-[10px] text-slate-400 leading-tight">
        Test hitboxes, juggle combos, frame timings, and special ability cancel mechanics.
      </div>
    </div>
  );
};
