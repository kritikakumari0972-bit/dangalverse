/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProgress, GameSettings, CharacterId, ArenaId } from '../types/game';

const PROGRESS_KEY = 'dangalverse_player_progress_v1';
const SETTINGS_KEY = 'dangalverse_game_settings_v1';

const DEFAULT_PROGRESS: UserProgress = {
  coins: 150, // Starting bonus
  level: 1,
  xp: 0,
  totalMatches: 0,
  wins: 0,
  losses: 0,
  unlockedCharacters: [
    'chai_champ',
    'dhol_dynamo',
    'pani_puri_pro',
    'auto_ace',
    'cricket_commentator',
    'exam_topper',
  ],
  unlockedArenas: [
    'chaat_bazaar',
    'mumbai_festival',
    'jaipur_rooftops',
    'cricket_carnival',
    'college_fest',
  ],
  arcadeWins: 0,
  storyProgress: 0,
  highScore: 1250,
};

const DEFAULT_SETTINGS: GameSettings = {
  language: 'hinglish',
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  voiceVolume: 0.8,
  graphicsQuality: 'high',
  screenShake: true,
  hitStop: true,
  showHitboxes: false,
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      unlockedCharacters: parsed.unlockedCharacters || DEFAULT_PROGRESS.unlockedCharacters,
      unlockedArenas: parsed.unlockedArenas || DEFAULT_PROGRESS.unlockedArenas,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore localStorage write error
  }
}

export function addCoinsAndXP(
  current: UserProgress,
  coinsGained: number,
  xpGained: number,
  won: boolean
): UserProgress {
  let newXp = current.xp + xpGained;
  let newLevel = current.level;
  const xpNeeded = newLevel * 250;

  if (newXp >= xpNeeded) {
    newXp -= xpNeeded;
    newLevel += 1;
  }

  const updated: UserProgress = {
    ...current,
    coins: current.coins + coinsGained,
    xp: newXp,
    level: newLevel,
    totalMatches: current.totalMatches + 1,
    wins: won ? current.wins + 1 : current.wins,
    losses: won ? current.losses : current.losses + 1,
  };

  saveUserProgress(updated);
  return updated;
}

export function unlockCharacter(current: UserProgress, charId: CharacterId, cost: number): UserProgress | null {
  if (current.coins < cost) return null;
  if (current.unlockedCharacters.includes(charId)) return current;

  const updated: UserProgress = {
    ...current,
    coins: current.coins - cost,
    unlockedCharacters: [...current.unlockedCharacters, charId],
  };
  saveUserProgress(updated);
  return updated;
}

export function unlockArena(current: UserProgress, arenaId: ArenaId, cost: number): UserProgress | null {
  if (current.coins < cost) return null;
  if (current.unlockedArenas.includes(arenaId)) return current;

  const updated: UserProgress = {
    ...current,
    coins: current.coins - cost,
    unlockedArenas: [...current.unlockedArenas, arenaId],
  };
  saveUserProgress(updated);
  return updated;
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore error
  }
}
