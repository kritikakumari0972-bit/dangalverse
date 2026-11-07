/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Phaser from 'phaser';
import {
  CharacterDef,
  ArenaDef,
  GameMode,
  AIDifficulty,
  MatchStats,
  GameSettings,
  UserProgress,
} from './types/game';
import { CHARACTERS } from './data/characters';
import { ARENAS } from './data/arenas';
import { soundManager } from './audio/soundManager';
import {
  loadUserProgress,
  saveUserProgress,
  addCoinsAndXP,
  loadSettings,
  saveSettings,
} from './utils/storage';
import { CombatEngine, CombatHUDState } from './game/CombatEngine';

// Components
import { MainMenu } from './components/MainMenu';
import { CharacterSelect } from './components/CharacterSelect';
import { ArenaSelect } from './components/ArenaSelect';
import { FightHUD } from './components/FightHUD';
import { MobileControls } from './components/MobileControls';
import { PauseModal } from './components/PauseModal';
import { MatchResultModal } from './components/MatchResultModal';
import { StoryModeModal } from './components/StoryModeModal';
import { ArcadeLadderModal } from './components/ArcadeLadderModal';
import { CharacterCollectionModal } from './components/CharacterCollectionModal';
import { SettingsModal } from './components/SettingsModal';
import { CreditsModal } from './components/CreditsModal';
import { PracticePanel } from './components/PracticePanel';

type Screen =
  | 'menu'
  | 'character_select'
  | 'arena_select'
  | 'story_mode'
  | 'arcade_ladder'
  | 'collection'
  | 'settings'
  | 'credits'
  | 'playing';

export default function App() {
  // Navigation & Game State
  const [screen, setScreen] = useState<Screen>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('vs_cpu');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('normal');
  const [arcadeStage, setArcadeStage] = useState<number>(1);
  const [activeStoryChapter, setActiveStoryChapter] = useState<number>(1);

  // Selected Fighters & Arena
  const [p1Char, setP1Char] = useState<CharacterDef>(CHARACTERS[0]);
  const [p2Char, setP2Char] = useState<CharacterDef>(CHARACTERS[3]); // Auto Ace
  const [currentArena, setCurrentArena] = useState<ArenaDef>(ARENAS[0]);

  // Settings & User Progress
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [userProgress, setUserProgress] = useState<UserProgress>(() => loadUserProgress());
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Combat runtime state
  const [hudState, setHudState] = useState<CombatHUDState | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<MatchStats | null>(null);

  // Phaser Game reference
  const gameRef = useRef<Phaser.Game | null>(null);
  const combatEngineRef = useRef<CombatEngine | null>(null);

  // Sync settings audio on mount
  useEffect(() => {
    soundManager.setVolumes(
      settings.masterVolume,
      settings.musicVolume,
      settings.sfxVolume,
      settings.voiceVolume
    );
  }, [settings]);

  // ESC key to Pause/Resume during fight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && screen === 'playing' && !matchResult) {
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, matchResult]);

  // Keep references for values accessed inside game callbacks
  const userProgressRef = useRef(userProgress);
  userProgressRef.current = userProgress;
  const gameModeRef = useRef(gameMode);
  gameModeRef.current = gameMode;
  const activeStoryChapterRef = useRef(activeStoryChapter);
  activeStoryChapterRef.current = activeStoryChapter;
  const arcadeStageRef = useRef(arcadeStage);
  arcadeStageRef.current = arcadeStage;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Initialize Phaser Game when entering 'playing' screen
  useEffect(() => {
    if (screen !== 'playing') {
      if (gameRef.current) {
        soundManager.stopBGM();
        try {
          gameRef.current.destroy(true);
        } catch {
          // Ignore destroy error
        }
        gameRef.current = null;
        combatEngineRef.current = null;
      }
      return;
    }

    const container = document.getElementById('phaser-game-canvas');
    if (!container) return;

    // Clean previous canvases to avoid duplicate WebGL viewports
    container.innerHTML = '';

    const engine = new CombatEngine();
    combatEngineRef.current = engine;

    engine.onHUDUpdate = (hud) => {
      setHudState({ ...hud });
    };

    engine.onMatchEnd = (stats) => {
      setMatchResult(stats);
      // Award Coins and XP
      const won = stats.winner === 1;
      const currentProg = userProgressRef.current;
      const updated = addCoinsAndXP(
        currentProg,
        stats.coinsEarned,
        won ? 150 : 50,
        won
      );
      setUserProgress(updated);

      // Handle Story progression
      if (gameModeRef.current === 'story' && won && activeStoryChapterRef.current > currentProg.storyProgress) {
        const nextProg = {
          ...updated,
          storyProgress: activeStoryChapterRef.current,
        };
        setUserProgress(nextProg);
        saveUserProgress(nextProg);
      }

      // Handle Arcade ladder progression
      if (gameModeRef.current === 'arcade' && won && arcadeStageRef.current < 5) {
        setArcadeStage((prev) => prev + 1);
      }
    };

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'phaser-game-canvas',
      width: 1280,
      height: 720,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: settingsRef.current.showHitboxes,
        },
      },
      scene: [engine],
      backgroundColor: '#090a16',
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    const startPayload = {
      p1Char,
      p2Char,
      arena: currentArena,
      mode: gameMode,
      difficulty,
      settings: settingsRef.current,
    };

    if (game.isBooted) {
      game.scene.start('CombatEngine', startPayload);
    } else {
      game.events.once('ready', () => {
        game.scene.start('CombatEngine', startPayload);
      });
    }

    return () => {
      soundManager.stopBGM();
      try {
        game.destroy(true);
      } catch {
        // Safe destroy
      }
      gameRef.current = null;
      combatEngineRef.current = null;
    };
  }, [screen, p1Char, p2Char, currentArena, gameMode, difficulty]);

  // Mode Selection Handlers
  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setMatchResult(null);
    setIsPaused(false);

    if (mode === 'story') {
      setScreen('story_mode');
    } else if (mode === 'arcade') {
      setArcadeStage(1);
      setScreen('arcade_ladder');
    } else {
      // vs_cpu, local_2p, practice
      setScreen('character_select');
    }
  };

  const handleConfirmCharacters = (p1: CharacterDef, p2: CharacterDef, diff: AIDifficulty) => {
    setP1Char(p1);
    setP2Char(p2);
    setDifficulty(diff);
    setMatchResult(null);
    setIsPaused(false);
    setScreen('playing');
  };

  const handleStartChapterFight = (
    p1: CharacterDef,
    p2: CharacterDef,
    arena: ArenaDef,
    chapterId: number
  ) => {
    setP1Char(p1);
    setP2Char(p2);
    setCurrentArena(arena);
    setActiveStoryChapter(chapterId);
    setMatchResult(null);
    setIsPaused(false);
    setScreen('playing');
  };

  const handleStartArcadeStage = (
    p1: CharacterDef,
    p2: CharacterDef,
    arena: ArenaDef
  ) => {
    setP1Char(p1);
    setP2Char(p2);
    setCurrentArena(arena);
    setMatchResult(null);
    setIsPaused(false);
    setScreen('playing');
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleRematch = () => {
    setMatchResult(null);
    setIsPaused(false);
    if (combatEngineRef.current) {
      combatEngineRef.current.restartMatch();
    }
  };

  const handleResetSaveData = () => {
    localStorage.removeItem('dangalverse_player_progress_v1');
    const fresh = loadUserProgress();
    setUserProgress(fresh);
    soundManager.playRoundGong();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-comic flex items-center justify-center select-none">
      {/* 1. Main Menu Screen */}
      {screen === 'menu' && (
        <MainMenu
          userProgress={userProgress}
          settings={settings}
          onSelectMode={handleSelectMode}
          onOpenCollection={() => setScreen('collection')}
          onOpenArenas={() => setScreen('arena_select')}
          onOpenSettings={() => setScreen('settings')}
          onOpenCredits={() => setScreen('credits')}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. Character Select Screen */}
      {screen === 'character_select' && (
        <CharacterSelect
          mode={gameMode}
          userProgress={userProgress}
          onUpdateProgress={(updated) => {
            setUserProgress(updated);
            saveUserProgress(updated);
          }}
          onConfirmSelection={handleConfirmCharacters}
          onBack={() => setScreen('menu')}
        />
      )}

      {/* 3. Arena Select Screen */}
      {screen === 'arena_select' && (
        <ArenaSelect
          currentArena={currentArena}
          userProgress={userProgress}
          onUpdateProgress={(updated) => {
            setUserProgress(updated);
            saveUserProgress(updated);
          }}
          onSelectArena={(arena) => setCurrentArena(arena)}
          onBack={() => setScreen('menu')}
        />
      )}

      {/* 4. Story Mode Screen */}
      {screen === 'story_mode' && (
        <StoryModeModal
          userProgress={userProgress}
          language={settings.language}
          onStartChapterFight={handleStartChapterFight}
          onBack={() => setScreen('menu')}
        />
      )}

      {/* 5. Arcade Ladder Screen */}
      {screen === 'arcade_ladder' && (
        <ArcadeLadderModal
          playerChar={p1Char}
          currentStage={arcadeStage}
          onStartStageFight={handleStartArcadeStage}
          onBack={() => setScreen('menu')}
        />
      )}

      {/* 6. Character Collection Screen */}
      {screen === 'collection' && (
        <CharacterCollectionModal
          userProgress={userProgress}
          language={settings.language}
          onUpdateProgress={(updated) => {
            setUserProgress(updated);
            saveUserProgress(updated);
          }}
          onBack={() => setScreen('menu')}
        />
      )}

      {/* 7. Settings Screen */}
      {screen === 'settings' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
            saveSettings(newSettings);
          }}
          onResetData={handleResetSaveData}
          onBack={() => setScreen('menu')}
        />
      )}

      {/* 8. Credits Screen */}
      {screen === 'credits' && (
        <CreditsModal onBack={() => setScreen('menu')} />
      )}

      {/* 9. Active Gameplay Viewport */}
      {screen === 'playing' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* Phaser Canvas Viewport */}
          <div
            id="phaser-game-canvas"
            className="w-full h-full flex items-center justify-center"
          />

          {/* Combat HUD Overlay */}
          {hudState && (
            <FightHUD
              hud={hudState}
              p1Char={p1Char}
              p2Char={p2Char}
              onPause={() => setIsPaused(true)}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onTriggerSpecialP1={() => {
                if (combatEngineRef.current) {
                  combatEngineRef.current.p1Input.special = true;
                }
              }}
            />
          )}

          {/* Mobile On-Screen Controls */}
          {combatEngineRef.current && (
            <MobileControls inputState={combatEngineRef.current.p1Input} />
          )}

          {/* Practice Mode Controls Overlay */}
          {gameMode === 'practice' && (
            <PracticePanel
              engine={combatEngineRef.current}
              onResetMeters={() => {
                if (combatEngineRef.current) {
                  (combatEngineRef.current as unknown as { p1Health: number; p2Health: number }).p1Health = 100;
                  (combatEngineRef.current as unknown as { p1Health: number; p2Health: number }).p2Health = 100;
                }
              }}
            />
          )}

          {/* Pause Modal */}
          {isPaused && (
            <PauseModal
              onResume={() => setIsPaused(false)}
              onRestart={() => {
                setIsPaused(false);
                handleRematch();
              }}
              onExit={() => {
                setIsPaused(false);
                setScreen('menu');
              }}
            />
          )}

          {/* Match Result / KO Modal */}
          {matchResult && (
            <MatchResultModal
              stats={matchResult}
              p1Char={p1Char}
              p2Char={p2Char}
              isP1Human={true}
              language={settings.language}
              onRematch={handleRematch}
              onSelectCharacter={() => {
                setMatchResult(null);
                setScreen('character_select');
              }}
              onMainMenu={() => {
                setMatchResult(null);
                setScreen('menu');
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
