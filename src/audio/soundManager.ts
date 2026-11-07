/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterId, GameLanguage } from '../types/game';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;

  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmBeat: number = 0;

  private masterVol: number = 0.8;
  private musicVol: number = 0.6;
  private sfxVol: number = 0.8;
  private voiceVol: number = 0.8;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public init() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVol, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.voiceGain = this.ctx.createGain();
        this.voiceGain.gain.setValueAtTime(this.voiceVol, this.ctx.currentTime);
        this.voiceGain.connect(this.masterGain);
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // AudioContext creation or resume failed silently (e.g. autoplay restriction)
    }
  }

  public setVolumes(master: number, music: number, sfx: number, voice: number) {
    this.masterVol = master;
    this.musicVol = music;
    this.sfxVol = sfx;
    this.voiceVol = voice;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : master, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(music, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(sfx, this.ctx.currentTime);
    }
    if (this.voiceGain && this.ctx) {
      this.voiceGain.gain.setValueAtTime(voice, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVol, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // UI Sounds
  public playClick() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playSelect() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(660, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  }

  // Combat SFX
  public playAttackSwing() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
  }

  public playPunchHit() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Resonant cartoon slap/punch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);

    // Punch transient noise
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    noise.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start();
  }

  public playHeavyHit() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Deep sub drop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);

    // Comic crash
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start();
    osc2.stop(this.ctx.currentTime + 0.2);
  }

  public playBlock() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Metallic shield thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(700, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playJump() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Classic cartoon boing
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  public playRoundGong() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Indian Temple / Akhada Gong
    [180, 240, 310, 480].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const decay = 1.2 - idx * 0.2;
      gain.gain.setValueAtTime(0.25 / (idx + 1), this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + decay);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start();
      osc.stop(this.ctx.currentTime + decay);
    });
  }

  public playSpecial(characterId: CharacterId) {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Super move flash blast
    this.playRoundGong();

    switch (characterId) {
      case 'chai_champ': {
        // Steam hiss
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1500, this.ctx.currentTime);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start();
        break;
      }
      case 'dhol_dynamo': {
        // Dhol boom pattern (Dha Dha Tin Dha)
        [0, 0.1, 0.2, 0.3].forEach((delay, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(idx === 2 ? 140 : 90, this.ctx.currentTime + delay);
          osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + delay + 0.15);
          gain.gain.setValueAtTime(0.4, this.ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + 0.15);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(this.ctx.currentTime + delay);
          osc.stop(this.ctx.currentTime + delay + 0.15);
        });
        break;
      }
      case 'auto_ace': {
        // Mumbai auto horn: dual tone "pee-pee!"
        [0, 0.12].forEach((delay) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc1.type = 'sawtooth';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(480, this.ctx.currentTime + delay);
          osc2.frequency.setValueAtTime(540, this.ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.2, this.ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + 0.08);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.sfxGain);
          osc1.start(this.ctx.currentTime + delay);
          osc2.start(this.ctx.currentTime + delay);
          osc1.stop(this.ctx.currentTime + delay + 0.08);
          osc2.stop(this.ctx.currentTime + delay + 0.08);
        });
        break;
      }
      case 'pani_puri_pro': {
        // Water bubbles pop
        [0, 0.07, 0.15, 0.22].forEach((delay, i) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(350 + i * 120, this.ctx.currentTime + delay);
          osc.frequency.exponentialRampToValueAtTime(950 + i * 80, this.ctx.currentTime + delay + 0.06);
          gain.gain.setValueAtTime(0.25, this.ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + 0.06);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(this.ctx.currentTime + delay);
          osc.stop(this.ctx.currentTime + delay + 0.06);
        });
        break;
      }
      case 'cricket_commentator': {
        // Stadium whistle chirp
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1800, this.ctx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(1300, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
        break;
      }
      case 'exam_topper': {
        // Laser arithmetic chime
        [0, 0.08, 0.16].forEach((delay, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800 + idx * 300, this.ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.2, this.ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + 0.07);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(this.ctx.currentTime + delay);
          osc.stop(this.ctx.currentTime + delay + 0.07);
        });
        break;
      }
      default:
        this.playHeavyHit();
    }
  }

  public playVictory() {
    this.init();
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    // Grand Indian fanfare (Major chords ascending)
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C E G C E G
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(this.ctx.currentTime + idx * 0.1);
      osc.stop(this.ctx.currentTime + idx * 0.1 + 0.4);
    });
  }

  public playDefeat() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Sad comic brass wah-wah
    const notes = [311.13, 293.66, 277.18, 261.63];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.22);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.22 + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + idx * 0.22);
      osc.stop(this.ctx.currentTime + idx * 0.22 + 0.28);
    });
  }

  // Dynamic Procedural Background Music (Indian Arcade Groove)
  public startBGM() {
    this.init();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.bgmBeat = 0;

    const tempo = 126; // upbeat energetic arcade tempo
    const stepTime = (60 / tempo) / 4; // 16th notes

    const tick = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.musicGain) return;

      const time = this.ctx.currentTime;
      const beat16 = this.bgmBeat % 16;
      const bar = Math.floor(this.bgmBeat / 16) % 4;

      // Dhol Kick on beats 0, 4, 8, 10, 12 (Bhangra / Bollywood kick syncopation)
      if (beat16 === 0 || beat16 === 6 || beat16 === 8 || beat16 === 12 || beat16 === 14) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(110, time);
        kickOsc.frequency.exponentialRampToValueAtTime(35, time + 0.09);
        kickGain.gain.setValueAtTime(0.25, time);
        kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
        kickOsc.connect(kickGain);
        kickGain.connect(this.musicGain);
        kickOsc.start(time);
        kickOsc.stop(time + 0.09);
      }

      // Snare / Dhol rim tap on beats 4, 12
      if (beat16 === 4 || beat16 === 12) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(220, time);
        snareGain.gain.setValueAtTime(0.18, time);
        snareGain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
        snareOsc.connect(snareGain);
        snareGain.connect(this.musicGain);
        snareOsc.start(time);
        snareOsc.stop(time + 0.07);
      }

      // Bassline note (Pentatonic groove in D: D2, F#2, G2, A2, C3)
      const bassNotes = [73.42, 82.41, 92.50, 98.00, 110.00, 123.47];
      if (beat16 % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        const noteIdx = (bar * 2 + Math.floor(beat16 / 4)) % bassNotes.length;
        bassOsc.frequency.setValueAtTime(bassNotes[noteIdx], time);

        // Filter for warm synth bass
        const bassFilter = this.ctx.createBiquadFilter();
        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(320, time);

        bassGain.gain.setValueAtTime(0.14, time);
        bassGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(this.musicGain);
        bassOsc.start(time);
        bassOsc.stop(time + 0.12);
      }

      this.bgmBeat++;
      this.bgmTimer = window.setTimeout(tick, stepTime * 1000);
    };

    tick();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  // Voice Announcer via Web Speech API if supported
  public speakAnnouncer(text: string, lang: GameLanguage) {
    if (this.isMuted || this.voiceVol <= 0) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.voiceVol;
      utterance.rate = 1.15; // slightly energetic arcade pace
      utterance.pitch = 1.1;

      // Select best voice if available
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'hindi') {
        const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else {
        const inVoice = voices.find((v) => v.lang.includes('IN') || v.lang.includes('en-IN'));
        if (inVoice) utterance.voice = inVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech error gracefully
    }
  }
}

export const soundManager = new SoundManager();
