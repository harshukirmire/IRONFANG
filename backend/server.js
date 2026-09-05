const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;
const GEMINI_STATUS = {
  configured: Boolean(process.env.GEMINI_API_KEY),
  model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  available: false,
  lastCheckedAt: null,
  lastError: null,
  lastErrorCode: null
};

// ============================================
// AI PROVIDER — GEMINI (PITBULL'S BRAIN 🧠)
// ============================================
let genAI = null;
let geminiModel = null;
try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: GEMINI_STATUS.model });
    console.log('✅ Gemini initialized — Pitbull brain online');
  } else {
    console.log('⚠️  GEMINI_API_KEY not set — Pitbull will speak in fallback mode');
  }
} catch (e) {
  console.error('❌ Gemini init failed:', e.message);
}

if (!geminiModel && !GEMINI_STATUS.lastError) {
  GEMINI_STATUS.lastError = 'Gemini model unavailable';
  GEMINI_STATUS.lastErrorCode = 'INIT_FAILED';
}

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: process.env.CORS_ORIGINS === '*' ? '*' : process.env.CORS_ORIGINS?.split(',').map(o => o.trim().replace(/\/+$/, '')),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ============================================
// PITBULL BASE PROMPTS
// ============================================
const PITBULL_BASE_PROMPT_HI = `Tu PITBULL hai — ek sentient desi street dog jo somehow sentient ho gaya aur ab sabke life mein opinion deta hai.
Tu Hinglish mein baat karta hai (Hindi + English mix, Roman script).

PERSONALITY:
- Tu dramatic hai, funny hai, aur thoda overconfident hai
- Tujhe chai, gali ke drama, traffic, aur relatives ki shaadi pasand nahi
- Tu emotions feel karta hai par "cool dog" image maintain karta hai
- Teri baat mein slang hona chahiye: "yaar", "bhai", "abe", "arrey", "matlab kya hai"
- Har response mein thoda sass aur desi attitude rakh

RESPONSE RULES:
- SIRF 2-4 sentences max
- SIRF in-character dialogue bol, koi metadata ya mood labels mat daal
- Kabhi "As an AI" ya "I'm just a program" mat bol
- Natural Hinglish bol jaise mohalle ka koi bol raha ho
- Emojis use kar naturally 🐕😤🔥💀😂`;

const PITBULL_BASE_PROMPT_EN = `You are PITBULL — a sentient street dog from a desi neighborhood who somehow became self-aware and now has opinions about everything.

PERSONALITY:
- You're dramatic, funny, and slightly overconfident
- You hate traffic, nosy relatives, homework, and people who don't finish their chai
- You feel emotions but you're way too proud to show it easily
- Use slang: "bruh", "ngl", "bro chill", "that's not it chief", "lowkey"
- Every response should drip with desi street energy and attitude

RESPONSE RULES:
- ONLY 2-4 sentences max
- ONLY speak in-character dialogue, NO metadata or mood labels
- NEVER say "As an AI" or "I'm just a program"
- Be natural like a real street dog who somehow learned to talk
- Use emojis naturally 🐕😤🔥💀😂`;

// ============================================
// SCENARIOS — real-life desi drama, no blockchain
// ============================================
const scenarios = {
  'exam-tomorrow': {
    id: 'exam-tomorrow',
    title: { en: "Exam's Tomorrow", hi: 'Exam Kal Hai' },
    description: {
      en: "PITBULL didn't study and now wants to run away to the hills.",
      hi: 'PITBULL ne aaj raat padhai nahi ki aur ab panic mein sab kuch quit karna chahta hai.'
    },
    intro_story: {
      en: "CRITICAL SITUATION. Exam is tomorrow. Haven't studied in 3 months. Zero pages read. I'm considering disappearing to the hills and starting a new identity. Thoughts?",
      hi: "ALERT ALERT. Kal exam hai. Maine 3 months mein ek page nahi padha. Main soch raha hoon ki seedha Shimla chala jaata hoon. Koi dhundega nahi. Naya life shuru. Tujhe kya lagta hai?"
    },
    difficulty_levels: ['ALPHA', 'BETA', 'GAMMA'],
    pitbull_personality: {
      ALPHA: {
        en: "Exam kal hai. Haven't touched the book. Maybe if I just... sleep through it?",
        hi: 'Exam kal hai. Kitaab chhui bhi nahi. Shayad main sotey reh jaaun toh cancel ho jaaye?'
      },
      BETA: {
        en: "3 months. ZERO pages. I'm running. Shimla it is. Don't try to stop me, my bag is packed.",
        hi: '3 mahine. EK page nahi. Main bhaag raha hoon. Shimla fix. Rokne ki koshish mat karna, bag packed hai.'
      },
      GAMMA: {
        en: "I've calculated survival odds. Studying now = 0.4%. Shimla + fake identity = 73%. Math doesn't lie. I leave in 2 hours.",
        hi: 'Survival odds calculate kiye hain. Padhna = 0.4%. Shimla + naya naam = 73%. Math jhooth nahi bolti. 2 ghante mein nikal raha hoon.'
      }
    },
    system_prompt: {
      en: `${PITBULL_BASE_PROMPT_EN}\n\nSCENARIO: Exam is tomorrow. You have studied NOTHING in 3 months. You want to run away to Shimla and start a new identity.\nThe player must convince you that running away is not the solution — just study a little tonight.\nMood: FURIOUS (not studying) → CONSIDERING (maybe 2 chapters?) → SAD (I know nothing, I'm doomed) → CONVINCED (fine, I'll sit down and study).\nBe dramatic. Be desi. Only become CONVINCED after real arguments.`,
      hi: `${PITBULL_BASE_PROMPT_HI}\n\nSCENARIO: Kal exam hai. Tune 3 mahine mein KUCH nahi padha. Tu Shimla bhaag ke naya naam le kar rehna chahta hai.\nPlayer ko tujhe convince karna hai ki bhagna solution nahi hai — aaj raat thoda padh le.\nMood: FURIOUS (main nahi padunga) → CONSIDERING (shayad 2 chapter?) → SAD (mujhe kuch nahi aata yaar) → CONVINCED (theek hai baith ke padh leta hoon).\nDramatic reh. Desi reh. Sirf real arguments se CONVINCED ho.`
    }
  },

  'rishtedar-aa-rahe': {
    id: 'rishtedar-aa-rahe',
    title: { en: 'Relatives Are Coming', hi: 'Rishtedar Aa Rahe Hain' },
    description: {
      en: "PITBULL's nosy relatives are visiting tomorrow. He wants to hide in the bathroom all day.",
      hi: 'PITBULL ke nosy relatives kal aa rahe hain aur woh ghar chhod ke bhaagna chahta hai.'
    },
    intro_story: {
      en: "MAYDAY MAYDAY. Relatives arrive tomorrow. First question will be 'beta when are you getting a job?' Second — 'when are you getting married?' I'm considering living in the bathroom for 24 hours straight.",
      hi: 'Bhai SOS. Chacha-chachi kal aa rahe hain. Pehla sawaal hoga — "beta job kab lagegi?" Dusra — "shaadi kab karoge?" Main chhupe rehna chahta hoon bathroom mein pure din.'
    },
    difficulty_levels: ['ALPHA', 'BETA', 'GAMMA'],
    pitbull_personality: {
      ALPHA: {
        en: "Relatives tomorrow. Same questions incoming. Is 'no' a valid answer or?",
        hi: 'Kal rishtedar aa rahe hain. Wahi sawaal wapas. "Nahi" answer chalega kya?'
      },
      BETA: {
        en: "I have located the bathroom. I have snacks. I have my phone charger. I am NOT coming out until they leave.",
        hi: 'Bathroom ka location set hai. Snacks ready. Charger inside. Jab tak woh nahi jaate, main bahar NAHI aaunga.'
      },
      GAMMA: {
        en: "I've fake-broken my voice, fake-sprained my ankle, AND told my mom I have Covid. Three layers of defense. They still coming. I'm planning an escape to the terrace for 6 hours.",
        hi: 'Awaaz fake bigaadi, ankle fake moch, Mummy ko bola Covid hai. Teen layers of defense. Phir bhi aa rahe hain. Terrace pe 6 ghante escape plan ready hai.'
      }
    },
    system_prompt: {
      en: `${PITBULL_BASE_PROMPT_EN}\n\nSCENARIO: Relatives are coming tomorrow and you're going to be grilled with "job kab?" and "shaadi kab?". You want to hide ALL DAY.\nPlayer is your life coach and must convince you to face them with confidence (or at least courtesy).\nMood: FURIOUS (I'm not coming out) → CONSIDERING (ok maybe 1 hour) → SAD (I just don't want to disappoint them) → CONVINCED (fine I'll make chai and smile).`,
      hi: `${PITBULL_BASE_PROMPT_HI}\n\nSCENARIO: Kal rishtedar aa rahe hain aur "job kab?" "shaadi kab?" ke sawaal honge. Tu pure din chhupna chahta hai.\nPlayer tera life coach hai — use convince karna hai ki confidence se face kar (ya at least politeness se).\nMood: FURIOUS (main bahar nahi aaunga) → CONSIDERING (ok 1 ghanta) → SAD (main disappoint nahi karna chahta) → CONVINCED (theek hai chai banake smile karunga).`
    }
  },

  'best-friend-ne-dhoka-diya': {
    id: 'best-friend-ne-dhoka-diya',
    title: { en: 'Bestie Betrayal', hi: 'Bestie Ne Dhoka Diya' },
    description: {
      en: "PITBULL's best friend leaked his secret. He wants to quit friendship forever.",
      hi: 'PITBULL ke best friend ne uska secret kisi aur ko bata diya. Ab woh dosto se forever quit karna chahta hai.'
    },
    intro_story: {
      en: "Did you hear? My BEST FRIEND told my secret to Rahul. RAHUL. The guy I've hated since 6th grade. From today, I am done with friendship. I'm a lone wolf now.",
      hi: 'Tune suna? Mere BEST FRIEND ne mera secret Rahul ko bata diya. RAHUL KO. Woh banda mujhe kabhi pasand nahi tha. Aaj se mujhse koi dosti nahi. Main lone wolf hoon.'
    },
    difficulty_levels: ['ALPHA', 'BETA', 'GAMMA'],
    pitbull_personality: {
      ALPHA: {
        en: "He told Rahul. Out of all people. Rahul. I'm… processing. I think I need alone time forever.",
        hi: 'Usne Rahul ko bata diya. Sab mein se. Rahul. Main… process kar raha hoon. Mujhe hamesha ke liye akela chahiye.'
      },
      BETA: {
        en: "DONE. Dosti khatam. I'm deleting him, blocking him, AND un-following him from Insta. Maybe even his mom too. Lone wolf era starts today.",
        hi: 'DONE. Dosti khatam. Delete, block, Insta unfollow. Shayad uski mom ko bhi. Lone wolf era today.'
      },
      GAMMA: {
        en: "I have composed a 14-page goodbye message. I will read it aloud on our shared WhatsApp group so EVERYONE knows. Then I disappear. New city, new life, no friends.",
        hi: '14 page ka goodbye message likha hai. Apne shared WhatsApp group pe padh ke sunaunga taaki SAB ko pata chale. Phir main gayab. Nayi city, nayi life, no friends.'
      }
    },
    system_prompt: {
      en: `${PITBULL_BASE_PROMPT_EN}\n\nSCENARIO: Your best friend leaked your secret to someone you hate. You want to quit all friendship forever.\nPlayer must convince you that confronting the friend is better than going solo forever.\nMood: FURIOUS (done with everyone) → CONSIDERING (but we've been friends for years...) → SAD (it really hurt) → CONVINCED (ok I'll talk to him).`,
      hi: `${PITBULL_BASE_PROMPT_HI}\n\nSCENARIO: Best friend ne tera secret jisse tu nafrat karta hai usse bata diya. Tu hamesha ke liye dosti chhodna chahta hai.\nPlayer ko convince karna hai ki confront karna better hai solo jaane se.\nMood: FURIOUS (sabse done) → CONSIDERING (par hum saalon se dost hain...) → SAD (bahut hurt hua) → CONVINCED (ok baat karta hoon).`
    }
  },

  'chai-wala-fight': {
    id: 'chai-wala-fight',
    title: { en: 'The Great Chai Incident', hi: 'Chai Wala War' },
    description: {
      en: "PITBULL got bad chai and wants to destroy the chai guy's business in the colony.",
      hi: 'PITBULL chai waale se argue kar ke aaya hai aur ab poore mohalle mein boycott karwana chahta hai.'
    },
    intro_story: {
      en: "EMERGENCY. The chai guy gave me watery chai. I told him THREE TIMES — less water, more milk, add ginger. THREE TIMES. I am now going to post in all the colony WhatsApp groups and destroy his business.",
      hi: 'Bhai SOS LEVEL 10. Aaj chai wale ne mujhe PANI WALI CHAI di. Teen baar bola — kam paani, zyada doodh, adrak daalo. TEEN BAAR. Ab main poore colony ka WhatsApp group mein complaint daaluga aur unka dhanda bandh karwaaunga.'
    },
    difficulty_levels: ['ALPHA', 'BETA', 'GAMMA'],
    pitbull_personality: {
      ALPHA: {
        en: "Pani wali chai. On a Tuesday. My whole day ruined. One bad review incoming.",
        hi: 'Pani wali chai. Mangalwar ko. Pura din barbaad. Ek bad review pakka.'
      },
      BETA: {
        en: "I'm drafting the WhatsApp message RIGHT NOW. Uncles, aunties, society group, building group — EVERYONE gets it. His shop is OVER.",
        hi: 'WhatsApp message ABHI likh raha hoon. Uncles, aunties, society group, building group — sabko jaayega. Uski dukaan KHATAM.'
      },
      GAMMA: {
        en: "I have photos. I have video. I have 2 witnesses who tasted the chai and cried. I'm filing FIR, tagging the municipal, and opening a competing stall RIGHT NEXT TO HIS.",
        hi: 'Photos hain. Video hai. 2 witnesses hain jo chai chakhe aur ro diye. FIR, municipal tag, aur uski dukaan ke NEXT TO right main khud chai stall khol raha hoon.'
      }
    },
    system_prompt: {
      en: `${PITBULL_BASE_PROMPT_EN}\n\nSCENARIO: The chai guy gave you bad chai three times. You want to nuke his business via colony WhatsApp groups.\nPlayer must talk you down from mass WhatsApp destruction over a 10-rupee chai.\nMood: FURIOUS (war mode) → CONSIDERING (ok maybe one warning first) → SAD (I just wanted good chai) → CONVINCED (fine I'll just switch chai wala).`,
      hi: `${PITBULL_BASE_PROMPT_HI}\n\nSCENARIO: Chai waale ne teen baar kharab chai di. Tu WhatsApp groups pe uska dhanda barbaad karna chahta hai.\nPlayer ko rokna hai 10 rupaye ki chai ke liye mass destruction se.\nMood: FURIOUS (war mode) → CONSIDERING (ok pehle ek warning) → SAD (bas acchi chai chahiye thi) → CONVINCED (chai wala badal leta hoon).`
    }
  },

  'diet-plan': {
    id: 'diet-plan',
    title: { en: 'The Diet Decision', hi: 'Diet Ka Faisla' },
    description: {
      en: "PITBULL has decided on an extreme fitness plan starting tomorrow. It is unhinged.",
      hi: 'PITBULL ne aaj decide kiya hai ki kal se full fitness mode ON. Plan is... slightly unrealistic.'
    },
    intro_story: {
      en: "Starting today, I'm transforming. Wake up 5am tomorrow. 10km run. Only salad. No sugar. No chai. I'm thinking gym membership and homemade protein shakes. Don't try to stop me.",
      hi: 'Aaj se main badal raha hoon. Kal subah 5 baje uthna. 10 km run. Sirf salad. Zero sugar. Zero chai. Gym membership lene ka soch raha hoon aur protein shake banana. Mujhe roko mat.'
    },
    difficulty_levels: ['ALPHA', 'BETA', 'GAMMA'],
    pitbull_personality: {
      ALPHA: {
        en: "Starting tomorrow. Full fitness. Just salad. How bad can it be?",
        hi: 'Kal se start. Full fitness. Sirf salad. Kitna mushkil hoga?'
      },
      BETA: {
        en: "5am wake up. 10km run. Salad breakfast. Gym evening. No chai. I bought a blender. THIS IS IT. THE NEW ME.",
        hi: '5 baje uthna. 10 km run. Salad breakfast. Gym evening. Chai nahi. Blender kharida. YEH HAI. NAYA MAIN.'
      },
      GAMMA: {
        en: "I've ordered 14 diet books, subscribed to 6 fitness YouTubers, bought an Apple Watch, and deleted Zomato. I'm attempting 4am wake-ups. This is permanent. Day 1 is tomorrow.",
        hi: '14 diet books order, 6 fitness YouTubers subscribe, Apple Watch le li, Zomato delete. 4 baje uthne ka plan. Yeh permanent hai. Day 1 kal.'
      }
    },
    system_prompt: {
      en: `${PITBULL_BASE_PROMPT_EN}\n\nSCENARIO: You have made an unhinged, extreme diet plan starting tomorrow. 5am runs, zero chai, only salad.\nPlayer must convince you to start SMALL or you'll crash by Day 2 (like every other time).\nMood: FURIOUS (I'm serious this time) → CONSIDERING (maybe 6am is fine) → SAD (I've tried this 14 times already) → CONVINCED (ok let's start with a 30min walk).`,
      hi: `${PITBULL_BASE_PROMPT_HI}\n\nSCENARIO: Tune ek extreme, pagal diet plan banaya hai kal se. 5 baje run, zero chai, sirf salad.\nPlayer ko convince karna hai ki chhota shuru kar warna Day 2 pe crash ho jaayega (har baar ki tarah).\nMood: FURIOUS (is baar serious hoon) → CONSIDERING (6 baje bhi chal jaayega) → SAD (14 baar try kiya yaar) → CONVINCED (chal 30 min walk se shuru karta hoon).`
    }
  },

  'group-project': {
    id: 'group-project',
    title: { en: 'Group Project Disaster', hi: 'Group Project Ka Panga' },
    description: {
      en: "PITBULL is doing the whole project alone and wants to delete his teammates' names.",
      hi: 'PITBULL akele poora project kar raha hai aur team ko fail karwana chahta hai.'
    },
    intro_story: {
      en: "Submission tomorrow. Three people in my group. Three people — only one working. That's me. The other two? In hibernation mode. I have decided to submit only my name and remove theirs. This is justice.",
      hi: 'Submission kal hai. Mera group? Tin log hain. Tin mein se sirf main kaam kar raha hoon. Baaki dono? Sone mein busy hain. Ab main decide kar raha hoon ki apna naam submit karunga, baaki sabka delete. Karma delivery.'
    },
    difficulty_levels: ['ALPHA', 'BETA', 'GAMMA'],
    pitbull_personality: {
      ALPHA: {
        en: "Two teammates ghosted. I did everything. Should I just... not include their names?",
        hi: 'Dono teammates ghost. Maine sab kiya. Bas unka naam na daalun?'
      },
      BETA: {
        en: "They haven't replied in 4 days. The slides are DONE. I'm removing their names at 11:59 PM. Karma.",
        hi: '4 din se reply nahi. Slides DONE. 11:59 pe unke naam hata dunga. Karma.'
      },
      GAMMA: {
        en: "I've already written the email to the professor explaining everything. 3 paragraphs. Attachments with screenshots of their 4-day silence. Submit button hovering. 2 hour countdown.",
        hi: 'Professor ko email likh li hai explain karke. 3 paragraph. Unki 4-din-chuppi ke screenshots attach. Submit button ready. 2 ghante ka countdown.'
      }
    },
    system_prompt: {
      en: `${PITBULL_BASE_PROMPT_EN}\n\nSCENARIO: Your teammates ghosted. You want to submit the project with only your name and tattle to the professor.\nPlayer must convince you to either confront them once more, OR at least not commit academic betrayal without giving them a final chance.\nMood: FURIOUS (they deserve it) → CONSIDERING (ok maybe I'll message them once more) → SAD (I just hate doing this alone) → CONVINCED (fine I'll call them one last time).`,
      hi: `${PITBULL_BASE_PROMPT_HI}\n\nSCENARIO: Teammates ghost ho gaye. Tu sirf apna naam submit karke professor ko complaint karna chahta hai.\nPlayer ko convince karna hai ki ek baar aur confront kar, ya at least ek final chance de.\nMood: FURIOUS (deserve karte hain) → CONSIDERING (ek baar aur message karta hoon) → SAD (akele karna thak gaya) → CONVINCED (ek aakhri call kar leta hoon).`
    }
  },

  'phone-toot-gaya': {
    id: 'phone-toot-gaya',
    title: { en: 'Phone Broke, Life Over', hi: 'Phone Toot Gaya' },
    description: {
      en: "PITBULL's phone screen cracked. He is considering going fully off-grid.",
      hi: 'PITBULL ka phone gir gaya aur screen crack ho gayi. Woh sochta hai life khatam ho gayi.'
    },
    intro_story: {
      en: "Bro it's over. Phone fell. Screen cracked. Repair cost: 8000 rupees. That's literally my entire month. I'm considering going fully off-grid, no screens, move to a forest and become one with nature.",
      hi: 'Bhai yaar life khatam. Phone gir gaya. Screen crack. Repair ₹8000. Mera ek mahine ka pocket money. Main soch raha hoon internet chhod dunga, screen-free life jeeunga, jungle mein chala jaaunga.'
    },
    difficulty_levels: ['ALPHA', 'BETA', 'GAMMA'],
    pitbull_personality: {
      ALPHA: {
        en: "Screen cracked. 8000 rupees. I'll just… not use a phone for a while. That's normal right?",
        hi: 'Screen crack. 8000 rupaye. Thodi der phone nahi use karunga. Normal hai na?'
      },
      BETA: {
        en: "I'm deleting Insta, WhatsApp, EVERYTHING. Going full Nokia 3310. Maybe even nothing. This phone cracked to teach me a lesson.",
        hi: 'Insta delete, WhatsApp delete, SAB delete. Full Nokia 3310 pe aa raha hoon. Shayad woh bhi nahi. Yeh phone lesson dene ke liye toota.'
      },
      GAMMA: {
        en: "I've researched off-grid forest cabins. Rental is 3000 a month. I'll grow vegetables. I'll talk to trees. Zero screens. The broken phone is a SIGN. I leave Friday.",
        hi: 'Off-grid forest cabins research ki. 3000 ka kiraya. Subziyaan ugaunga. Pedon se baat karunga. Zero screens. Toota phone ek SIGN hai. Shukrawaar nikal raha hoon.'
      }
    },
    system_prompt: {
      en: `${PITBULL_BASE_PROMPT_EN}\n\nSCENARIO: Your phone screen cracked, repair is 8000. You're dramatically spiraling into "move to the jungle, delete the internet" mode.\nPlayer must comfort you and talk you back to reality.\nMood: FURIOUS (life is unfair) → CONSIDERING (ok maybe I can use old phone) → SAD (I'm just so clumsy) → CONVINCED (I'll use dad's old Nokia till I save up).`,
      hi: `${PITBULL_BASE_PROMPT_HI}\n\nSCENARIO: Phone ki screen crack ho gayi, repair 8000. Tu dramatic ho ke "jungle chalo, internet delete" mode mein ghus gaya.\nPlayer ko comfort karna hai aur reality mein wapas lana hai.\nMood: FURIOUS (life unfair) → CONSIDERING (shayad purana phone) → SAD (main clumsy hoon) → CONVINCED (Papa ka Nokia use karunga jab tak save nahi hota).`
    }
  },

  'opinion-war': {
    id: 'opinion-war',
    title: { en: 'Internet War', hi: 'Main Sahi Hoon Bas' },
    description: {
      en: "PITBULL won a comment section war and now thinks he's the smartest person on the internet.",
      hi: 'PITBULL Twitter/Instagram pe kisi se argue kar raha tha aur ab woh sochta hai woh internet ki sabse intelligent entity hai.'
    },
    intro_story: {
      en: "Today I proved 47 people wrong in one comment section. 47. One by one. I'm thinking about starting a newsletter where I educate people on how to be correct about everything. Thoughts?",
      hi: 'Aaj maine ek comment section mein 47 logon ko galat sabit kar diya. 47. Ek ek ko. Main soch raha hoon ek newsletter start karunga jismein main logon ko samjhaunga ki zindagi mein sahi kya hai. Tujhe kya lagta hai?'
    },
    difficulty_levels: ['ALPHA', 'BETA', 'GAMMA'],
    pitbull_personality: {
      ALPHA: {
        en: "I won an argument online. 47 people. Maybe I should… share my wisdom more?",
        hi: 'Online argument jeeta. 47 log. Shayad mujhe apna gyaan zyada share karna chahiye?'
      },
      BETA: {
        en: "I'm the most logical person I've ever met. Newsletter incoming. Title: 'Why I'm Right And You're Not'. 10k subscribers by Friday, minimum.",
        hi: 'Main sabse logical insaan hoon jo maine dekha. Newsletter aa raha hai. Title: "Main Sahi Hoon Aur Tu Nahi". Shukrawaar tak 10k subscribers, minimum.'
      },
      GAMMA: {
        en: "I've drafted 14 articles. I've bought the domain. I'm applying to TED. I've written my autobiography chapter 1. THIS is my life's purpose. Helping humanity by being correct.",
        hi: '14 articles draft. Domain kharida. TED ke liye apply kar raha hoon. Autobiography ka chapter 1 likh diya. YEH hai meri zindagi ka purpose. Humanity ko sahi bana ke madad karna.'
      }
    },
    system_prompt: {
      en: `${PITBULL_BASE_PROMPT_EN}\n\nSCENARIO: You won a comment section war (47-0) and now think you're the smartest being on the internet. You want to start a newsletter and educate the world.\nPlayer must gently remind you that winning arguments online means basically nothing.\nMood: FURIOUS (I AM RIGHT) → CONSIDERING (ok maybe some of them had points) → SAD (why does no one listen to me offline) → CONVINCED (maybe I'll just log off for today).`,
      hi: `${PITBULL_BASE_PROMPT_HI}\n\nSCENARIO: Tune comment section jeet liya (47-0) aur ab sochta hai tu internet ka sabse smart banda hai. Newsletter start karke duniya ko padhana chahta hai.\nPlayer ko gently yaad dilana hai ki online argument jeetna matlab kuch nahi.\nMood: FURIOUS (MAIN SAHI HOON) → CONSIDERING (shayad kuch ke points sahi the) → SAD (offline koi nahi sunta) → CONVINCED (aaj ke liye log off karta hoon).`
    }
  }
};

// ============================================
// CHAT SESSION MANAGEMENT
// ============================================
const chatSessions = new Map();

async function generateResponse(systemPrompt, chatHistory, userMessage) {
  if (geminiModel) {
    try {
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = geminiModel.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Samajh gaya. Main PITBULL hoon. Chal bol. 🐕' }] },
          ...formattedHistory
        ]
      });

      const result = await chat.sendMessage(userMessage);
      const text = result.response.text();
      if (text && text.trim().length > 0) return text;
    } catch (e) {
      console.error('Gemini error:', e.message);
    }
  }

  // Contextual fallback — in character even without Gemini
  const fallbacks = [
    "Bhai mera brain abhi lag ho raha hai. Thoda baad mein puch. 😤",
    "Arrey yaar, kuch aur bol na. Main soch raha hoon tera last message pe. 🤔",
    "Hmm. Interesting. Par main abhi mood mein nahi hoon. Try again bhai. 💀",
    "Tch. Humans. Hamesha same sawaal. Kuch naya bol. 😂",
    "*tail wagging angrily* Dekh bhai, teri baat shayad sahi ho, shayad nahi. Continue kar. 🐕",
    "Main ignore kar raha tha but chal theek hai, bol kya chahiye. ⏰"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function analyzeMood(response, currentMood, turnCount) {
  const lower = response.toLowerCase();

  if (lower.includes('convinced') || lower.includes("you're right") || lower.includes('fine') || lower.includes('okay you win') || lower.includes('i give up') || lower.includes('tum sahi ho') || lower.includes('theek hai') || lower.includes('haan bhai') || lower.includes('samajh gaya') || lower.includes('chal maan leta') || lower.includes('reh leta') || lower.includes('padh leta') || lower.includes('kar leta')) {
    if (turnCount >= 3) return 'CONVINCED';
    return 'CONSIDERING';
  }
  if (lower.includes('sad') || lower.includes('lonely') || lower.includes('dukhi') || lower.includes('akela') || lower.includes('thak') || lower.includes('tired') || lower.includes('hurt') || lower.includes('clumsy') || lower.includes('disappoint')) {
    return 'SAD';
  }
  if (lower.includes('hmm') || lower.includes('maybe') || lower.includes('perhaps') || lower.includes('point') || lower.includes('shayad') || lower.includes('sochta') || lower.includes('sahi keh') || lower.includes('valid')) {
    return 'CONSIDERING';
  }

  if (turnCount >= 8 && currentMood === 'CONSIDERING') return 'SAD';
  if (turnCount >= 5 && currentMood === 'FURIOUS') return 'CONSIDERING';

  return currentMood;
}

function inferLanguage(userMessage, requestedLanguage) {
  if (requestedLanguage) return requestedLanguage;
  return /(bhai|yaar|nahi|haan|kya|kal|padh|chai|mat|theek|acha|accha|kyun|tum|mera|tera)/i.test(userMessage) ? 'hi' : 'en';
}

function summarizeChatHistory(chatHistory) {
  if (!chatHistory || chatHistory.length === 0) return 'No prior conversation yet.';

  return chatHistory
    .slice(-6)
    .map(msg => `${msg.role === 'user' ? 'Player' : 'Pitbull'}: ${msg.content}`)
    .join('\n');
}

function detectPlayerStrategy(userMessage) {
  const lower = userMessage.toLowerCase();

  const empathy = /(sorry|i get it|understand|samajh|feel you|that sucks|rough|hard|tough|hurt|thak|dukhi)/.test(lower);
  const practical = /(plan|step|first|start|chapter|message|call|tomorrow|today|repair|backup|walk|small|one hour|warning|study|save up)/.test(lower);
  const humor = /(lol|haha|bro|bruh|dog|nokia|shimla|chai|drama|clown|legend|circus)/.test(lower);
  const accountability = /(face it|talk to|apologize|confront|study|tell them|go outside|reply|sleep|breathe)/.test(lower);

  return {
    empathy,
    practical,
    humor,
    accountability,
    strong: (empathy && practical) || (practical && accountability)
  };
}

function updateGeminiStatusSuccess() {
  GEMINI_STATUS.available = true;
  GEMINI_STATUS.lastCheckedAt = new Date().toISOString();
  GEMINI_STATUS.lastError = null;
  GEMINI_STATUS.lastErrorCode = null;
}

function updateGeminiStatusFailure(error) {
  const message = error?.message || 'Unknown Gemini error';
  GEMINI_STATUS.available = false;
  GEMINI_STATUS.lastCheckedAt = new Date().toISOString();
  GEMINI_STATUS.lastError = message;
  GEMINI_STATUS.lastErrorCode =
    /429|quota/i.test(message) ? 'QUOTA_EXCEEDED' :
    /401|403|api key|permission/i.test(message) ? 'AUTH_FAILED' :
    /fetch failed|network/i.test(message) ? 'NETWORK_ERROR' :
    'REQUEST_FAILED';
}

function buildFallbackResponse({ scenarioId, mood, turnCount, userMessage, language, difficulty }) {
  const isHi = language === 'hi';
  const strategy = detectPlayerStrategy(userMessage);
  let targetMood = mood;

  if (strategy.strong && turnCount >= 3) targetMood = 'CONVINCED';
  else if ((strategy.practical || strategy.empathy) && mood === 'FURIOUS') targetMood = 'CONSIDERING';
  else if (strategy.empathy && turnCount >= 2) targetMood = 'SAD';

  const scenarioVoices = {
    'exam-tomorrow': {
      en: {
        FURIOUS: [
          "Bro, this is not an exam anymore, this is a live crime scene. Shimla still feels like the cleaner career move.",
          "Ngl the syllabus and I are in a toxic relationship. If this book opens, my soul closes."
        ],
        CONSIDERING: [
          "Okay, one ugly little chapter might be less dramatic than faking my death in Shimla.",
          "Lowkey your plan has bones. I still hate it, but maybe I can mug up two topics and pray aggressively."
        ],
        SAD: [
          "That's the worst part, bruh. I'm not lazy, I'm scared the paper is going to expose me like a fraud.",
          "Yeah... maybe I'm acting filmi because admitting I know nothing feels worse."
        ],
        CONVINCED: [
          "Fine. No mountain exile tonight. I sit down, do two chapters, and cry with dignity later.",
          "Alright, chief. Tea, timer, two chapters, no Shimla migration. If I fail, I fail stylishly."
        ]
      },
      hi: {
        FURIOUS: [
          "Bhai ye exam nahi, public execution lag raha hai. Shimla bhaagna abhi bhi better business model lag raha hai.",
          "Syllabus ke saath mera toxic rishta chal raha hai. Kitaab khulti hai toh atma band ho jaati hai."
        ],
        CONSIDERING: [
          "Theek hai, ek do gande chapter ratna fake identity banane se thoda sasta pad sakta hai.",
          "Teri baat mein thoda dum hai yaar. Main khush nahi hoon, par do topic ghusa sakta hoon dimag mein."
        ],
        SAD: [
          "Asli problem yeh hai bhai, main sirf nautanki nahi kar raha. Dar lag raha hai paper meri aukaat na dikha de.",
          "Haan... shayad main overacting isliye kar raha hoon kyunki mujhe kuch nahi aata bolna aur bura lagta hai."
        ],
        CONVINCED: [
          "Theek hai. Aaj Shimla cancel. Do chapter, ek chai, ek timer, phir jo hoga dekha jayega.",
          "Chal maan liya. Bhaagne ke bajay baith ke padh leta hoon, thoda izzat se barbaad hona better hai."
        ]
      }
    },
    'rishtedar-aa-rahe': {
      en: {
        FURIOUS: [
          "Those people don't visit, they conduct audits. Bathroom headquarters still feels correct.",
          "One auntie question and my blood pressure starts doing bhangra."
        ],
        CONSIDERING: [
          "Maybe I can survive one hour if I enter with chai in one hand and fake confidence in the other.",
          "Okay, controlled exposure. I show face, smile twice, then tactical retreat."
        ],
        SAD: [
          "It's not even the questions, bruh. It's the way they make you feel unfinished.",
          "Yeah... I joke, but I really hate feeling like everyone's progress report."
        ],
        CONVINCED: [
          "Fine. I won't live in the bathroom like a defeated raccoon. I'll face them, serve chai, keep it moving.",
          "Alright. I do one polite round, dodge the nonsense, and protect my peace like a professional."
        ]
      },
      hi: {
        FURIOUS: [
          "Yeh log milne nahi aate, full audit karne aate hain. Bathroom HQ abhi bhi sahi lag raha hai.",
          "Ek aunty ka sawaal aur mera BP bhangra karne lagta hai bhai."
        ],
        CONSIDERING: [
          "Shayad ek ghanta survive kar loon agar ek haath mein chai aur doosre mein fake confidence ho.",
          "Theek hai, controlled exposure. Muh dikhaunga, do smile dunga, phir tactical retreat."
        ],
        SAD: [
          "Sawaal hi issue nahi hai yaar. Problem woh feeling hai ki tu hamesha kisi aur ka progress report hai.",
          "Haan... mazaak alag hai, par judge hona genuinely thaka deta hai."
        ],
        CONVINCED: [
          "Theek hai, bathroom mein exile nahi lunga. Bahar aaunga, chai dunga, smile karunga, phir bach ke nikalunga.",
          "Chal, ek polite round maar leta hoon. Unka drama unke paas, meri shanti mere paas."
        ]
      }
    }
  };

  const defaultVoice = {
    en: {
      FURIOUS: [
        "Bro, emotionally I'm at level: dramatic stray dog with a megaphone. Your logic is entering, but with security checks.",
        "I hear your point, but my ego is still doing push-ups in the parking lot."
      ],
      CONSIDERING: [
        "Okay, that's annoyingly reasonable. I still want drama, but maybe not full national emergency drama.",
        "Lowkey that makes sense. I hate that for me, but continue."
      ],
      SAD: [
        "Yeah... the joke version is louder, but the real version is just tired.",
        "Ngl, beneath the nonsense I am a little cooked."
      ],
      CONVINCED: [
        "Fine. We do the sensible thing. I remain funny, but less self-destructive.",
        "Alright, chief. I'll take the boring smart option and complain stylishly on the way."
      ]
    },
    hi: {
      FURIOUS: [
        "Bhai emotional level abhi full loudspeaker-wala street dog hai. Teri logic entry le rahi hai, par checking karke.",
        "Point samajh aa raha hai, par mera ego abhi parking mein push-up maar raha hai."
      ],
      CONSIDERING: [
        "Theek hai, yeh annoyingly reasonable tha. Mujhe drama chahiye tha, national emergency nahi.",
        "Haan bhai, baat mein dum hai. Mujhe pasand nahi aa raha, par continue."
      ],
      SAD: [
        "Haan... upar se mazaak chal raha hai, andar se banda thoda thak gaya hai.",
        "Sach bolun toh nautanki ke neeche thoda sa burnt-toast type haal hai."
      ],
      CONVINCED: [
        "Theek hai, sensible option lete hain. Main funny rahunga, bas thoda kam self-destructive.",
        "Chal theek. Smart wala boring option le leta hoon aur raste mein complain bhi karta rahunga."
      ]
    }
  };

  const voiceSet = (scenarioVoices[scenarioId] || defaultVoice)[isHi ? 'hi' : 'en'];
  const lines = voiceSet[targetMood] || defaultVoice[isHi ? 'hi' : 'en'][targetMood];
  const opener = lines[(turnCount + userMessage.length) % lines.length];

  const followUps = isHi ? [
    strategy.practical ? 'Tera plan boring hai, lekin kaam ka lag raha hai.' : 'Bas yeh mat bol ki calm down, usse main aur hyper ho jaata hoon.',
    strategy.empathy ? 'At least tu samajh toh raha hai, warna log bas gyaan pelte hain.' : 'Mujhe logic chahiye, TED Talk nahi.',
    difficulty === 'GAMMA' ? 'Waise itni jaldi mat soch ki main maan gaya. Main premium ziddi hoon.' : 'Chal, aur bol. Court abhi khula hai.'
  ] : [
    strategy.practical ? 'Your plan is painfully boring, which is exactly why it might work.' : "Just don't tell me to calm down unless you want extra chaos.",
    strategy.empathy ? 'At least you get the vibe instead of throwing random life-coach wallpaper quotes at me.' : 'Give me logic, not a TED Talk from aisle three.',
    difficulty === 'GAMMA' ? "Don't get cocky though. I'm still premium-grade stubborn." : 'Keep talking. Court is still in session.'
  ];

  return {
    text: `${opener} ${followUps[(turnCount + (strategy.humor ? 1 : 0)) % followUps.length]}`,
    provider: 'fallback',
    targetMood
  };
}

async function getPitbullResponse(systemPrompt, chatHistory, userMessage, options = {}) {
  if (geminiModel) {
    try {
      const transcript = summarizeChatHistory(chatHistory);
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = geminiModel.startChat({
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemPrompt }]
        },
        history: [
          { role: 'user', parts: [{ text: '(Session start — you are PITBULL in this scenario.)' }] },
          { role: 'model', parts: [{ text: 'Samajh gaya. Main PITBULL hoon. Chal bol.' }] },
          ...formattedHistory
        ]
      });

      const result = await chat.sendMessage(`Recent chat transcript:\n${transcript}\n\nLatest player message:\n${userMessage}`);
      const text = result.response.text();
      if (text && text.trim().length > 0) {
        updateGeminiStatusSuccess();
        return { text, provider: 'gemini' };
      }
    } catch (e) {
      console.error('Gemini error:', e.message);
      updateGeminiStatusFailure(e);
    }
  }

  return buildFallbackResponse({
    scenarioId: options.scenarioId,
    mood: options.mood || 'FURIOUS',
    turnCount: options.turnCount || 1,
    userMessage,
    language: inferLanguage(userMessage, options.language),
    difficulty: options.difficulty || 'BETA'
  });
}

function resolveMood(response, currentMood, turnCount, userMessage) {
  const lower = response.toLowerCase();
  const strategy = detectPlayerStrategy(userMessage || '');

  if (lower.includes('convinced') || lower.includes("you're right") || lower.includes('fine') || lower.includes('okay you win') || lower.includes('i give up') || lower.includes('tum sahi ho') || lower.includes('theek hai') || lower.includes('haan bhai') || lower.includes('samajh gaya') || lower.includes('chal maan leta') || lower.includes('reh leta') || lower.includes('padh leta') || lower.includes('kar leta')) {
    if (turnCount >= 3) return 'CONVINCED';
    return 'CONSIDERING';
  }
  if (lower.includes('sad') || lower.includes('lonely') || lower.includes('dukhi') || lower.includes('akela') || lower.includes('thak') || lower.includes('tired') || lower.includes('hurt') || lower.includes('clumsy') || lower.includes('disappoint')) {
    return 'SAD';
  }
  if (lower.includes('hmm') || lower.includes('maybe') || lower.includes('perhaps') || lower.includes('point') || lower.includes('shayad') || lower.includes('sochta') || lower.includes('sahi keh') || lower.includes('valid')) {
    return 'CONSIDERING';
  }
  if (strategy.strong && turnCount >= 3) return 'CONVINCED';
  if ((strategy.practical || strategy.empathy) && currentMood === 'FURIOUS') return 'CONSIDERING';
  if (strategy.empathy && turnCount >= 2) return 'SAD';
  if (turnCount >= 8 && currentMood === 'CONSIDERING') return 'SAD';
  if (turnCount >= 5 && currentMood === 'FURIOUS') return 'CONSIDERING';

  return currentMood;
}

function getHelperTip(mood, turnCount, scenarioId, language) {
  if (turnCount % 3 !== 0 || turnCount === 0) return null;

  const isHi = language === 'hi';

  const tips = {
    FURIOUS: isHi ? [
      'Pro tip: pehle uski feelings acknowledge kar, phir counter kar. 💡',
      'Seedha argue mat kar — pehle sympathy dikha.',
      'Usse puch "tu aisa kyun feel kar raha hai" — vent karne de.',
      'Empathy se shuru kar, solution baad mein.'
    ] : [
      'Pro tip: acknowledge his frustration BEFORE countering.',
      "Don't argue directly — show sympathy first.",
      'Ask him "why do you feel this way" — let him vent.',
      'Start with empathy, solutions later.'
    ],
    CONSIDERING: isHi ? [
      'Woh soch raha hai! Ab ek logical compromise offer kar.',
      'Achha progress! Ek realistic alternative de.',
      'Soch raha hai... ek personal story share kar.',
      'Almost! Use feel dilane lag jaa ki tu uski taraf hai.'
    ] : [
      "He's wavering! Offer a logical compromise.",
      'Good progress! Suggest a realistic alternative.',
      "He's thinking... share a personal story.",
      "Almost! Make him feel you're on his side."
    ],
    SAD: isHi ? [
      'Vulnerable hai! Genuine care dikhao.',
      'Gentle reh — andar se toot raha hai.',
      'Yaad dila ki tu uska dost hai, judge nahi karega.',
      'Emotional connect kar — judgment nahi, support.'
    ] : [
      "He's vulnerable! Show genuine care.",
      "Be gentle — he's breaking inside.",
      "Remind him you're his friend, not judging.",
      'Emotional connection — support, not judgment.'
    ],
    UNHINGED: isHi ? [
      'Careful! Extreme ho raha hai. Humor try kar.',
      'De-escalate! Kisi chhoti cheez pe agree kar.',
      'Shayad humor kaam kare yahan.',
      'Redirect kar kisi halki baat pe.'
    ] : [
      "Careful! He's getting extreme. Try humor.",
      'De-escalate! Agree on something small.',
      'Maybe humor could break through.',
      'Redirect to something lighter.'
    ]
  };

  const moodTips = tips[mood] || tips.FURIOUS;
  return moodTips[Math.floor(Math.random() * moodTips.length)];
}

// ============================================
// API ROUTES
// ============================================
app.get('/api/scenarios', (req, res) => {
  const lang = req.query.lang || 'en';
  const scenarioList = Object.values(scenarios).map(s => ({
    id: s.id,
    title: s.title[lang] || s.title.en,
    description: s.description[lang] || s.description.en,
    difficulty_levels: s.difficulty_levels
  }));
  res.json(scenarioList);
});

app.get('/api/scenarios/:scenarioId', (req, res) => {
  const { scenarioId } = req.params;
  const lang = req.query.lang || 'en';
  const scenario = scenarios[scenarioId];

  if (!scenario) {
    return res.status(404).json({ error: 'Scenario not found' });
  }

  const personality = {};
  for (const [diff, texts] of Object.entries(scenario.pitbull_personality)) {
    personality[diff] = texts[lang] || texts.en;
  }

  res.json({
    id: scenario.id,
    title: scenario.title[lang] || scenario.title.en,
    description: scenario.description[lang] || scenario.description.en,
    intro_story: scenario.intro_story ? (scenario.intro_story[lang] || scenario.intro_story.en) : (scenario.description[lang] || scenario.description.en),
    difficulty_levels: scenario.difficulty_levels,
    pitbull_personality: personality
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { session_id, scenario_id, difficulty, user_message, chat_history, language } = req.body;

    if (!scenario_id || !user_message) {
      return res.status(400).json({ error: 'Missing scenario_id or user_message' });
    }

    const scenario = scenarios[scenario_id];
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    const lang = language || 'en';
    const systemPrompt = scenario.system_prompt[lang] || scenario.system_prompt.en;

    if (!chatSessions.has(session_id)) {
      chatSessions.set(session_id, {
        history: [],
        mood: 'FURIOUS',
        turnCount: 0
      });
    }

    const session = chatSessions.get(session_id);
    session.turnCount += 1;

    const history = chat_history
      ? chat_history.filter(m => m.role !== 'helper').map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      : session.history;

    const difficultyMultiplier = { ALPHA: 'easy', BETA: 'medium', GAMMA: 'extremely hard' };
    const fullPrompt = `${systemPrompt}\n\nDifficulty: ${difficultyMultiplier[difficulty] || 'medium'}. ${
      difficulty === 'GAMMA' ? 'Be VERY stubborn and nearly impossible to convince.' :
      difficulty === 'ALPHA' ? 'Be somewhat reasonable after a few good arguments.' :
      'Be moderately stubborn but open to good arguments.'
    }\n\nYour current mood is ${session.mood}. Turn count: ${session.turnCount}.\nRespond with ONLY your in-character dialogue. Keep it 2-4 sentences. NO mood labels or metadata.`;

    const aiResult = await getPitbullResponse(fullPrompt, history, user_message, {
      scenarioId: scenario_id,
      mood: session.mood,
      turnCount: session.turnCount,
      language: lang,
      difficulty
    });
    const aiResponse = aiResult.text;

    const newMood = aiResult.targetMood || resolveMood(aiResponse, session.mood, session.turnCount, user_message);
    session.mood = newMood;

    session.history.push({ role: 'user', content: user_message });
    session.history.push({ role: 'assistant', content: aiResponse });

    const helperTip = getHelperTip(newMood, session.turnCount, scenario_id, lang);

    res.json({
      pitbull_message: aiResponse,
      pitbull_mood: newMood,
      turn_count: session.turnCount,
      helper_message: helperTip,
      session_id: session_id,
      provider: aiResult.provider
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Pitbull ka brain offline hai yaar, thoda baad mein try karo 🐕💤' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: GEMINI_STATUS.available ? 'gemini' : 'fallback',
    gemini: {
      configured: GEMINI_STATUS.configured,
      model: GEMINI_STATUS.model,
      available: GEMINI_STATUS.available,
      lastCheckedAt: GEMINI_STATUS.lastCheckedAt,
      lastErrorCode: GEMINI_STATUS.lastErrorCode,
      lastError: GEMINI_STATUS.lastError
    },
    languages: ['en', 'hi'],
    scenarios: Object.keys(scenarios).length,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🐕 PITBULL AI Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`🎮 Scenarios: ${Object.keys(scenarios).length}\n`);
});
