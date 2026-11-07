/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterDef } from '../types/game';

export const CHARACTERS: CharacterDef[] = [
  {
    id: 'chai_champ',
    name: 'Chai Champ',
    hindiName: 'चाय चैंपियन',
    tagline: 'Ek cutting chai, full energy bhai!',
    bio: 'A high-voltage tapri hero from Old Delhi who pours tea from a 3-foot height without spilling a single drop. Fueled by ginger, cardamom, and pure enthusiasm.',
    homeCity: 'Delhi / Chandni Chowk',
    specialAbilityName: 'Steam Surprise',
    specialAbilityDesc: 'Unleashes a boiling geyser of aromatic ginger steam, creating a blinding cloud and boiling shockwave that knocks opponents off their feet!',
    primaryColor: '#d97706', // Chai amber
    secondaryColor: '#f59e0b',
    accentColor: '#451a03',
    difficulty: 'Easy',
    unlocked: true,
    stats: {
      power: 7,
      speed: 8,
      defense: 6,
      range: 7,
      comedy: 9,
    },
    voiceCatchphrase: {
      hinglish: 'Garam chai ki pyali ho, saamne koi khali ho!',
      hindi: 'कड़क अदरक चाय का झटका, संभालो अपना मटका!',
      english: 'One cutting chai and you are out of the arena!',
    },
    victoryQuotes: {
      hinglish: [
        'Arey bhai, chai thandi hone se pehle match khatam!',
        'Double ginger, zero sugar, pure knock-out!',
        'Cutting chai ka swaad kaisa laga dost?',
      ],
      hindi: [
        'चाय पीयो मस्त रहो, हमसे भिड़ने से पहले सोचो!',
        'कड़क तमाचा और कड़क अदरक चाय!',
        'मैच तो ऐसे खत्म हुआ जैसे टपरी पर आखिरी कप!',
      ],
      english: [
        'Poured you out like extra milk foam!',
        'Nothing beats a boiling hot cup of victory!',
        'You needed more sugar to survive this clash!',
      ],
    },
    defeatQuotes: {
      hinglish: [
        'Arrey yaar, doodh phat gaya lagta hai...',
        'Chai gir gayi, par kal subah fir aayenge!',
      ],
      hindi: [
        'अरे यार, केतली में छेद हो गया शायद...',
        'कोई बात नहीं, अगली चाय में ज़्यादा अदरक डालूँगा!',
      ],
      english: [
        'Spilled the tea this time, but I will brew revenge!',
        'My kettle lost its steam!',
      ],
    },
  },
  {
    id: 'dhol_dynamo',
    name: 'Dhol Dynamo',
    hindiName: 'ढोल डायनामो',
    tagline: 'Dhamaka rhythm, pura crowd jhoomega!',
    bio: 'The energetic rhythm master of every grand Punjabi baraat and street festival. Armed with twin heavy dhol sticks that can produce shockwaves capable of shattering windows.',
    homeCity: 'Amritsar / Ludhiana',
    specialAbilityName: 'Bass Drop',
    specialAbilityDesc: 'Slams a thunderous bhangra rhythm that summons a giant animated speaker wave, bouncing the opponent across the arena in harmonic comedy!',
    primaryColor: '#ef4444', // Festive red
    secondaryColor: '#f97316',
    accentColor: '#facc15',
    difficulty: 'Medium',
    unlocked: true,
    stats: {
      power: 8,
      speed: 6,
      defense: 7,
      range: 8,
      comedy: 8,
    },
    voiceCatchphrase: {
      hinglish: 'Balle Balle! Aaj dhol ki thaap pe nachaunga!',
      hindi: 'बल्ले बल्ले! ढोल की थाप पे पूरी दुनिया नाचेगी!',
      english: 'Hear the thunderous beat of the Punjab dhol!',
    },
    victoryQuotes: {
      hinglish: [
        'Bari barsi khatan gaya si, khat ke lyaanda KO!',
        'Sound system fail ho gaya, par Dhol Dynamo nahi!',
        'Abhi toh baraat shuru bhi nahi hui thi aur tum gir gaye!',
      ],
      hindi: [
        'ढोल की गूंज से जमीन हिला दी!',
        'जीत का भांगड़ा तो अब शुरू होगा!',
        'अरे ताल से ताल मिलाओ या अखाड़ा छोड़ जाओ!',
      ],
      english: [
        'Bass dropped, opponent dropped, crowd hyped!',
        'Dancing through victory with authentic bhangra energy!',
        'Your defense had zero rhythm!',
      ],
    },
    defeatQuotes: {
      hinglish: [
        'Dhol ki chamdi dheeli pad gayi yaar...',
        'Beat miss ho gayi, rematch mangta hai!',
      ],
      hindi: [
        'लगता है लकड़ी टूट गई ढोल की...',
        'अगले राउंड में दोगुना शोर मचाऊँगा!',
      ],
      english: [
        'My tempo dropped! Need to retune my rhythm!',
        'Out of beat, but never out of spirit!',
      ],
    },
  },
  {
    id: 'pani_puri_pro',
    name: 'Pani Puri Pro',
    hindiName: 'पानी पूरी प्रो',
    tagline: 'Tikha ya meetha? Har round mein teekha!',
    bio: 'The undisputed master of the crispy semolina shell. Armed with steel canisters of mint-tamarind water, he feeds spicy defeats faster than anyone can say "bhaiya ek sukha puri do".',
    homeCity: 'Kolkata / Chowringhee',
    specialAbilityName: 'Gol Gappa Bubble',
    specialAbilityDesc: 'Launches a gigantic bubbling crispy puri sphere filled with spicy green chutney that traps and spins the opponent before bursting into festive sparks!',
    primaryColor: '#10b981', // Mint-spicy green
    secondaryColor: '#84cc16',
    accentColor: '#365314',
    difficulty: 'Medium',
    unlocked: true,
    stats: {
      power: 6,
      speed: 9,
      defense: 5,
      range: 8,
      comedy: 10,
    },
    voiceCatchphrase: {
      hinglish: 'Teekha khaane ka jigra chahiye beta!',
      hindi: 'तीखा या मीठा? आज सिर्फ तीखा झटका मिलेगा!',
      english: 'Crispy puri, spicy water, complete knock-out!',
    },
    victoryQuotes: {
      hinglish: [
        'Sukha puri maangne ki haalat bhi nahi bachi!',
        'Pani puri ka count: 50. Opponent ka count: Zero!',
        'Ek plate mein hi knockout ho gaye janab?',
      ],
      hindi: [
        'पुचका का स्वाद ऐसा कि चक्कर आ जाए!',
        'अगली बार पानी में चीनी मिला के लाऊँगा!',
        'चटपटी जीत का कोई मुकाबला नहीं!',
      ],
      english: [
        'Too spicy to handle! Wash your face and try again!',
        'Served with extra mint and zero mercy!',
        'You could not even handle a single round of pani puri!',
      ],
    },
    defeatQuotes: {
      hinglish: [
        'Puri thodi sogi ho gayi thi lagta hai...',
        'Bhaiya thoda meetha chutney do na...',
      ],
      hindi: [
        'आज पूरी थोड़ी नम हो गई थी...',
        'अगली बार और तीखा मसाला डालूँगा!',
      ],
      english: [
        'Crumbled like a dry puri shell!',
        'Need to restock my mint water barrels!',
      ],
    },
  },
  {
    id: 'auto_ace',
    name: 'Auto Ace',
    hindiName: 'ऑटो ऐस',
    tagline: 'Meter down, punch direct round-the-town!',
    bio: 'The fastest navigator of Mumbai traffic who has never once agreed to go where anyone asked. Drives a tuned cartoon yellow-and-black rickshaw with customized dual-tone horns.',
    homeCity: 'Mumbai / Bandra',
    specialAbilityName: 'Meter Madness',
    specialAbilityDesc: 'Flips his meter into hyper-drive, speeding across the arena with blazing cartoon tyre sparks and deafening pee-pee horn soundwaves!',
    primaryColor: '#eab308', // Mumbai Taxi/Auto Yellow
    secondaryColor: '#1e293b', // Black auto hood
    accentColor: '#22c55e',
    difficulty: 'Hard',
    unlocked: true,
    stats: {
      power: 7,
      speed: 10,
      defense: 5,
      range: 6,
      comedy: 9,
    },
    voiceCatchphrase: {
      hinglish: 'Meter se chalenge boss, par direct hospital le jayenge!',
      hindi: 'मीटर डाउन! जहाँ कहोगे वहाँ नहीं, सीधे नॉकआउट ले जाऊँगा!',
      english: 'Shortcuts through traffic and shortcuts to victory!',
    },
    victoryQuotes: {
      hinglish: [
        'Arey udhar nahi jana tha, par tumko bahar phenk diya!',
        'Fast and Furious: Kurla Drift!',
        'Return fare double lagega boss!',
      ],
      hindi: [
        'ट्रैफिक में रास्ता बनाना और रिंग में मैच जीतना मेरा काम है!',
        'मीटर तो चालू था, पर तुम्हारा खेल बंद हो गया!',
        'मुंबई की सड़कों का असली राजा!',
      ],
      english: [
        'Fastest ride of your life, zero tip needed!',
        'You cannot overtake the Mumbai Auto King!',
        'Fare calculated: One heavy knockout!',
      ],
    },
    defeatQuotes: {
      hinglish: [
        'Clutch wire toot gaya boss...',
        'Petrol khatam ho gaya lagta hai, kal dekh lenge!',
      ],
      hindi: [
        'आज रिक्शा का टायर पंचर हो गया...',
        'सीएनजी पंप पर लंबी लाइन है, कल आऊँगा!',
      ],
      english: [
        'Engine stalled on the red light!',
        'Need an emergency tyre change!',
      ],
    },
  },
  {
    id: 'cricket_commentator',
    name: 'Cricket Commentator',
    hindiName: 'क्रिकेट कमेंटेटर',
    tagline: 'What a shot! Seedha stadium ke bahar!',
    bio: 'A hyperactive television commentator who carries an oversized golden microphone, a willow bat, and an infallible instinct for creating 10-minute dramatic speeches out of a single punch.',
    homeCity: 'Bengaluru / M. Chinnaswamy',
    specialAbilityName: 'Third Umpire',
    specialAbilityDesc: 'Summons a comedic giant LED scoreboard and glowing slow-motion replay camera that tracks the opponent before stamping an explosive OUT banner across the screen!',
    primaryColor: '#0284c7', // Team Blue
    secondaryColor: '#38bdf8',
    accentColor: '#f59e0b',
    difficulty: 'Medium',
    unlocked: true,
    stats: {
      power: 8,
      speed: 7,
      defense: 6,
      range: 9,
      comedy: 9,
    },
    voiceCatchphrase: {
      hinglish: 'Hawa mein ball, aur seedha pavilion lautte huye!',
      hindi: 'गेंद हवा में, फील्डर नीचे, और बल्लेबाज बाहर!',
      english: 'Clean bowled! Out of the ground and out of this match!',
    },
    victoryQuotes: {
      hinglish: [
        'Yeh shot direct boundary ke bahar, stadium ke parking mein!',
        'What a sensational win! Crowds are going wild in Dangalverse!',
        'Third umpire decision: Definite, unequivocal, absolute OUT!',
      ],
      hindi: [
        'ऐतिहासिक पारी! दर्शक खुशी से झूम उठे हैं!',
        'सीधा छक्का और विपक्ष का डगआउट में प्रस्थान!',
        'कमेंट्री बॉक्स से फैसला: शानदार जीत!',
      ],
      english: [
        'Straight out of the park! That is a match-winning sixer!',
        'The replay clearly shows you flew across the boundary!',
        'Man of the match, tournament champion!',
      ],
    },
    defeatQuotes: {
      hinglish: [
        'Pitch pe thodi asadharan bounce thi aaj...',
        'DRS review lena banta tha umpire saab!',
      ],
      hindi: [
        'मौसम की खराबी की वजह से मैच हाथ से निकल गया...',
        'अगले मैच में नई पिच के साथ लौटेंगे!',
      ],
      english: [
        'A rare duck, but the series is not over!',
        'Bad pitch conditions, filing a formal review!',
      ],
    },
  },
  {
    id: 'exam_topper',
    name: 'Exam Topper',
    hindiName: 'एग्जाम टॉपर',
    tagline: 'Padhai 24 ghante, percentile 100!',
    bio: 'Armed with thick spectacles, a mechanical pencil that emits lasers, and stacks of solved question papers. Calculates trajectory angles in microseconds before striking with academic precision.',
    homeCity: 'Kota / Rajasthan',
    specialAbilityName: 'Pop Quiz',
    specialAbilityDesc: 'Flings an animated spiral cyclone of syllabus sheets, complex calculus equations, and giant red question marks that dazes and damages the opponent with pure test anxiety!',
    primaryColor: '#8b5cf6', // Academic purple
    secondaryColor: '#a78bfa',
    accentColor: '#ec4899',
    difficulty: 'Hard',
    unlocked: true,
    stats: {
      power: 6,
      speed: 8,
      defense: 8,
      range: 8,
      comedy: 10,
    },
    voiceCatchphrase: {
      hinglish: 'Formula galat lagaoge toh knockout pakka hai!',
      hindi: 'फिजिक्स के नियमों के अनुसार तुम्हारा गिरना तय था!',
      english: '100% attendance, 100% damage, full marks in combat!',
    },
    victoryQuotes: {
      hinglish: [
        'Theorem proved: Dangalverse topper main hi hoon!',
        'Calculus ki tarah tumhara defense bhi differentiate ho gaya!',
        'Out of syllabus sawaal tha kya opponent bhai?',
      ],
      hindi: [
        'सिद्धांत सिद्ध हुआ: नंबर एक हमेशा नंबर एक रहेगा!',
        'तुम्हारी रणनीति में शून्य अंक मिले हैं!',
        'टॉपर्स कभी खाली हाथ नहीं लौटते!',
      ],
      english: [
        'Maximum percentile achieved! Full marks!',
        'Your combat logic failed the basic entrance examination!',
        'Solved with mathematical elegance!',
      ],
    },
    defeatQuotes: {
      hinglish: [
        'Calculation error! Negative marking ho gayi...',
        'Paper leak ki complaint karunga principal ko!',
      ],
      hindi: [
        'शायद कैलकुलेटर में सेल खत्म हो गया था...',
        'रिवैल्यूएशन के लिए अर्जी डालनी पड़ेगी!',
      ],
      english: [
        'Syllabus changed without prior notice!',
        'Requesting an immediate paper re-check!',
      ],
    },
  },
  // Unlockable Bonus Fighters
  {
    id: 'pehlwan_paaji',
    name: 'Pehlwan Paaji',
    hindiName: 'पहलवान पाजी',
    tagline: 'Desi ghee aur mitti ka dum!',
    bio: 'The colossal titan of traditional Akhada wrestling. Drinks 5 liters of almond milk every morning and throws opponents with thunderous wrestling suplexes.',
    homeCity: 'Haryana / Rohtak',
    specialAbilityName: 'Desi Ghee Slam',
    specialAbilityDesc: 'Performs an earth-shattering akhada ground slam that creates a volcanic geyser of sacred arena mitti (red mud) sending all rivals flying!',
    primaryColor: '#c2410c', // Terracotta orange
    secondaryColor: '#ea580c',
    accentColor: '#facc15',
    difficulty: 'Medium',
    unlocked: false,
    unlockCost: 250,
    stats: {
      power: 10,
      speed: 5,
      defense: 9,
      range: 6,
      comedy: 8,
    },
    voiceCatchphrase: {
      hinglish: 'Mitti mein milane ka time aa gaya hai!',
      hindi: 'अखाड़े की मिट्टी से जो प्यार करता है, वही असली दंगल जीतता है!',
      english: 'Feel the raw power of the traditional Indian Akhada!',
    },
    victoryQuotes: {
      hinglish: [
        'Desi ghee ki takat se panga lene chale the?',
        'Dangal ka champion hamesha mitti se hi banta hai!',
        'Agla danda kisko chahiye batao?',
      ],
      hindi: [
        'मिट्टी में मिला दिया एक ही दांव में!',
        'असली पहलवानी का दम देखा या अभी और देखना है?',
        'अखाड़े का शेर हमेशा दहाड़ता है!',
      ],
      english: [
        'Pure wrestling supremacy! Down to the soil you go!',
        'No workout replaces real desi ghee strength!',
        'Clean champion slam!',
      ],
    },
    defeatQuotes: {
      hinglish: [
        'Lassi mein makkhan kam tha aaj...',
        'Pehla daav galat pad gaya, par mitti se fir uthunga!',
      ],
      hindi: [
        'आज बादाम रगड़ना भूल गया था...',
        'हार से ही असली पहलवान सीखता है!',
      ],
      english: [
        'Lost footing on the sand, but a wrestler always stands up!',
        'Need more almond milk!',
      ],
    },
  },
  {
    id: 'bollywood_hero',
    name: 'Bollywood Hero',
    hindiName: 'बॉलीवुड हीरो',
    tagline: 'Picture abhi baaki hai mere dost!',
    bio: 'The charismatic superstar who wears dark sunglasses even at midnight. Enters every clash with flying wind, rose petals, and slow-motion punchlines.',
    homeCity: 'Mumbai / Film City',
    specialAbilityName: 'Masala Slow-Mo Entry',
    specialAbilityDesc: 'Blows a gust of colorful rose petals and golden sparkles that slow down the opponent while delivering an explosive cinematic hero-kick!',
    primaryColor: '#ec4899', // Glamorous pink
    secondaryColor: '#6366f1', // Indigo suit
    accentColor: '#fde047',
    difficulty: 'Medium',
    unlocked: false,
    unlockCost: 350,
    stats: {
      power: 8,
      speed: 8,
      defense: 7,
      range: 7,
      comedy: 10,
    },
    voiceCatchphrase: {
      hinglish: 'Hamari entry pe hi seeti bajti hai boss!',
      hindi: 'हम जहाँ खड़े होते हैं, लाइन वहीं से शुरू होती है!',
      english: 'Every fight is a blockbuster release!',
    },
    victoryQuotes: {
      hinglish: [
        'Box office pe 500 crore ki kamai aur ring mein knockout!',
        'Ek baar jo maine commitment kar di, fir toh opponent gaya!',
        'Ye punch nahi tha, direct climax scene tha!',
      ],
      hindi: [
        'पिक्चर अभी बाकी नहीं, हाउसफुल हो गया!',
        'नायक की जीत पर तो ताली बजनी ही थी!',
        'सुपरस्टार की चमक के आगे टिक नहीं पाए!',
      ],
      english: [
        'Super hit! Blockbuster! Certified fresh victory!',
        'Credits roll, music plays, hero stands tall!',
        'Box office records broken once again!',
      ],
    },
    defeatQuotes: {
      hinglish: [
        'Director cut bolna bhool gaya tha!',
        'Stunt double ko bhejna chahiye tha yaar...',
      ],
      hindi: [
        'इंटरवल के बाद कहानी बदल जाएगी!',
        'कैमरा एंगल सही नहीं था!',
      ],
      english: [
        'Need a retake with better lighting!',
        'My stunt double took the day off!',
      ],
    },
  },
];
