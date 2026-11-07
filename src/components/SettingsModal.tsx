/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameSettings, GameLanguage, GraphicsQuality } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { ArrowLeft, Volume2, Globe, Monitor, Zap, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetData: () => void;
  onBack: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onBack,
}) => {
  const handleVolumeChange = (key: keyof GameSettings, value: number) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
    soundManager.setVolumes(
      updated.masterVolume,
      updated.musicVolume,
      updated.sfxVolume,
      updated.voiceVolume
    );
  };

  const handleLanguageChange = (lang: GameLanguage) => {
    soundManager.playClick();
    onUpdateSettings({ ...settings, language: lang });
    soundManager.speakAnnouncer(
      lang === 'hindi' ? 'हिंदी भाषा चुनी गई!' : lang === 'hinglish' ? 'Hinglish mode active!' : 'English selected!',
      lang
    );
  };

  const handleToggle = (key: 'screenShake' | 'hitStop' | 'showHitboxes') => {
    soundManager.playClick();
    onUpdateSettings({ ...settings, [key]: !settings[key] });
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
            GAME SETTINGS
          </h1>
          <span className="text-xs text-slate-400">
            Audio, Commentary Language, and Visual Polish
          </span>
        </div>

        <div className="w-16" />
      </div>

      {/* Main Settings Card */}
      <div className="w-full max-w-2xl mx-auto flex-1 space-y-5 mb-6">
        {/* Language Selection */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-amber-400" />
            <span className="font-arcade text-sm text-white">
              COMMENTARY & DIALOGUE LANGUAGE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { id: 'hinglish', label: 'HINGLISH', sub: 'देसी Mix' },
                { id: 'hindi', label: 'HINDI', sub: 'शुद्ध हिंदी' },
                { id: 'english', label: 'ENGLISH', sub: 'Arcade Classic' },
              ] as { id: GameLanguage; label: string; sub: string }[]
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleLanguageChange(opt.id)}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer ${
                  settings.language === opt.id
                    ? 'bg-amber-500 border-yellow-300 text-slate-950 font-black shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="font-arcade text-xs">{opt.label}</span>
                <span className="text-[10px] opacity-80">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Volume Sliders */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <span className="font-arcade text-sm text-white">AUDIO CONTROLS</span>
          </div>

          {/* Master Volume */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Master Volume</span>
              <span className="font-arcade text-amber-400">
                {Math.round(settings.masterVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => handleVolumeChange('masterVolume', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>BGM Arcade Music</span>
              <span className="font-arcade text-amber-400">
                {Math.round(settings.musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => handleVolumeChange('musicVolume', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Combat Sound Effects (SFX)</span>
              <span className="font-arcade text-amber-400">
                {Math.round(settings.sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => {
                handleVolumeChange('sfxVolume', parseFloat(e.target.value));
                soundManager.playClick();
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Voice Commentary */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Voice Announcer & Shouts</span>
              <span className="font-arcade text-amber-400">
                {Math.round(settings.voiceVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.voiceVolume}
              onChange={(e) => handleVolumeChange('voiceVolume', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Visual & Screen Effects */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-amber-400" />
            <span className="font-arcade text-sm text-white">VISUAL JUICE & PERFORMANCE</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-sm font-bold text-white block">Camera Shake</span>
              <span className="text-xs text-slate-400">
                Decaying screen vibration on heavy attacks & specials
              </span>
            </div>
            <button
              onClick={() => handleToggle('screenShake')}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                settings.screenShake ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  settings.screenShake ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-sm font-bold text-white block">Impact Hitstop</span>
              <span className="text-xs text-slate-400">
                Micro-freeze frame on heavy blows for maximum arcade weight
              </span>
            </div>
            <button
              onClick={() => handleToggle('hitStop')}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                settings.hitStop ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  settings.hitStop ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Save Data */}
        <div className="p-4 rounded-3xl bg-red-950/30 border border-red-900/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-300 block">Reset Local Save Data</span>
            <span className="text-[11px] text-red-400/80">
              Clear coins, unlocks and match records back to default
            </span>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all progress and coins?')) {
                onResetData();
              }
            }}
            className="px-3.5 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-200 text-xs font-arcade rounded-xl border border-red-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DATA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
