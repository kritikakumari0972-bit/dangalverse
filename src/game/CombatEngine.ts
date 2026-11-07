/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Phaser from 'phaser';
import {
  CharacterDef,
  ArenaDef,
  GameMode,
  AIDifficulty,
  GameSettings,
  PlayerInputState,
  MatchStats,
} from '../types/game';
import { soundManager } from '../audio/soundManager';
import { SpriteGenerator } from './spriteGenerator';
import { CHARACTERS } from '../data/characters';
import { ARENAS } from '../data/arenas';

export interface CombatHUDState {
  p1Health: number;
  p1MaxHealth: number;
  p1Energy: number;
  p1RoundsWon: number;
  p1Combo: number;
  p2Health: number;
  p2MaxHealth: number;
  p2Energy: number;
  p2RoundsWon: number;
  p2Combo: number;
  roundTimer: number;
  currentRound: number;
  roundBannerText: string;
  announcerText: string;
  isPaused: boolean;
  matchOver: boolean;
}

export class CombatEngine extends Phaser.Scene {
  // Config
  private p1CharDef!: CharacterDef;
  private p2CharDef!: CharacterDef;
  private arenaDef!: ArenaDef;
  private gameMode: GameMode = 'vs_cpu';
  private aiDifficulty: AIDifficulty = 'normal';
  private settings!: GameSettings;

  // Callback to React HUD
  public onHUDUpdate?: (hud: CombatHUDState) => void;
  public onMatchEnd?: (stats: MatchStats) => void;

  // Fighters state
  private p1Sprite!: Phaser.GameObjects.Sprite;
  private p2Sprite!: Phaser.GameObjects.Sprite;

  // P1 Physics & Combat
  private p1X: number = 380;
  private p1Y: number = 445;
  private p1Vx: number = 0;
  private p1Vy: number = 0;
  private p1Facing: 'left' | 'right' = 'right';
  private p1Health: number = 100;
  private p1MaxHealth: number = 100;
  private p1Energy: number = 0;
  private p1State: string = 'idle';
  private p1StateTimer: number = 0;
  private p1IsGrounded: boolean = true;
  private p1IsBlocking: boolean = false;
  private p1Combo: number = 0;
  private p1ComboTimer: number = 0;
  private p1TotalDamage: number = 0;
  private p1MaxCombo: number = 0;

  // P2 Physics & Combat
  private p2X: number = 900;
  private p2Y: number = 445;
  private p2Vx: number = 0;
  private p2Vy: number = 0;
  private p2Facing: 'left' | 'right' = 'left';
  private p2Health: number = 100;
  private p2MaxHealth: number = 100;
  private p2Energy: number = 0;
  private p2State: string = 'idle';
  private p2StateTimer: number = 0;
  private p2IsGrounded: boolean = true;
  private p2IsBlocking: boolean = false;
  private p2Combo: number = 0;
  private p2ComboTimer: number = 0;
  private p2TotalDamage: number = 0;
  private p2MaxCombo: number = 0;

  // Inputs
  public p1Input: PlayerInputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
    heavyAttack: false,
    special: false,
    block: false,
  };

  public p2Input: PlayerInputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
    heavyAttack: false,
    special: false,
    block: false,
  };

  // Keyboard keys
  private keys: { [key: string]: Phaser.Input.Keyboard.Key } = {};

  // Rounds & Match
  private currentRound: number = 1;
  private p1RoundsWon: number = 0;
  private p2RoundsWon: number = 0;
  private roundTimer: number = 99;
  private timerInterval: number = 0;
  private roundBannerText: string = 'ROUND 1';
  private bannerTimer: number = 120;
  private announcerText: string = '';
  private announcerTimer: number = 0;
  private matchOver: boolean = false;
  private isRoundActive: boolean = false;
  private hitStopFrames: number = 0;
  private matchStartTime: number = Date.now();

  // FX group
  private fxGroup!: Phaser.GameObjects.Group;

  // Arena Dimensions
  private readonly ARENA_LEFT = 100;
  private readonly ARENA_RIGHT = 1180;
  private readonly GROUND_Y = 445;
  private readonly GRAVITY = 0.95;

  // AI timing
  private aiDecisionTimer: number = 0;

  constructor() {
    super('CombatEngine');
  }

  public init(data?: {
    p1Char?: CharacterDef;
    p2Char?: CharacterDef;
    arena?: ArenaDef;
    mode?: GameMode;
    difficulty?: AIDifficulty;
    settings?: GameSettings;
  }) {
    this.p1CharDef = data?.p1Char || CHARACTERS[0];
    this.p2CharDef = data?.p2Char || CHARACTERS[1];
    this.arenaDef = data?.arena || ARENAS[0];
    this.gameMode = data?.mode || 'vs_cpu';
    this.aiDifficulty = data?.difficulty || 'normal';
    this.settings = data?.settings || {
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

    this.currentRound = 1;
    this.p1RoundsWon = 0;
    this.p2RoundsWon = 0;
    this.roundTimer = this.gameMode === 'practice' ? 999 : 99;
    this.matchOver = false;
    this.isRoundActive = false;
    this.matchStartTime = Date.now();
  }

  public preload() {
    // Generate all procedural sprite frames and arena backgrounds
    SpriteGenerator.createCharacterTextures(this);
    SpriteGenerator.createArenaBackground(this, this.arenaDef.id);
  }

  public create() {
    // Add arena background
    const bgKey = `arena_bg_${this.arenaDef.id}`;
    this.add.image(640, 360, bgKey).setDisplaySize(1280, 720);

    // Create FX group
    this.fxGroup = this.add.group();

    // Create fighter sprites
    this.p1Sprite = this.add.sprite(this.p1X, this.p1Y, `${this.p1CharDef.id}_idle_0`);
    this.p1Sprite.setOrigin(0.5, 0.7);

    this.p2Sprite = this.add.sprite(this.p2X, this.p2Y, `${this.p2CharDef.id}_idle_0`);
    this.p2Sprite.setOrigin(0.5, 0.7);

    // Setup Keyboard listener
    if (this.input.keyboard) {
      this.keys = this.input.keyboard.addKeys({
        // P1 Controls: WASD + J, K, L, Space, U
        p1Left: Phaser.Input.Keyboard.KeyCodes.A,
        p1Right: Phaser.Input.Keyboard.KeyCodes.D,
        p1Up: Phaser.Input.Keyboard.KeyCodes.W,
        p1Down: Phaser.Input.Keyboard.KeyCodes.S,
        p1Jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
        p1Attack: Phaser.Input.Keyboard.KeyCodes.J,
        p1Heavy: Phaser.Input.Keyboard.KeyCodes.K,
        p1Special: Phaser.Input.Keyboard.KeyCodes.L,
        p1Block: Phaser.Input.Keyboard.KeyCodes.U,
        // P2 Controls (for Local 2P): Arrow Keys + Numpad / I,O,P
        p2Left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        p2Right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        p2Up: Phaser.Input.Keyboard.KeyCodes.UP,
        p2Down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        p2Attack: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR,
        p2Heavy: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE,
        p2Special: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX,
        p2Block: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO,
        // Secondary P2 mappings if no numpad
        p2AttackAlt: Phaser.Input.Keyboard.KeyCodes.I,
        p2HeavyAlt: Phaser.Input.Keyboard.KeyCodes.O,
        p2SpecialAlt: Phaser.Input.Keyboard.KeyCodes.P,
      }) as { [key: string]: Phaser.Input.Keyboard.Key };
    }

    // Start Round
    this.startRound(this.currentRound);
    soundManager.startBGM();
  }

  private startRound(roundNum: number) {
    this.p1Health = this.p1MaxHealth;
    this.p2Health = this.p2MaxHealth;
    this.p1X = 400;
    this.p1Y = this.GROUND_Y;
    this.p2X = 880;
    this.p2Y = this.GROUND_Y;
    this.p1Vx = 0;
    this.p1Vy = 0;
    this.p2Vx = 0;
    this.p2Vy = 0;
    this.p1Facing = 'right';
    this.p2Facing = 'left';
    this.p1State = 'idle';
    this.p2State = 'idle';
    this.p1StateTimer = 0;
    this.p2StateTimer = 0;
    this.roundTimer = this.gameMode === 'practice' ? 999 : 99;
    this.timerInterval = 0;

    const roundTitle = roundNum === 3 ? 'FINAL ROUND' : `ROUND ${roundNum}`;
    this.roundBannerText = roundTitle;
    this.bannerTimer = 110;
    this.isRoundActive = false;

    soundManager.playRoundGong();

    // After 1.2s, call FIGHT!
    this.time.delayedCall(1200, () => {
      this.roundBannerText = 'FIGHT!';
      this.bannerTimer = 60;
      this.isRoundActive = true;
      soundManager.speakAnnouncer('Fight!', this.settings.language);
    });
  }

  public update(_time: number, delta: number) {
    // Check Hitstop effect
    if (this.hitStopFrames > 0) {
      this.hitStopFrames--;
      return;
    }

    // Round timer update
    if (this.isRoundActive && !this.matchOver) {
      this.timerInterval += delta;
      if (this.timerInterval >= 1000) {
        this.timerInterval = 0;
        if (this.gameMode !== 'practice') {
          this.roundTimer = Math.max(0, this.roundTimer - 1);
          if (this.roundTimer === 0) {
            this.handleTimeOver();
          }
        }
      }
    }

    // Banner & Announcer timers
    if (this.bannerTimer > 0) {
      this.bannerTimer--;
      if (this.bannerTimer === 0 && this.roundBannerText !== 'K.O.!') {
        this.roundBannerText = '';
      }
    }

    if (this.announcerTimer > 0) {
      this.announcerTimer--;
      if (this.announcerTimer === 0) {
        this.announcerText = '';
      }
    }

    // Combo decaying timers
    if (this.p1ComboTimer > 0) {
      this.p1ComboTimer -= delta;
      if (this.p1ComboTimer <= 0) this.p1Combo = 0;
    }
    if (this.p2ComboTimer > 0) {
      this.p2ComboTimer -= delta;
      if (this.p2ComboTimer <= 0) this.p2Combo = 0;
    }

    // Read Inputs
    this.pollInputs();

    // CPU AI decision logic if in CPU mode
    if (this.gameMode !== 'local_2p' && this.isRoundActive && !this.matchOver) {
      this.updateAI(delta);
    }

    // Update Fighters
    this.updateFighterP1();
    this.updateFighterP2();

    // Handle Attack collisions
    if (this.isRoundActive && !this.matchOver) {
      this.checkCombatCollisions();
    }

    // Keep fighters facing each other when not locked in attack
    if (!['attack', 'heavyAttack', 'special', 'knockdown', 'defeat'].includes(this.p1State)) {
      this.p1Facing = this.p1X < this.p2X ? 'right' : 'left';
    }
    if (!['attack', 'heavyAttack', 'special', 'knockdown', 'defeat'].includes(this.p2State)) {
      this.p2Facing = this.p2X < this.p1X ? 'right' : 'left';
    }

    // Update Sprite visuals
    this.renderFighterSprites();

    // Push HUD state to React
    if (this.onHUDUpdate) {
      this.onHUDUpdate({
        p1Health: this.p1Health,
        p1MaxHealth: this.p1MaxHealth,
        p1Energy: this.p1Energy,
        p1RoundsWon: this.p1RoundsWon,
        p1Combo: this.p1Combo,
        p2Health: this.p2Health,
        p2MaxHealth: this.p2MaxHealth,
        p2Energy: this.p2Energy,
        p2RoundsWon: this.p2RoundsWon,
        p2Combo: this.p2Combo,
        roundTimer: this.roundTimer,
        currentRound: this.currentRound,
        roundBannerText: this.roundBannerText,
        announcerText: this.announcerText,
        isPaused: false,
        matchOver: this.matchOver,
      });
    }
  }

  private pollInputs() {
    // Read P1 Keyboard
    const k = this.keys;
    if (k) {
      this.p1Input.left = this.p1Input.left || (k.p1Left && k.p1Left.isDown);
      this.p1Input.right = this.p1Input.right || (k.p1Right && k.p1Right.isDown);
      this.p1Input.up = this.p1Input.up || (k.p1Up && k.p1Up.isDown) || (k.p1Jump && k.p1Jump.isDown);
      this.p1Input.down = this.p1Input.down || (k.p1Down && k.p1Down.isDown);
      this.p1Input.attack = this.p1Input.attack || (k.p1Attack && Phaser.Input.Keyboard.JustDown(k.p1Attack));
      this.p1Input.heavyAttack = this.p1Input.heavyAttack || (k.p1Heavy && Phaser.Input.Keyboard.JustDown(k.p1Heavy));
      this.p1Input.special = this.p1Input.special || (k.p1Special && Phaser.Input.Keyboard.JustDown(k.p1Special));
      this.p1Input.block = this.p1Input.block || (k.p1Block && k.p1Block.isDown);

      // Read P2 Keyboard in Local 2-Player mode
      if (this.gameMode === 'local_2p') {
        this.p2Input.left = (k.p2Left && k.p2Left.isDown);
        this.p2Input.right = (k.p2Right && k.p2Right.isDown);
        this.p2Input.up = (k.p2Up && k.p2Up.isDown);
        this.p2Input.down = (k.p2Down && k.p2Down.isDown);
        this.p2Input.attack = (k.p2Attack && Phaser.Input.Keyboard.JustDown(k.p2Attack)) ||
                              (k.p2AttackAlt && Phaser.Input.Keyboard.JustDown(k.p2AttackAlt));
        this.p2Input.heavyAttack = (k.p2Heavy && Phaser.Input.Keyboard.JustDown(k.p2Heavy)) ||
                                   (k.p2HeavyAlt && Phaser.Input.Keyboard.JustDown(k.p2HeavyAlt));
        this.p2Input.special = (k.p2Special && Phaser.Input.Keyboard.JustDown(k.p2Special)) ||
                               (k.p2SpecialAlt && Phaser.Input.Keyboard.JustDown(k.p2SpecialAlt));
        this.p2Input.block = (k.p2Block && k.p2Block.isDown);
      }
    }
  }

  // CPU AI State Machine
  private updateAI(delta: number) {
    this.aiDecisionTimer -= delta;
    if (this.aiDecisionTimer > 0) return;

    // Set reaction latency based on difficulty
    const reactionDelay =
      this.aiDifficulty === 'easy' ? 320 : this.aiDifficulty === 'normal' ? 180 : 80;
    this.aiDecisionTimer = reactionDelay + Math.random() * 80;

    // Reset CPU inputs
    this.p2Input.left = false;
    this.p2Input.right = false;
    this.p2Input.up = false;
    this.p2Input.down = false;
    this.p2Input.attack = false;
    this.p2Input.heavyAttack = false;
    this.p2Input.special = false;
    this.p2Input.block = false;

    const dx = this.p1X - this.p2X;
    const dist = Math.abs(dx);

    // 1. Super Special execution if energy is full and in range
    if (this.p2Energy >= 100 && dist < 320 && Math.random() < 0.65) {
      this.p2Input.special = true;
      return;
    }

    // 2. Defensive block if P1 is attacking
    if (['attack', 'heavyAttack', 'special'].includes(this.p1State) && dist < 140) {
      const blockChance =
        this.aiDifficulty === 'easy' ? 0.15 : this.aiDifficulty === 'normal' ? 0.55 : 0.88;
      if (Math.random() < blockChance) {
        this.p2Input.block = true;
        return;
      }
    }

    // 3. Movement and spacing
    if (dist > 160) {
      // Approach
      if (dx < 0) this.p2Input.left = true;
      else this.p2Input.right = true;

      // Occasional jump approach
      if (Math.random() < 0.2) this.p2Input.up = true;
    } else if (dist < 70 && Math.random() < 0.3) {
      // Retreat slightly
      if (dx < 0) this.p2Input.right = true;
      else this.p2Input.left = true;
    } else {
      // In strike distance! Attack choices
      const attackRoll = Math.random();
      if (attackRoll < 0.5) {
        this.p2Input.attack = true;
      } else if (attackRoll < 0.8) {
        this.p2Input.heavyAttack = true;
      } else if (Math.random() < 0.25) {
        this.p2Input.down = true; // Crouch
      }
    }
  }

  // P1 Movement & Physics
  private updateFighterP1() {
    if (!this.isRoundActive && !['victory', 'defeat'].includes(this.p1State)) {
      return;
    }

    const speed = 6 + (this.p1CharDef.stats.speed - 5) * 0.4;
    const canAct = ['idle', 'walk', 'jump', 'crouch', 'block'].includes(this.p1State);

    // Gravity
    if (!this.p1IsGrounded) {
      this.p1Vy += this.GRAVITY;
      this.p1Y += this.p1Vy;
      if (this.p1Y >= this.GROUND_Y) {
        this.p1Y = this.GROUND_Y;
        this.p1Vy = 0;
        this.p1IsGrounded = true;
        if (this.p1State === 'jump') this.p1State = 'idle';
      }
    }

    // Actions
    if (canAct) {
      this.p1IsBlocking = this.p1Input.block;

      if (this.p1Input.special && this.p1Energy >= 100) {
        this.p1State = 'special';
        this.p1StateTimer = 45;
        this.p1Energy = 0;
        this.p1Vx = 0;
        soundManager.playSpecial(this.p1CharDef.id);
        this.triggerScreenEffect('special');
        this.showAnnouncerText(this.p1CharDef.specialAbilityName.toUpperCase() + '!');
      } else if (this.p1Input.heavyAttack) {
        this.p1State = 'heavyAttack';
        this.p1StateTimer = 26;
        this.p1Vx = (this.p1Facing === 'right' ? 1 : -1) * 3;
        soundManager.playAttackSwing();
      } else if (this.p1Input.attack) {
        this.p1State = 'attack';
        this.p1StateTimer = 16;
        this.p1Vx = (this.p1Facing === 'right' ? 1 : -1) * 2;
        soundManager.playAttackSwing();
      } else if (this.p1Input.up && this.p1IsGrounded) {
        this.p1Vy = -15.5;
        this.p1IsGrounded = false;
        this.p1State = 'jump';
        soundManager.playJump();
      } else if (this.p1Input.down && this.p1IsGrounded) {
        this.p1State = 'crouch';
        this.p1Vx = 0;
      } else if (this.p1Input.block && this.p1IsGrounded) {
        this.p1State = 'block';
        this.p1Vx = 0;
      } else if (this.p1Input.left) {
        this.p1Vx = -speed;
        if (this.p1IsGrounded) this.p1State = 'walk';
      } else if (this.p1Input.right) {
        this.p1Vx = speed;
        if (this.p1IsGrounded) this.p1State = 'walk';
      } else {
        this.p1Vx = 0;
        if (this.p1IsGrounded) this.p1State = 'idle';
      }
    } else {
      // Cooldown for locked attack states
      this.p1StateTimer--;
      if (this.p1StateTimer <= 0) {
        if (['attack', 'heavyAttack', 'special', 'hurt'].includes(this.p1State)) {
          this.p1State = 'idle';
        }
      }
    }

    // Apply Velocity
    this.p1X += this.p1Vx;
    this.p1X = Phaser.Math.Clamp(this.p1X, this.ARENA_LEFT, this.ARENA_RIGHT);

    // Friction
    this.p1Vx *= 0.88;
  }

  // P2 Movement & Physics
  private updateFighterP2() {
    if (!this.isRoundActive && !['victory', 'defeat'].includes(this.p2State)) {
      return;
    }

    const speed = 6 + (this.p2CharDef.stats.speed - 5) * 0.4;
    const canAct = ['idle', 'walk', 'jump', 'crouch', 'block'].includes(this.p2State);

    // Gravity
    if (!this.p2IsGrounded) {
      this.p2Vy += this.GRAVITY;
      this.p2Y += this.p2Vy;
      if (this.p2Y >= this.GROUND_Y) {
        this.p2Y = this.GROUND_Y;
        this.p2Vy = 0;
        this.p2IsGrounded = true;
        if (this.p2State === 'jump') this.p2State = 'idle';
      }
    }

    // Actions
    if (canAct) {
      this.p2IsBlocking = this.p2Input.block;

      if (this.p2Input.special && this.p2Energy >= 100) {
        this.p2State = 'special';
        this.p2StateTimer = 45;
        this.p2Energy = 0;
        this.p2Vx = 0;
        soundManager.playSpecial(this.p2CharDef.id);
        this.triggerScreenEffect('special');
        this.showAnnouncerText(this.p2CharDef.specialAbilityName.toUpperCase() + '!');
      } else if (this.p2Input.heavyAttack) {
        this.p2State = 'heavyAttack';
        this.p2StateTimer = 26;
        this.p2Vx = (this.p2Facing === 'right' ? 1 : -1) * 3;
        soundManager.playAttackSwing();
      } else if (this.p2Input.attack) {
        this.p2State = 'attack';
        this.p2StateTimer = 16;
        this.p2Vx = (this.p2Facing === 'right' ? 1 : -1) * 2;
        soundManager.playAttackSwing();
      } else if (this.p2Input.up && this.p2IsGrounded) {
        this.p2Vy = -15.5;
        this.p2IsGrounded = false;
        this.p2State = 'jump';
        soundManager.playJump();
      } else if (this.p2Input.down && this.p2IsGrounded) {
        this.p2State = 'crouch';
        this.p2Vx = 0;
      } else if (this.p2Input.block && this.p2IsGrounded) {
        this.p2State = 'block';
        this.p2Vx = 0;
      } else if (this.p2Input.left) {
        this.p2Vx = -speed;
        if (this.p2IsGrounded) this.p2State = 'walk';
      } else if (this.p2Input.right) {
        this.p2Vx = speed;
        if (this.p2IsGrounded) this.p2State = 'walk';
      } else {
        this.p2Vx = 0;
        if (this.p2IsGrounded) this.p2State = 'idle';
      }
    } else {
      this.p2StateTimer--;
      if (this.p2StateTimer <= 0) {
        if (['attack', 'heavyAttack', 'special', 'hurt'].includes(this.p2State)) {
          this.p2State = 'idle';
        }
      }
    }

    // Apply Velocity
    this.p2X += this.p2Vx;
    this.p2X = Phaser.Math.Clamp(this.p2X, this.ARENA_LEFT, this.ARENA_RIGHT);

    // Friction
    this.p2Vx *= 0.88;
  }

  // Hit Detection & Combat Resolution
  private checkCombatCollisions() {
    const dist = Math.abs(this.p1X - this.p2X);
    const yDist = Math.abs(this.p1Y - this.p2Y);

    // 1. Check P1 hitting P2
    if (
      ['attack', 'heavyAttack', 'special'].includes(this.p1State) &&
      yDist < 75 &&
      dist < (this.p1State === 'special' ? 240 : 115)
    ) {
      const isFacingOpponent =
        (this.p1Facing === 'right' && this.p1X <= this.p2X) ||
        (this.p1Facing === 'left' && this.p1X >= this.p2X);

      // Trigger hit once during the strike active window
      if (isFacingOpponent && (this.p1StateTimer === 12 || this.p1StateTimer === 20 || this.p1StateTimer === 35)) {
        this.applyHitToPlayer(1, 2, this.p1State);
      }
    }

    // 2. Check P2 hitting P1
    if (
      ['attack', 'heavyAttack', 'special'].includes(this.p2State) &&
      yDist < 75 &&
      dist < (this.p2State === 'special' ? 240 : 115)
    ) {
      const isFacingOpponent =
        (this.p2Facing === 'right' && this.p2X <= this.p1X) ||
        (this.p2Facing === 'left' && this.p2X >= this.p1X);

      if (isFacingOpponent && (this.p2StateTimer === 12 || this.p2StateTimer === 20 || this.p2StateTimer === 35)) {
        this.applyHitToPlayer(2, 1, this.p2State);
      }
    }
  }

  private applyHitToPlayer(attackerNum: 1 | 2, defenderNum: 1 | 2, attackType: string) {
    const isDefenderBlocking = defenderNum === 1 ? this.p1IsBlocking : this.p2IsBlocking;

    let baseDamage = attackType === 'attack' ? 9 : attackType === 'heavyAttack' ? 20 : 38;
    const attackerChar = attackerNum === 1 ? this.p1CharDef : this.p2CharDef;
    const defenderChar = defenderNum === 1 ? this.p1CharDef : this.p2CharDef;

    // Apply power & defense stats
    baseDamage = baseDamage * (1 + (attackerChar.stats.power - 5) * 0.05);
    baseDamage = baseDamage * (1 - (defenderChar.stats.defense - 5) * 0.04);

    if (isDefenderBlocking) {
      baseDamage = Math.max(1, Math.floor(baseDamage * 0.2));
      soundManager.playBlock();
      this.spawnFx('fx_hit_spark', defenderNum === 1 ? this.p1X : this.p2X, 420);
    } else {
      baseDamage = Math.round(baseDamage);
      if (attackType === 'attack') {
        soundManager.playPunchHit();
        this.spawnFx('fx_hit_spark', defenderNum === 1 ? this.p1X : this.p2X, 420);
      } else {
        soundManager.playHeavyHit();
        this.spawnFx('fx_pow_star', defenderNum === 1 ? this.p1X : this.p2X, 410);
        this.triggerScreenEffect('heavy');
      }

      // Combo count
      if (attackerNum === 1) {
        this.p1Combo++;
        this.p1ComboTimer = 2000;
        if (this.p1Combo > this.p1MaxCombo) this.p1MaxCombo = this.p1Combo;
        if (this.p1Combo >= 3) {
          this.showAnnouncerText(`${this.p1Combo}X COMBO DHAMAKA!`);
        }
      } else {
        this.p2Combo++;
        this.p2ComboTimer = 2000;
        if (this.p2Combo > this.p2MaxCombo) this.p2MaxCombo = this.p2Combo;
      }
    }

    // Apply Damage
    if (defenderNum === 1) {
      this.p1Health = Math.max(0, this.p1Health - baseDamage);
      this.p2TotalDamage += baseDamage;
      this.p2Energy = Math.min(100, this.p2Energy + (attackType === 'heavyAttack' ? 16 : 8));
      this.p1Energy = Math.min(100, this.p1Energy + 6); // Energy on receiving hit
      if (!isDefenderBlocking) {
        this.p1State = 'hurt';
        this.p1StateTimer = 18;
        this.p1Vx = (this.p2X < this.p1X ? 1 : -1) * (attackType === 'heavyAttack' ? 8 : 4);
      }
      if (this.p1Health <= 0) {
        this.handleKO(2);
      }
    } else {
      this.p2Health = Math.max(0, this.p2Health - baseDamage);
      this.p1TotalDamage += baseDamage;
      this.p1Energy = Math.min(100, this.p1Energy + (attackType === 'heavyAttack' ? 16 : 8));
      this.p2Energy = Math.min(100, this.p2Energy + 6);
      if (!isDefenderBlocking) {
        this.p2State = 'hurt';
        this.p2StateTimer = 18;
        this.p2Vx = (this.p1X < this.p2X ? 1 : -1) * (attackType === 'heavyAttack' ? 8 : 4);
      }
      if (this.p2Health <= 0) {
        this.handleKO(1);
      }
    }
  }

  private handleKO(winner: 1 | 2) {
    if (this.matchOver) return;
    this.isRoundActive = false;
    this.roundBannerText = 'K.O.!';
    this.bannerTimer = 150;

    if (winner === 1) {
      this.p1RoundsWon++;
      this.p2State = 'defeat';
      this.p1State = 'victory';
      soundManager.playVictory();
      this.showAnnouncerText('K.O.! VICTORY BY CHAI CHAMPION!');
    } else {
      this.p2RoundsWon++;
      this.p1State = 'defeat';
      this.p2State = 'victory';
      soundManager.playDefeat();
      this.showAnnouncerText('K.O.! HARD LUCK BHAI!');
    }

    // Check match victory (best of 3 rounds)
    if (this.p1RoundsWon >= 2 || this.p2RoundsWon >= 2) {
      this.matchOver = true;
      this.time.delayedCall(2200, () => {
        const finalWinner = this.p1RoundsWon >= 2 ? 1 : 2;
        const durationSec = Math.floor((Date.now() - this.matchStartTime) / 1000);
        const coins = finalWinner === 1 ? 75 : 25;

        if (this.onMatchEnd) {
          this.onMatchEnd({
            winner: finalWinner,
            p1Wins: this.p1RoundsWon,
            p2Wins: this.p2RoundsWon,
            totalDamageP1: this.p1TotalDamage,
            totalDamageP2: this.p2TotalDamage,
            maxComboP1: this.p1MaxCombo,
            maxComboP2: this.p2MaxCombo,
            matchDurationSeconds: durationSec,
            coinsEarned: coins,
          });
        }
      });
    } else {
      // Next Round
      this.time.delayedCall(2400, () => {
        this.currentRound++;
        this.startRound(this.currentRound);
      });
    }
  }

  private handleTimeOver() {
    this.isRoundActive = false;
    this.roundBannerText = 'TIME OVER!';
    this.bannerTimer = 120;

    const winner = this.p1Health > this.p2Health ? 1 : this.p2Health > this.p1Health ? 2 : 1;
    this.handleKO(winner);
  }

  private triggerScreenEffect(type: 'heavy' | 'special') {
    if (this.settings.screenShake) {
      this.cameras.main.shake(type === 'special' ? 350 : 180, type === 'special' ? 0.025 : 0.015);
    }
    if (this.settings.hitStop) {
      this.hitStopFrames = type === 'special' ? 6 : 3;
    }
    if (type === 'special') {
      this.cameras.main.flash(200, 255, 255, 255, false);
    }
  }

  private spawnFx(textureKey: string, x: number, y: number) {
    const fx = this.add.sprite(x, y, textureKey);
    fx.setScale(1.2);
    this.tweens.add({
      targets: fx,
      scaleX: 1.8,
      scaleY: 1.8,
      alpha: 0,
      duration: 280,
      onComplete: () => fx.destroy(),
    });
  }

  private showAnnouncerText(text: string) {
    this.announcerText = text;
    this.announcerTimer = 120;
    soundManager.speakAnnouncer(text, this.settings.language);
  }

  private renderFighterSprites() {
    // Determine P1 texture frame
    const p1Anim = this.getFighterTextureKey(this.p1CharDef.id, this.p1State);
    this.p1Sprite.setTexture(p1Anim);
    this.p1Sprite.setPosition(this.p1X, this.p1Y);
    this.p1Sprite.setScale(this.p1Facing === 'right' ? 1.4 : -1.4, 1.4);

    // Determine P2 texture frame
    const p2Anim = this.getFighterTextureKey(this.p2CharDef.id, this.p2State);
    this.p2Sprite.setTexture(p2Anim);
    this.p2Sprite.setPosition(this.p2X, this.p2Y);
    this.p2Sprite.setScale(this.p2Facing === 'right' ? 1.4 : -1.4, 1.4);
  }

  private getFighterTextureKey(charId: string, state: string): string {
    const step = Math.floor(this.time.now / 150) % 2;
    if (state === 'idle') return `${charId}_idle_${step}`;
    if (state === 'walk') return `${charId}_walk_${step}`;
    return `${charId}_${state}`;
  }

  public restartMatch() {
    this.currentRound = 1;
    this.p1RoundsWon = 0;
    this.p2RoundsWon = 0;
    this.p1TotalDamage = 0;
    this.p2TotalDamage = 0;
    this.p1MaxCombo = 0;
    this.p2MaxCombo = 0;
    this.matchOver = false;
    this.matchStartTime = Date.now();
    this.startRound(1);
  }
}
