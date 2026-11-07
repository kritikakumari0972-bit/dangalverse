/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayerInputState } from '../types/game';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shield, Zap, Swords } from 'lucide-react';

interface MobileControlsProps {
  inputState: PlayerInputState;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ inputState }) => {
  const handleTouch = (key: keyof PlayerInputState, value: boolean) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inputState[key] = value;
  };

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none select-none flex items-end justify-between p-4 md:hidden z-30">
      {/* Left side: Directional D-Pad */}
      <div className="pointer-events-auto flex flex-col items-center gap-1">
        {/* Jump / Up */}
        <button
          onTouchStart={handleTouch('up', true)}
          onTouchEnd={handleTouch('up', false)}
          onMouseDown={handleTouch('up', true)}
          onMouseUp={handleTouch('up', false)}
          className="w-13 h-13 rounded-2xl bg-slate-900/80 active:bg-amber-500 border-2 border-slate-700 active:border-amber-400 flex items-center justify-center text-white active:text-slate-950 transition-colors shadow-lg active:scale-95"
        >
          <ArrowUp className="w-7 h-7" />
        </button>

        {/* Left & Right */}
        <div className="flex gap-4">
          <button
            onTouchStart={handleTouch('left', true)}
            onTouchEnd={handleTouch('left', false)}
            onMouseDown={handleTouch('left', true)}
            onMouseUp={handleTouch('left', false)}
            className="w-13 h-13 rounded-2xl bg-slate-900/80 active:bg-amber-500 border-2 border-slate-700 active:border-amber-400 flex items-center justify-center text-white active:text-slate-950 transition-colors shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-7 h-7" />
          </button>
          <button
            onTouchStart={handleTouch('right', true)}
            onTouchEnd={handleTouch('right', false)}
            onMouseDown={handleTouch('right', true)}
            onMouseUp={handleTouch('right', false)}
            className="w-13 h-13 rounded-2xl bg-slate-900/80 active:bg-amber-500 border-2 border-slate-700 active:border-amber-400 flex items-center justify-center text-white active:text-slate-950 transition-colors shadow-lg active:scale-95"
          >
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>

        {/* Crouch / Down */}
        <button
          onTouchStart={handleTouch('down', true)}
          onTouchEnd={handleTouch('down', false)}
          onMouseDown={handleTouch('down', true)}
          onMouseUp={handleTouch('down', false)}
          className="w-13 h-13 rounded-2xl bg-slate-900/80 active:bg-amber-500 border-2 border-slate-700 active:border-amber-400 flex items-center justify-center text-white active:text-slate-950 transition-colors shadow-lg active:scale-95"
        >
          <ArrowDown className="w-7 h-7" />
        </button>
      </div>

      {/* Right side: Action Buttons */}
      <div className="pointer-events-auto flex items-end gap-2">
        {/* Block */}
        <button
          onTouchStart={handleTouch('block', true)}
          onTouchEnd={handleTouch('block', false)}
          onMouseDown={handleTouch('block', true)}
          onMouseUp={handleTouch('block', false)}
          className="w-13 h-13 rounded-full bg-blue-900/80 active:bg-blue-500 border-2 border-blue-400 flex flex-col items-center justify-center text-blue-200 active:text-white transition-colors shadow-lg active:scale-95 mb-1"
        >
          <Shield className="w-5 h-5" />
          <span className="text-[9px] font-bold">BLOCK</span>
        </button>

        {/* Attack cluster */}
        <div className="flex flex-col gap-2">
          {/* Top: Special & Heavy */}
          <div className="flex gap-2">
            <button
              onTouchStart={handleTouch('special', true)}
              onTouchEnd={handleTouch('special', false)}
              onMouseDown={handleTouch('special', true)}
              onMouseUp={handleTouch('special', false)}
              className="w-14 h-14 rounded-full bg-purple-900/90 active:bg-purple-500 border-2 border-purple-400 flex flex-col items-center justify-center text-purple-200 active:text-white transition-colors shadow-lg active:scale-95"
            >
              <Zap className="w-6 h-6 text-yellow-300" />
              <span className="text-[9px] font-arcade font-bold">SUPER</span>
            </button>

            <button
              onTouchStart={handleTouch('heavyAttack', true)}
              onTouchEnd={handleTouch('heavyAttack', false)}
              onMouseDown={handleTouch('heavyAttack', true)}
              onMouseUp={handleTouch('heavyAttack', false)}
              className="w-14 h-14 rounded-full bg-red-900/90 active:bg-red-500 border-2 border-red-400 flex flex-col items-center justify-center text-red-200 active:text-white transition-colors shadow-lg active:scale-95"
            >
              <Swords className="w-6 h-6" />
              <span className="text-[9px] font-bold">HEAVY</span>
            </button>
          </div>

          {/* Bottom: Light Punch / Attack */}
          <button
            onTouchStart={handleTouch('attack', true)}
            onTouchEnd={handleTouch('attack', false)}
            onMouseDown={handleTouch('attack', true)}
            onMouseUp={handleTouch('attack', false)}
            className="w-20 h-15 rounded-2xl bg-amber-600 active:bg-amber-400 border-2 border-yellow-300 flex items-center justify-center text-slate-950 font-arcade font-black text-sm transition-colors shadow-lg active:scale-95 ml-auto"
          >
            ATTACK
          </button>
        </div>
      </div>
    </div>
  );
};
