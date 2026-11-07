/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type Phaser from 'phaser';
import { CharacterId, ArenaId } from '../types/game';

// Generates high quality procedural cartoon character textures directly on HTML5 Canvas
// so Phaser can use them smoothly with zero loading delay or missing network asset errors.
export class SpriteGenerator {
  public static createCharacterTextures(scene: Phaser.Scene) {
    const charIds: CharacterId[] = [
      'chai_champ',
      'dhol_dynamo',
      'pani_puri_pro',
      'auto_ace',
      'cricket_commentator',
      'exam_topper',
      'pehlwan_paaji',
      'bollywood_hero',
    ];

    const states = [
      'idle_0',
      'idle_1',
      'walk_0',
      'walk_1',
      'jump',
      'crouch',
      'attack',
      'heavyAttack',
      'special',
      'block',
      'hurt',
      'victory',
      'defeat',
    ];

    charIds.forEach((id) => {
      states.forEach((st) => {
        const key = `${id}_${st}`;
        if (scene.textures.exists(key)) return;

        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 190;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        SpriteGenerator.drawFighterFrame(ctx, id, st);
        scene.textures.addCanvas(key, canvas);
      });
    });

    // Also generate special FX textures
    SpriteGenerator.createFxTextures(scene);
  }

  private static drawFighterFrame(ctx: CanvasRenderingContext2D, charId: CharacterId, state: string) {
    ctx.clearRect(0, 0, 160, 190);
    ctx.save();

    const isIdle1 = state === 'idle_1';
    const isWalk0 = state === 'walk_0';
    const isWalk1 = state === 'walk_1';
    const isJump = state === 'jump';
    const isCrouch = state === 'crouch';
    const isAttack = state === 'attack';
    const isHeavy = state === 'heavyAttack';
    const isSpecial = state === 'special';
    const isBlock = state === 'block';
    const isHurt = state === 'hurt';
    const isVictory = state === 'victory';
    const isDefeat = state === 'defeat';

    // Character Color Palettes
    let skinColor = '#fed7aa';
    let bodyColor = '#d97706';
    let pantsColor = '#1e293b';
    let hairColor = '#0f172a';
    let propColor = '#f59e0b';

    switch (charId) {
      case 'chai_champ':
        bodyColor = '#ea580c'; // Saffron vest
        pantsColor = '#fde047'; // Yellow dhoti
        skinColor = '#fbcfe8';
        hairColor = '#1e1b4b';
        propColor = '#cbd5e1'; // Steel kettle
        break;
      case 'dhol_dynamo':
        bodyColor = '#dc2626'; // Red kurta
        pantsColor = '#e11d48';
        skinColor = '#fed7aa';
        hairColor = '#450a0a';
        propColor = '#ca8a04'; // Gold dhol
        break;
      case 'pani_puri_pro':
        bodyColor = '#16a34a'; // Green kurta
        pantsColor = '#15803d';
        skinColor = '#fef08a';
        hairColor = '#14532d';
        propColor = '#eab308'; // Crispy golden puri
        break;
      case 'auto_ace':
        bodyColor = '#ca8a04'; // Khaki / yellow uniform
        pantsColor = '#334155';
        skinColor = '#fed7aa';
        hairColor = '#0f172a';
        propColor = '#22c55e'; // Green meter
        break;
      case 'cricket_commentator':
        bodyColor = '#0284c7'; // Team India blue blazer
        pantsColor = '#0369a1';
        skinColor = '#fed7aa';
        hairColor = '#1e293b';
        propColor = '#e2e8f0'; // Mic & bat
        break;
      case 'exam_topper':
        bodyColor = '#7c3aed'; // Purple school cardigan
        pantsColor = '#475569';
        skinColor = '#fef08a';
        hairColor = '#312e81';
        propColor = '#ef4444'; // Red pen / syllabus
        break;
      case 'pehlwan_paaji':
        bodyColor = '#c2410c'; // Terracotta akhada body
        pantsColor = '#b91c1c'; // Red wrestler langot
        skinColor = '#ea580c';
        hairColor = '#1c1917';
        propColor = '#fbbf24'; // Gada mace / ghee can
        break;
      case 'bollywood_hero':
        bodyColor = '#ec4899'; // Hot pink disco jacket
        pantsColor = '#1e1b4b'; // Tight black trousers
        skinColor = '#fed7aa';
        hairColor = '#09090b';
        propColor = '#facc15'; // Golden aviators
        break;
    }

    // Base coordinates
    let centerX = 80;
    let centerY = isCrouch ? 125 : isJump ? 75 : 95;
    if (isIdle1) centerY += 3;
    if (isDefeat) {
      centerX = 80;
      centerY = 140;
    }

    // Shadow on ground (if not jumping)
    if (!isJump && !isDefeat) {
      ctx.beginPath();
      ctx.ellipse(80, 175, isCrouch ? 40 : 32, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fill();
    }

    // Aura / special effects glow
    if (isSpecial) {
      ctx.beginPath();
      ctx.arc(centerX, centerY - 15, 65, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(centerX, centerY - 15, 20, centerX, centerY - 15, 65);
      grad.addColorStop(0, 'rgba(253, 224, 71, 0.7)');
      grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Body Tilt
    if (isHurt) {
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.25);
      ctx.translate(-centerX, -centerY);
    } else if (isAttack) {
      ctx.translate(centerX, centerY);
      ctx.rotate(0.08);
      ctx.translate(-centerX, -centerY);
    } else if (isHeavy) {
      ctx.translate(centerX, centerY);
      ctx.rotate(0.18);
      ctx.translate(-centerX, -centerY);
    }

    // LEGS
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.strokeStyle = pantsColor;

    const legY = centerY + 32;
    if (isCrouch) {
      // Crouched knees
      ctx.beginPath();
      ctx.moveTo(centerX - 14, legY - 10);
      ctx.lineTo(centerX - 22, legY + 12);
      ctx.lineTo(centerX - 10, legY + 22);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 14, legY - 10);
      ctx.lineTo(centerX + 26, legY + 12);
      ctx.lineTo(centerX + 18, legY + 22);
      ctx.stroke();
    } else if (isJump) {
      // Tucked jump legs
      ctx.beginPath();
      ctx.moveTo(centerX - 14, legY - 5);
      ctx.lineTo(centerX - 24, legY + 14);
      ctx.lineTo(centerX - 12, legY + 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 14, legY - 5);
      ctx.lineTo(centerX + 24, legY + 14);
      ctx.lineTo(centerX + 12, legY + 20);
      ctx.stroke();
    } else if (isWalk0) {
      ctx.beginPath();
      ctx.moveTo(centerX - 12, legY);
      ctx.lineTo(centerX - 24, legY + 42);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 12, legY);
      ctx.lineTo(centerX + 22, legY + 40);
      ctx.stroke();
    } else if (isWalk1) {
      ctx.beginPath();
      ctx.moveTo(centerX - 12, legY);
      ctx.lineTo(centerX + 18, legY + 42);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 12, legY);
      ctx.lineTo(centerX - 20, legY + 40);
      ctx.stroke();
    } else if (isDefeat) {
      ctx.beginPath();
      ctx.moveTo(centerX - 35, centerY + 20);
      ctx.lineTo(centerX - 55, centerY + 25);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 20, centerY + 20);
      ctx.lineTo(centerX + 40, centerY + 25);
      ctx.stroke();
    } else {
      // Stance legs
      ctx.beginPath();
      ctx.moveTo(centerX - 14, legY);
      ctx.lineTo(centerX - 18, legY + 42);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 14, legY);
      ctx.lineTo(centerX + 20, legY + 42);
      ctx.stroke();
    }

    // Shoes
    ctx.fillStyle = '#0f172a';
    if (!isDefeat && !isJump && !isCrouch) {
      ctx.beginPath();
      ctx.ellipse(centerX - 20, legY + 42, 11, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(centerX + 22, legY + 42, 11, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // TORSO / VEST
    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = '#090a12';
    ctx.lineWidth = 3.5;

    const torsoW = charId === 'pehlwan_paaji' ? 44 : 36;
    const torsoH = isCrouch ? 30 : 42;

    ctx.beginPath();
    ctx.roundRect(centerX - torsoW / 2, centerY - 10, torsoW, torsoH, [8, 8, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // Vest / Costume details
    if (charId === 'chai_champ') {
      // Cutting chai badge / pocket
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(centerX + 7, centerY + 5, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (charId === 'cricket_commentator') {
      // India tricolor badge
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(centerX - 12, centerY - 2, 8, 2.5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(centerX - 12, centerY + 0.5, 8, 2.5);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(centerX - 12, centerY + 3, 8, 2.5);
    } else if (charId === 'auto_ace') {
      // Black auto stripe on khaki uniform
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(centerX - torsoW / 2, centerY + 10, torsoW, 7);
    }

    // HEAD & FACE
    const headY = centerY - (isCrouch ? 28 : 34);
    const headRadius = charId === 'pehlwan_paaji' ? 24 : 22;

    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(centerX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // HAIR / TURBAN / CAP
    ctx.fillStyle = hairColor;
    if (charId === 'dhol_dynamo' || charId === 'pehlwan_paaji') {
      // Punjabi Pagri / Turban
      ctx.beginPath();
      ctx.roundRect(centerX - 24, headY - 30, 48, 24, [16, 16, 8, 8]);
      ctx.fill();
      ctx.stroke();
      // Turla feather top
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(centerX, headY - 32, 9, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (charId === 'auto_ace') {
      // Driver uniform cap
      ctx.beginPath();
      ctx.roundRect(centerX - 25, headY - 26, 50, 16, [10, 10, 2, 2]);
      ctx.fill();
      ctx.stroke();
      // Visor
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(centerX + 8, headY - 14, 18, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (charId === 'bollywood_hero') {
      // Voluminous hero hair
      ctx.beginPath();
      ctx.arc(centerX, headY - 12, 26, Math.PI, Math.PI * 2);
      ctx.fill();
      // Hair tufts
      ctx.beginPath();
      ctx.arc(centerX - 16, headY - 10, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 18, headY - 10, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Comic cartoon hairstyle
      ctx.beginPath();
      ctx.arc(centerX, headY - 10, 24, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
    }

    // EYES
    if (isDefeat) {
      // Comedic spiral / X eyes
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      // Eye 1 X
      ctx.beginPath();
      ctx.moveTo(centerX - 14, headY - 4);
      ctx.lineTo(centerX - 6, headY + 4);
      ctx.moveTo(centerX - 6, headY - 4);
      ctx.lineTo(centerX - 14, headY + 4);
      ctx.stroke();
      // Eye 2 X
      ctx.beginPath();
      ctx.moveTo(centerX + 6, headY - 4);
      ctx.lineTo(centerX + 14, headY + 4);
      ctx.moveTo(centerX + 14, headY - 4);
      ctx.lineTo(centerX + 6, headY + 4);
      ctx.stroke();
    } else if (charId === 'bollywood_hero') {
      // Dark sunglasses
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(centerX - 18, headY - 6, 16, 11, [3]);
      ctx.roundRect(centerX + 2, headY - 6, 16, 11, [3]);
      ctx.fill();
      ctx.stroke();
    } else if (charId === 'exam_topper') {
      // Thick round spectacle frames
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX - 9, headY - 2, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX + 9, headY - 2, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Bridge
      ctx.beginPath();
      ctx.moveTo(centerX - 2, headY - 2);
      ctx.lineTo(centerX + 2, headY - 2);
      ctx.stroke();
      // Pupil dots
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(centerX - 8, headY - 2, 3, 0, Math.PI * 2);
      ctx.arc(centerX + 10, headY - 2, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Big expressive cartoon eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(centerX - 8, headY - 3, 5.5, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(centerX + 9, headY - 3, 5.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pupils looking towards opponent
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(centerX - 6, headY - 2, 3, 0, Math.PI * 2);
      ctx.arc(centerX + 11, headY - 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // MUSTACHE (for Chai Champ, Pehlwan, Dhol Dynamo, Auto Ace)
    if (['chai_champ', 'pehlwan_paaji', 'auto_ace', 'dhol_dynamo'].includes(charId)) {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(centerX - 7, headY + 8, 9, 4, -0.2, 0, Math.PI * 2);
      ctx.ellipse(centerX + 7, headY + 8, 9, 4, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // MOUTH
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    if (isHurt) {
      // Wobbly mouth
      ctx.beginPath();
      ctx.arc(centerX, headY + 12, 6, Math.PI * 0.1, Math.PI * 0.9, true);
      ctx.stroke();
    } else if (isVictory || isSpecial) {
      // Big laughing open mouth
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(centerX, headY + 10, 8, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
    } else {
      // Confident smirk
      ctx.beginPath();
      ctx.arc(centerX, headY + 9, 6, 0.2, Math.PI * 0.85);
      ctx.stroke();
    }

    // ARMS & CHARACTER PROPS
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    const armStartY = centerY - 2;

    if (isBlock) {
      // Both arms crossed in front
      ctx.beginPath();
      ctx.moveTo(centerX - 16, armStartY);
      ctx.lineTo(centerX + 12, armStartY + 10);
      ctx.moveTo(centerX + 16, armStartY);
      ctx.lineTo(centerX - 12, armStartY + 10);
      ctx.stroke();

      // Golden comic shield wave
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX + 18, centerY, 28, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    } else if (isAttack) {
      // Snappy forward punch with speed lines
      ctx.beginPath();
      ctx.moveTo(centerX - 14, armStartY);
      ctx.lineTo(centerX - 24, armStartY + 12);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 14, armStartY);
      ctx.lineTo(centerX + 55, armStartY - 4);
      ctx.stroke();

      // Glove / fist
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(centerX + 58, armStartY - 4, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Prop in strike
      SpriteGenerator.drawCharacterProp(ctx, charId, centerX + 56, armStartY - 8, propColor, true);
    } else if (isHeavy) {
      // Overhead heavy strike!
      ctx.beginPath();
      ctx.moveTo(centerX - 14, armStartY);
      ctx.lineTo(centerX - 20, armStartY - 22);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 14, armStartY);
      ctx.lineTo(centerX + 35, armStartY - 30);
      ctx.lineTo(centerX + 52, armStartY - 2);
      ctx.stroke();

      SpriteGenerator.drawCharacterProp(ctx, charId, centerX + 55, armStartY - 4, propColor, true, true);
    } else if (isSpecial) {
      // Twin arms high power stance
      ctx.beginPath();
      ctx.moveTo(centerX - 14, armStartY);
      ctx.lineTo(centerX - 35, armStartY - 26);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 14, armStartY);
      ctx.lineTo(centerX + 35, armStartY - 26);
      ctx.stroke();

      SpriteGenerator.drawCharacterProp(ctx, charId, centerX, armStartY - 35, propColor, false, true);
    } else if (isVictory) {
      // Victorious waving hands
      ctx.beginPath();
      ctx.moveTo(centerX - 14, armStartY);
      ctx.lineTo(centerX - 30, armStartY - 24);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 14, armStartY);
      ctx.lineTo(centerX + 32, armStartY - 24);
      ctx.stroke();

      SpriteGenerator.drawCharacterProp(ctx, charId, centerX + 32, armStartY - 32, propColor, false);
    } else {
      // Default idle arms with characteristic prop
      ctx.beginPath();
      ctx.moveTo(centerX - 14, armStartY);
      ctx.lineTo(centerX - 24, armStartY + 14);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 14, armStartY);
      ctx.lineTo(centerX + 26, armStartY + 12);
      ctx.stroke();

      SpriteGenerator.drawCharacterProp(ctx, charId, centerX + 26, armStartY + 14, propColor, false);
    }

    ctx.restore();
  }

  private static drawCharacterProp(
    ctx: CanvasRenderingContext2D,
    charId: CharacterId,
    x: number,
    y: number,
    color: string,
    isAttacking: boolean = false,
    isHeavy: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);

    switch (charId) {
      case 'chai_champ': {
        // Steel Chai Kettle & Cutting Glass
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.5;
        // Kettle body
        ctx.beginPath();
        ctx.arc(0, 0, isHeavy ? 14 : 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Kettle spout
        ctx.beginPath();
        ctx.moveTo(8, -2);
        ctx.lineTo(16, -10);
        ctx.stroke();
        // Steam wisp
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.moveTo(14, -12);
        ctx.quadraticCurveTo(18, -20, 15, -26);
        ctx.stroke();
        break;
      }
      case 'dhol_dynamo': {
        // Festive Dhol drum
        ctx.fillStyle = '#ca8a04';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(-10, -6, 22, 16, [4]);
        ctx.fill();
        ctx.stroke();
        // Drumstick (Dagga)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-12, -14);
        ctx.lineTo(0, -4);
        ctx.stroke();
        break;
      }
      case 'pani_puri_pro': {
        // Crispy golden Puri & bowl
        ctx.fillStyle = '#eab308';
        ctx.strokeStyle = '#854d0e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, isHeavy ? 15 : 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Green mint droplet
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(4, 4, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'auto_ace': {
        // Taxi Fare Meter / Steering Horn
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.fillRect(-8, -10, 16, 12);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-6, -8, 12, 6);
        break;
      }
      case 'cricket_commentator': {
        // Wooden Bat or Golden Mic
        ctx.fillStyle = '#d97706';
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-4, -18, 9, 26, [3]);
        ctx.fill();
        ctx.stroke();
        break;
      }
      case 'exam_topper': {
        // Exam Roll & Glowing Red Laser Pen
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-6, -12, 12, 18, [2]);
        ctx.fill();
        ctx.stroke();
        // Red A+ mark
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('A+', -4, 2);
        break;
      }
      case 'pehlwan_paaji': {
        // Heavy Desi Akhada Gada (Wrestling Mace)
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -12, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 14);
        ctx.stroke();
        break;
      }
      case 'bollywood_hero': {
        // Flying Rose Petals
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 12, 0.4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  // Combat Visual Effects: Sparks, Comic Pow Stars, Dust, Bubbles, Steam
  public static createFxTextures(scene: Phaser.Scene) {
    // 1. Comic Pow Star
    if (!scene.textures.exists('fx_pow_star')) {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const spikes = 8;
        const outerRadius = 28;
        const innerRadius = 14;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;
        ctx.moveTo(32, 32 - outerRadius);
        for (let i = 0; i < spikes; i++) {
          let x = 32 + Math.cos(rot) * outerRadius;
          let y = 32 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;
          x = 32 + Math.cos(rot) * innerRadius;
          y = 32 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(32, 32 - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      scene.textures.addCanvas('fx_pow_star', canvas);
    }

    // 2. Comic Hit Spark
    if (!scene.textures.exists('fx_hit_spark')) {
      const canvas = document.createElement('canvas');
      canvas.width = 48;
      canvas.height = 48;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(24, 24, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(24 + Math.cos(angle) * 12, 24 + Math.sin(angle) * 12);
          ctx.lineTo(24 + Math.cos(angle) * 22, 24 + Math.sin(angle) * 22);
          ctx.stroke();
        }
      }
      scene.textures.addCanvas('fx_hit_spark', canvas);
    }

    // 3. Comic Smoke Puff
    if (!scene.textures.exists('fx_smoke_cloud')) {
      const canvas = document.createElement('canvas');
      canvas.width = 40;
      canvas.height = 40;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(16, 20, 10, 0, Math.PI * 2);
        ctx.arc(26, 16, 12, 0, Math.PI * 2);
        ctx.arc(28, 24, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      scene.textures.addCanvas('fx_smoke_cloud', canvas);
    }

    // 4. Special Shockwave Ring
    if (!scene.textures.exists('fx_shockwave')) {
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(60, 60, 50, 0, Math.PI * 2);
        ctx.stroke();
      }
      scene.textures.addCanvas('fx_shockwave', canvas);
    }
  }

  // Generates rich layered Indian Arena Parallax Backgrounds
  public static createArenaBackground(scene: Phaser.Scene, arenaId: ArenaId) {
    const key = `arena_bg_${arenaId}`;
    if (scene.textures.exists(key)) return key;

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return key;

    // Draw unique stage artwork
    switch (arenaId) {
      case 'chaat_bazaar': {
        // Deep night sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
        skyGrad.addColorStop(0, '#0c0a09');
        skyGrad.addColorStop(0.5, '#292524');
        skyGrad.addColorStop(0.75, '#451a03');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 1280, 720);

        // Distant Old Delhi silhouetted arches and Jama Masjid domes
        ctx.fillStyle = '#1c1917';
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          ctx.arc(100 + i * 160, 360, 50, Math.PI, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(50 + i * 160, 360, 100, 180);
        }

        // Hanging festival lights & lanterns (Laltain / Kandil)
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 120);
        ctx.quadraticCurveTo(640, 220, 1280, 120);
        ctx.stroke();

        for (let i = 0; i < 18; i++) {
          const t = i / 18;
          const x = 1280 * t;
          const y = 120 + Math.sin(t * Math.PI) * 100;
          ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#ef4444';
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        // Steaming street food stalls & neon signs
        ctx.fillStyle = '#b45309';
        ctx.fillRect(150, 380, 180, 140);
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(920, 380, 200, 140);

        // Signboards
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 16px "Baloo 2", sans-serif';
        ctx.fillText('मशहूर समोसे व कचौड़ी', 160, 420);
        ctx.fillText('कड़क अदरक चाय टपरी', 930, 420);

        // Ground: cobblestone street
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 520, 1280, 200);

        // Rangoli boundary line
        ctx.fillStyle = '#fde047';
        ctx.fillRect(0, 520, 1280, 10);
        break;
      }
      case 'mumbai_festival': {
        // Mumbai skyscraper night + festival garland theme
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(0.6, '#0f172a');
        skyGrad.addColorStop(1, '#3b0764');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 1280, 720);

        // Mumbai skyscrapers with glowing yellow windows
        ctx.fillStyle = '#1e293b';
        const towers = [100, 240, 420, 600, 800, 980, 1140];
        towers.forEach((tx, idx) => {
          const h = 260 + (idx % 3) * 60;
          ctx.fillRect(tx, 520 - h, 110, h);
          // Windows
          ctx.fillStyle = '#fef08a';
          for (let wy = 520 - h + 20; wy < 500; wy += 30) {
            ctx.fillRect(tx + 15, wy, 12, 14);
            ctx.fillRect(tx + 45, wy, 12, 14);
            ctx.fillRect(tx + 75, wy, 12, 14);
          }
          ctx.fillStyle = '#1e293b';
        });

        // Marigold (Genda Phool) orange & yellow garland swags
        for (let row = 0; row < 2; row++) {
          const startY = 80 + row * 80;
          for (let i = 0; i < 1280; i += 24) {
            ctx.fillStyle = i % 48 === 0 ? '#f97316' : '#eab308';
            const curve = Math.sin((i / 160) * Math.PI) * 20;
            ctx.beginPath();
            ctx.arc(i, startY + curve, 9, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Festive Welcome Arch
        ctx.fillStyle = '#e11d48';
        ctx.fillRect(400, 260, 480, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px "Bungee", cursive';
        ctx.textAlign = 'center';
        ctx.fillText('★ DANGAL FESTIVAL MUMBAI ★', 640, 290);
        ctx.textAlign = 'start';

        // Ground: Red carpet street
        ctx.fillStyle = '#881337';
        ctx.fillRect(0, 520, 1280, 200);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 520, 1280, 12);
        break;
      }
      case 'jaipur_rooftops': {
        // Sunset royal Rajasthan sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
        skyGrad.addColorStop(0, '#581c87');
        skyGrad.addColorStop(0.4, '#be185d');
        skyGrad.addColorStop(0.75, '#fb923c');
        skyGrad.addColorStop(1, '#fed7aa');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 1280, 720);

        // Huge golden sunset sun
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(640, 280, 80, 0, Math.PI * 2);
        ctx.fill();

        // Flying kites (Patang) in the sky
        const kites = [
          { x: 220, y: 120, c: '#22c55e' },
          { x: 420, y: 90, c: '#3b82f6' },
          { x: 880, y: 140, c: '#ef4444' },
          { x: 1040, y: 80, c: '#eab308' },
        ];
        kites.forEach((k) => {
          ctx.save();
          ctx.translate(k.x, k.y);
          ctx.rotate(0.3);
          ctx.fillStyle = k.c;
          ctx.beginPath();
          ctx.moveTo(0, -18);
          ctx.lineTo(16, 0);
          ctx.lineTo(0, 18);
          ctx.lineTo(-16, 0);
          ctx.closePath();
          ctx.fill();
          // Kite tail
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 18);
          ctx.quadraticCurveTo(10, 36, -8, 52);
          ctx.stroke();
          ctx.restore();
        });

        // Hawa Mahal pink sandstone arches
        ctx.fillStyle = '#9d174d';
        for (let i = 0; i < 7; i++) {
          const ax = 60 + i * 180;
          ctx.beginPath();
          ctx.arc(ax + 70, 380, 50, Math.PI, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(ax, 380, 140, 150);
        }

        // Rooftop ground with terracotta tiles
        ctx.fillStyle = '#831843';
        ctx.fillRect(0, 520, 1280, 200);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(0, 520, 1280, 14);
        break;
      }
      case 'cricket_carnival': {
        // Stadium floodlit night
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
        skyGrad.addColorStop(0, '#022c22');
        skyGrad.addColorStop(0.6, '#064e3b');
        skyGrad.addColorStop(1, '#065f46');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 1280, 720);

        // Floodlight towers with brilliant white flares
        const towers = [160, 1120];
        towers.forEach((tx) => {
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(tx - 6, 80, 12, 300);
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(tx, 70, 35, 0, Math.PI * 2);
          ctx.fill();
          // Light beams downwards
          const beam = ctx.createLinearGradient(tx, 70, tx, 520);
          beam.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          beam.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = beam;
          ctx.beginPath();
          ctx.moveTo(tx - 20, 70);
          ctx.lineTo(tx + 20, 70);
          ctx.lineTo(tx + 280, 520);
          ctx.lineTo(tx - 280, 520);
          ctx.closePath();
          ctx.fill();
        });

        // Giant LED Scoreboard
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(440, 120, 400, 130);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.strokeRect(440, 120, 400, 130);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 24px "Bungee", cursive';
        ctx.textAlign = 'center';
        ctx.fillText('DANGAL PREMIER LEAGUE', 640, 160);
        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 18px "Bungee", cursive';
        ctx.fillText('SCORE: 288/4 ★ CRUNCH MATCH', 640, 210);
        ctx.textAlign = 'start';

        // Lush green cricket turf
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 520, 1280, 200);

        // White boundary rope line
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 520, 1280, 12);
        break;
      }
      case 'college_fest': {
        // Concert stage lighting & speaker stacks
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
        skyGrad.addColorStop(0, '#18181b');
        skyGrad.addColorStop(0.6, '#312e81');
        skyGrad.addColorStop(1, '#581c87');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 1280, 720);

        // Big concert speaker arrays
        ctx.fillStyle = '#09090b';
        ctx.fillRect(80, 260, 120, 260);
        ctx.fillRect(1080, 260, 120, 260);
        // Speaker cones
        ctx.fillStyle = '#27272a';
        [300, 360, 420, 480].forEach((sy) => {
          ctx.beginPath();
          ctx.arc(140, sy, 22, 0, Math.PI * 2);
          ctx.arc(1140, sy, 22, 0, Math.PI * 2);
          ctx.fill();
        });

        // Youth fest banners & laser lights
        const lasers = ['#f43f5e', '#a855f7', '#38bdf8', '#4ade80'];
        lasers.forEach((col, i) => {
          ctx.strokeStyle = col;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(640, 200);
          ctx.lineTo(120 + i * 320, 520);
          ctx.stroke();
        });

        // Stage Floor
        ctx.fillStyle = '#312e81';
        ctx.fillRect(0, 520, 1280, 200);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(0, 520, 1280, 12);
        break;
      }
      case 'desi_cinema': {
        // Retro cinema street with glowing marquee bulbs
        const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
        skyGrad.addColorStop(0, '#090a16');
        skyGrad.addColorStop(0.6, '#172554');
        skyGrad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, 1280, 720);

        // Cinema Façade
        ctx.fillStyle = '#831843';
        ctx.fillRect(280, 140, 720, 240);

        // Flashing Marquee
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 36px "Bungee", cursive';
        ctx.textAlign = 'center';
        ctx.fillText('APSARA TALKIES', 640, 220);
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 20px "Baloo 2", sans-serif';
        ctx.fillText('हाउसफुल! अब दंगल चलेगा!', 640, 270);
        ctx.textAlign = 'start';

        // Bulbs around marquee
        for (let bx = 280; bx <= 1000; bx += 30) {
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(bx, 140, 6, 0, Math.PI * 2);
          ctx.arc(bx, 380, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Red carpet street
        ctx.fillStyle = '#4c0519';
        ctx.fillRect(0, 520, 1280, 200);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(0, 520, 1280, 14);
        break;
      }
    }

    scene.textures.addCanvas(key, canvas);
    return key;
  }
}
