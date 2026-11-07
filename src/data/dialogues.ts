/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameLanguage } from '../types/game';

export interface AnnouncerShouts {
  roundStart: string[];
  comboMild: string[];
  comboHeavy: string[];
  specialMove: string[];
  lowHealth: string[];
  ko: string[];
  timeOut: string[];
  draw: string[];
}

export const ANNOUNCER_LINES: Record<GameLanguage, AnnouncerShouts> = {
  hinglish: {
    roundStart: [
      'Round shuru! Thoko taali!',
      'Dangal shuru ho chuka hai dosto!',
      'Aakhri round ka dhamaka!',
      'Chak de phatte, nap de killi!',
      'Maaro maaro, sharm mat karo!',
    ],
    comboMild: [
      'Badhiya shot!',
      'Arey waah, kya rhythm hai!',
      'Garam chai ki tarah teekha!',
      'Solid punch bhai!',
      'Paisa vasool combo!',
    ],
    comboHeavy: [
      'BAAP RE BAAP! KYA HIT HAI!',
      'Direct ICU delivery!',
      'Stadium se bahar phenk diya!',
      'ULTRA DESI SUPER COMBO!',
      'Meter 200 ke paar pahunch gaya!',
    ],
    specialMove: [
      'AREY BHAI, KYA PERFORMANCE HAI!',
      'STEAM SURPRISE ACTIVE!',
      'BASS DROP SE ZAMEEN HIL GAYI!',
      'GOL GAPPA BLAST HO GAYA!',
      'METER MADNESS ON THE LOOSE!',
      'THIRD UMPIRE DECISION: OUT!',
      'POP QUIZ ATTACK: SYLLABUS OVERLOAD!',
    ],
    lowHealth: [
      'Arey baap re, hawa tight ho gayi!',
      'Last over mein 24 run chahiye!',
      'Chai thandi ho rahi hai jaldi maaro!',
      'Emergency light jal gayi boss!',
    ],
    ko: [
      'K.O.! SEEDHA GROUND PE DHER!',
      'YEH MATCH TOH HISTORIC HAI!',
      'PUBLIC KI DEMAND PAR REMATCH!',
      'CHAI THANDI HO GAYI!',
      'SWACCH BHARAT ABHIYAN: RING SAAF!',
    ],
    timeOut: [
      'Samay samapti ki ghoshna!',
      'Bells ring! Time over ho gaya bhai!',
      'Judge ka faisla suno!',
    ],
    draw: [
      'Arey dono dher ho gaye!',
      'Match tie! Ek ek cutting chai dono ko do!',
    ],
  },
  hindi: {
    roundStart: [
      'दंगल का पहला प्रहार!',
      'अखाड़ा तैयार है वीरों!',
      'अंतिम दौर का महासंग्राम!',
      'जोर लगा के हईशा!',
      'मैदान-ए-जंग में आपका स्वागत है!',
    ],
    comboMild: [
      'शानदार वार!',
      'कड़क तमाचा!',
      'वाह क्या फुर्ती है!',
      'बढ़िया मुकाबला!',
      'अंदाज अपना अपना!',
    ],
    comboHeavy: [
      'अरे बाप रे! जबरदस्त प्रहार!',
      'धूल चटा दी एक ही झटके में!',
      'महा-कांबो का तूफान!',
      'दंगल का असली शेर!',
      'स्टेडियम तालियों से गूंज उठा!',
    ],
    specialMove: [
      'अरे भाई, क्या प्रदर्शन है!',
      'गरमा-गरम चाय का महा-विस्फोट!',
      'ढोल की थाप पर पूरी धरती कांपी!',
      'तीखे गोल गप्पे का तूफानी झटका!',
      'मीटर डाउन, रफ्तार आसमान पर!',
      'तीसरा अंपायर का ऐतिहासिक फैसला!',
      'परीक्षा का पर्चा आ गया, बच के रहो!',
    ],
    lowHealth: [
      'सांसें फूल रही हैं, आखिरी दांव बाकी है!',
      'जीवन रेखा संकट में!',
      'करो या मरो का समय आ गया!',
    ],
    ko: [
      'नॉकआउट! मिट्टी में मिला दिया!',
      'यह मुकाबला इतिहास में दर्ज होगा!',
      'जनता की मांग पर दोबारा दंगल!',
      'चाय ठंडी हो गई और खेल खत्म!',
    ],
    timeOut: [
      'समय समाप्त! फैसला अंकों पर!',
      'घंटी बजी, खेल खत्म!',
    ],
    draw: [
      'दोनों सूरमा बराबरी पर छूटे!',
      'टाई मुकाबला! दोनों को शाबाशी!',
    ],
  },
  english: {
    roundStart: [
      'Round begins! Let the cartoon clash commence!',
      'Enter the Dangalverse arena!',
      'Final round showdown!',
      'Brace yourself for pure desi energy!',
    ],
    comboMild: [
      'Crisp hit!',
      'Great rhythm and timing!',
      'Spicy counter-attack!',
      'That left a comedic mark!',
      'Smooth combo chain!',
    ],
    comboHeavy: [
      'UNBELIEVABLE COMBO SMASH!',
      'Knocked into the stratosphere!',
      'SUPER DESI CARTOON CLASH!',
      'Absolute mayhem in the ring!',
      'Crowd is cheering on their feet!',
    ],
    specialMove: [
      'WHAT A SPECTACULAR MOVE!',
      'STEAM SURPRISE UNLEASHED!',
      'BASS DROP SHOCKWAVE ACTIVE!',
      'GOL GAPPA BUBBLE BLAST!',
      'METER MADNESS AT MAX SPEED!',
      'THIRD UMPIRE DECISION IS OUT!',
      'SURPRISE POP QUIZ FIRED!',
    ],
    lowHealth: [
      'Danger zone! One hit could end it all!',
      'Down to the final drops of energy!',
      'Comeback opportunity is now or never!',
    ],
    ko: [
      'K.O.! ABSOLUTE CARTOON TRIUMPH!',
      'THIS MATCH IS PURE HISTORY!',
      'BY PUBLIC DEMAND: REMATCH!',
      'TEA GOT COLD AND SO DID THE OPPONENT!',
      'CLEAN SWEEP VICTORY!',
    ],
    timeOut: [
      'Time is up! Judges announce the verdict!',
      'Clock ran out! Points deciding the victory!',
    ],
    draw: [
      'A mutual double KO! Unbelievable draw!',
      'Both fighters down! A legendary stalemate!',
    ],
  },
};
