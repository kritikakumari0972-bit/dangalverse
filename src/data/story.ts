/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterId, ArenaId } from '../types/game';

export interface StoryChapter {
  id: number;
  title: string;
  hindiTitle: string;
  subtitle: string;
  opponentId: CharacterId;
  arenaId: ArenaId;
  introDialogues: {
    speaker: string;
    text: string;
    hindiText: string;
    avatar: CharacterId;
  }[];
  victoryDialogues: {
    speaker: string;
    text: string;
    hindiText: string;
    avatar: CharacterId;
  }[];
  coinReward: number;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'Chapter 1: The Ten-Rupee Cutting Chai Dispute',
    hindiTitle: 'अध्याय १: दस रुपये की कटिंग चाय का पंगा',
    subtitle: 'Old Delhi / Chandni Chowk',
    opponentId: 'auto_ace',
    arenaId: 'chaat_bazaar',
    introDialogues: [
      {
        speaker: 'Auto Ace',
        text: 'Bhaiya, do cutting chai diya par mere paas 500 ka chutta nahi hai! Meter down karke chalu kya?',
        hindiText: 'भैया, दो कटिंग चाय दिया पर मेरे पास ५०० का छुट्टा नहीं है! बाद में दूँ क्या?',
        avatar: 'auto_ace',
      },
      {
        speaker: 'Chai Champ',
        text: 'Chutta nahi hai toh ring mein aao! Aaj cutting chai ka bill tumhare knocking punch se chukta hoga!',
        hindiText: 'छुट्टा नहीं है तो रिंग में आओ! आज चाय का बिल अखाड़े में ही तय होगा!',
        avatar: 'chai_champ',
      },
      {
        speaker: 'Auto Ace',
        text: 'Acha! Hamara meter chal gaya toh sidha hospital ka route pakadna padega!',
        hindiText: 'अच्छा! हमारा मीटर चालू हुआ तो सीधे नॉकआउट का रास्ता पकड़ना पड़ेगा!',
        avatar: 'auto_ace',
      },
    ],
    victoryDialogues: [
      {
        speaker: 'Chai Champ',
        text: 'Arey bill chukta ho gaya aur extra tip bhi mil gayi! Chai thandi nahi honi chahiye!',
        hindiText: 'अरे बिल चुकता हो गया और जीत की चाय भी उबल गई!',
        avatar: 'chai_champ',
      },
      {
        speaker: 'Auto Ace',
        text: 'Uff... engine overheat ho gaya! Aage chalte hain Mumbai festival!',
        hindiText: 'उफ्फ... इंजन गर्म हो गया! चलो मुंबई की ओर रुख करते हैं!',
        avatar: 'auto_ace',
      },
    ],
    coinReward: 100,
  },
  {
    id: 2,
    title: 'Chapter 2: The Spicy Festival Showdown',
    hindiTitle: 'अध्याय २: तीखा उत्सव और ढोल का धमाका',
    subtitle: 'Lalbaug / Mumbai Street Festival',
    opponentId: 'dhol_dynamo',
    arenaId: 'mumbai_festival',
    introDialogues: [
      {
        speaker: 'Dhol Dynamo',
        text: 'Balle Balle! Aaj Mumbai ke festival mein sabse unchi aawaz mere dhol ki hogi!',
        hindiText: 'बल्ले बल्ले! आज उत्सव में सबसे ऊँची गूंज मेरे ढोल की होगी!',
        avatar: 'dhol_dynamo',
      },
      {
        speaker: 'Chai Champ',
        text: 'Arey dhol bajane se pehle Chai Champ ka boiling steam jhelo bhai!',
        hindiText: 'अरे ढोल बजाने से पहले कड़क चाय की भाप तो संभालो!',
        avatar: 'chai_champ',
      },
      {
        speaker: 'Dhol Dynamo',
        text: 'Ek bass drop maara na, toh saari chai ke gilas hawa mein uchhal jayenge!',
        hindiText: 'एक बास ड्राप मारा ना, तो सारे कप हवा में नाचने लगेंगे!',
        avatar: 'dhol_dynamo',
      },
    ],
    victoryDialogues: [
      {
        speaker: 'Chai Champ',
        text: 'Bhangra rhythm ke sath chai ka combo! Pura crowd jhoom gaya!',
        hindiText: 'भांगड़ा और चाय का संगम! पूरा उत्सव झूम उठा!',
        avatar: 'chai_champ',
      },
      {
        speaker: 'Dhol Dynamo',
        text: 'Solid beat tha bhai! Ab Kolkata ke Pani Puri wale se milte hain!',
        hindiText: 'शानदार था भाई! अब पानी पूरी के मैदान में चलते हैं!',
        avatar: 'dhol_dynamo',
      },
    ],
    coinReward: 150,
  },
  {
    id: 3,
    title: 'Chapter 3: The Tangy Street Challenge',
    hindiTitle: 'अध्याय ३: गोल गप्पे की तीखी जंग',
    subtitle: 'Jaipur Rooftops / Flying Kites',
    opponentId: 'pani_puri_pro',
    arenaId: 'jaipur_rooftops',
    introDialogues: [
      {
        speaker: 'Pani Puri Pro',
        text: 'Kolkata ka teekha pani aur Jaipur ki hawa! Koi mere gol gappe ki bubble se bach ke dikhaye!',
        hindiText: 'तीखा पानी और गोल गप्पे का फव्वारा! कोई बच के दिखाए!',
        avatar: 'pani_puri_pro',
      },
      {
        speaker: 'Chai Champ',
        text: 'Teekhe ke sath garam chai ka combination toh historic hoga!',
        hindiText: 'तीखे गोल गप्पे के साथ कड़क चाय! इतिहास रचेगा यह दंगल!',
        avatar: 'chai_champ',
      },
    ],
    victoryDialogues: [
      {
        speaker: 'Chai Champ',
        text: 'Puri phoot gayi aur bubble blast ho gaya! Swacch Dangalverse!',
        hindiText: 'पूरी फूट गई और जीत हमारे नाम हुई!',
        avatar: 'chai_champ',
      },
    ],
    coinReward: 200,
  },
  {
    id: 4,
    title: 'Chapter 4: The 100-Percentile Pop Quiz',
    hindiTitle: 'अध्याय ४: शत-प्रतिशत परीक्षा का पर्चा',
    subtitle: 'Kota Coaching Arena',
    opponentId: 'exam_topper',
    arenaId: 'college_fest',
    introDialogues: [
      {
        speaker: 'Exam Topper',
        text: 'Tumhare har attack ka trajectory angle aur angular momentum maine already calculate kar liya hai!',
        hindiText: 'तुम्हारे हर मुक्के का कोण और गति मैंने पहले ही गणित से निकाल ली है!',
        avatar: 'exam_topper',
      },
      {
        speaker: 'Chai Champ',
        text: 'Dangalverse mein out-of-syllabus attack aate hain beta, formula kaam nahi aayega!',
        hindiText: 'दंगल में सिलेबस से बाहर के मुक्के आते हैं! फार्मूला नहीं चलेगा!',
        avatar: 'chai_champ',
      },
    ],
    victoryDialogues: [
      {
        speaker: 'Exam Topper',
        text: 'Negative marking ho gayi... Next term mein top karunga!',
        hindiText: 'नेगेटिव मार्किंग हो गई! अगली परीक्षा में मिलूँगा!',
        avatar: 'exam_topper',
      },
    ],
    coinReward: 250,
  },
  {
    id: 5,
    title: 'Chapter 5: The Grand Mahadangal Akhada Trophy',
    hindiTitle: 'अध्याय ५: महादंगल अखाड़ा फाइनल',
    subtitle: 'Wankhede Cricket Carnival',
    opponentId: 'cricket_commentator',
    arenaId: 'cricket_carnival',
    introDialogues: [
      {
        speaker: 'Cricket Commentator',
        text: 'Ladies and gentlemen, Welcome to the Grand Finale! Stadium is packed, lights are on, and the trophy awaits!',
        hindiText: 'देवियों और सज्जनों, महादंगल के फाइनल में आपका स्वागत है! दर्शक सांस थामे खड़े हैं!',
        avatar: 'cricket_commentator',
      },
      {
        speaker: 'Chai Champ',
        text: 'Seedha stadium ke bahar sixer maar ke Dangalverse Champion banunga!',
        hindiText: 'स्टेडियम के बाहर छक्का मार के दंगल का चैंपियन बनूँगा!',
        avatar: 'chai_champ',
      },
    ],
    victoryDialogues: [
      {
        speaker: 'Cricket Commentator',
        text: 'WHAT A MATCH! WHAT A HERO! DANGALVERSE KI TROPHY CHAI CHAMP KE NAAM!',
        hindiText: 'अविश्वसनीय विजय! दंगलवर्स की स्वर्ण ट्रॉफी आपके नाम!',
        avatar: 'cricket_commentator',
      },
    ],
    coinReward: 500,
  },
];
