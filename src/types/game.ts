/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharacterId =
  | 'chai_champ'
  | 'dhol_dynamo'
  | 'pani_puri_pro'
  | 'auto_ace'
  | 'cricket_commentator'
  | 'exam_topper'
  | 'pehlwan_paaji'
  | 'bollywood_hero';

export type ArenaId =
  | 'chaat_bazaar'
  | 'mumbai_festival'
  | 'jaipur_rooftops'
  | 'cricket_carnival'
  | 'college_fest'
  | 'desi_cinema';

export type GameMode =
  | 'arcade'
  | 'story'
  | 'vs_cpu'
  | 'local_2p'
  | 'practice';

export type AIDifficulty = 'easy' | 'normal' | 'hard';

export type GameLanguage = 'hinglish' | 'hindi' | 'english';

export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface FighterStats {
  power: number; // 1-10
  speed: number; // 1-10
  defense: number; // 1-10
  range: number; // 1-10
  comedy: number; // 1-10
}

export interface CharacterDef {
  id: CharacterId;
  name: string;
  hindiName: string;
  tagline: string;
  bio: string;
  homeCity: string;
  specialAbilityName: string;
  specialAbilityDesc: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  unlocked: boolean;
  unlockCost?: number;
  stats: FighterStats;
  voiceCatchphrase: {
    hinglish: string;
    hindi: string;
    english: string;
  };
  victoryQuotes: {
    hinglish: string[];
    hindi: string[];
    english: string[];
  };
  defeatQuotes: {
    hinglish: string[];
    hindi: string[];
    english: string[];
  };
}

export interface ArenaDef {
  id: ArenaId;
  name: string;
  hindiName: string;
  location: string;
  tagline: string;
  bgColor: string;
  groundColor: string;
  accentColor: string;
  parallaxTheme: 'bazaar' | 'festival' | 'rooftop' | 'stadium' | 'campus' | 'cinema';
  crowdCheer: string;
  unlocked: boolean;
  unlockCost?: number;
}

export interface PlayerInputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
  heavyAttack: boolean;
  special: boolean;
  block: boolean;
}

export interface FighterState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 'left' | 'right';
  health: number;
  maxHealth: number;
  energy: number; // 0 - 100 for Super Move
  state:
    | 'idle'
    | 'walk'
    | 'jump'
    | 'crouch'
    | 'attack'
    | 'heavyAttack'
    | 'special'
    | 'block'
    | 'hurt'
    | 'knockdown'
    | 'victory'
    | 'defeat';
  comboCount: number;
  isBlocking: boolean;
  isGrounded: boolean;
  cooldown: number;
}

export interface GameSettings {
  language: GameLanguage;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  graphicsQuality: GraphicsQuality;
  screenShake: boolean;
  hitStop: boolean;
  showHitboxes: boolean;
}

export interface MatchStats {
  winner: 1 | 2;
  p1Wins: number;
  p2Wins: number;
  totalDamageP1: number;
  totalDamageP2: number;
  maxComboP1: number;
  maxComboP2: number;
  matchDurationSeconds: number;
  coinsEarned: number;
}

export interface UserProgress {
  coins: number;
  level: number;
  xp: number;
  totalMatches: number;
  wins: number;
  losses: number;
  unlockedCharacters: CharacterId[];
  unlockedArenas: ArenaId[];
  arcadeWins: number;
  storyProgress: number; // chapter index
  highScore: number;
}
