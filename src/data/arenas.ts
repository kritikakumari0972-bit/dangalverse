/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArenaDef } from '../types/game';

export const ARENAS: ArenaDef[] = [
  {
    id: 'chaat_bazaar',
    name: 'Chaat Bazaar',
    hindiName: 'चाट बाज़ार',
    location: 'Old Delhi, Chandni Chowk',
    tagline: 'Steaming samosas, fragrant spices, and frying jalebis!',
    bgColor: '#1c1917', // warm night market
    groundColor: '#78350f',
    accentColor: '#f59e0b',
    parallaxTheme: 'bazaar',
    crowdCheer: 'Wah bhai wah! Ek aur samosa lagao!',
    unlocked: true,
  },
  {
    id: 'mumbai_festival',
    name: 'Mumbai Street Festival',
    hindiName: 'मुंबई उत्सव',
    location: 'Lalbaug, Mumbai',
    tagline: 'Vibrant marigolds, festive flags, and thunderous dhol beats!',
    bgColor: '#0f172a',
    groundColor: '#b45309',
    accentColor: '#f97316',
    parallaxTheme: 'festival',
    crowdCheer: 'Ganpati Bappa Morya! Balle Balle!',
    unlocked: true,
  },
  {
    id: 'jaipur_rooftops',
    name: 'Jaipur Rooftops',
    hindiName: 'जयपुर छतें',
    location: 'Pink City, Jaipur',
    tagline: 'Sunset skies, soaring colorful kites, and royal heritage sandstone arches!',
    bgColor: '#4a044e', // sunset purple
    groundColor: '#9d174d',
    accentColor: '#fb7185',
    parallaxTheme: 'rooftop',
    crowdCheer: 'Kai Po Che! Patang kat gayi!',
    unlocked: true,
  },
  {
    id: 'cricket_carnival',
    name: 'Cricket Carnival',
    hindiName: 'क्रिकेट स्टेडियम',
    location: 'Eden Gardens / Wankhede',
    tagline: 'Floodlit green turf, roaring stadium crowd, and giant LED replay screens!',
    bgColor: '#022c22', // stadium turf night
    groundColor: '#15803d',
    accentColor: '#38bdf8',
    parallaxTheme: 'stadium',
    crowdCheer: 'INDIA... INDIA! Chak de phatte!',
    unlocked: true,
  },
  {
    id: 'college_fest',
    name: 'College Fest',
    hindiName: 'कॉलेज फेस्ट',
    location: 'Campus Amphitheatre, Pune',
    tagline: 'Rock band spotlights, confetti blasts, banners, and youth energy!',
    bgColor: '#18181b',
    groundColor: '#4338ca',
    accentColor: '#a855f7',
    parallaxTheme: 'campus',
    crowdCheer: 'Once more! Once more! Dangal champion!',
    unlocked: true,
  },
  {
    id: 'desi_cinema',
    name: 'Desi Cinema Street',
    hindiName: 'देसी सिनेमा',
    location: 'Retro Theatre, Lucknow',
    tagline: 'Hand-painted 50-foot superstar cutouts, neon billboards, and popcorn carts!',
    bgColor: '#172554',
    groundColor: '#831843',
    accentColor: '#fbbf24',
    parallaxTheme: 'cinema',
    crowdCheer: 'Seeti bajao! Hero ki entry ho gayi!',
    unlocked: false,
    unlockCost: 200,
  },
];
