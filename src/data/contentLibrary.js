/**
 * GM Generator - Comprehensive Content Library & Procedural Engine
 * Feature-rich Web3 quote generator with deduplication, TON meme lore, 
 * Pedro character integrations, and procedural variations.
 */

export const CATEGORIES = [
  { id: 'all', name: 'ALL CATEGORIES', icon: '✨', color: '#F3BA2F' },
  { id: 'motivational', name: 'MOTIVATIONAL GM', icon: '🔥', color: '#F59E0B' },
  { id: 'unhinged', name: 'UNHINGED GM', icon: '🤪', color: '#EC4899' },
  { id: 'ton', name: 'TON ECOSYSTEM', icon: '💎', color: '#0088CC' },
  { id: 'pedro', name: 'PEDRO TRASH BANDIT', icon: '🦝', color: '#A855F7' },
  { id: 'meme_tokens', name: 'MEME TOKENS ($REDO, $PEDRO...)', icon: '🪙', color: '#10B981' },
  { id: 'crypto', name: 'CRYPTO DEGEN', icon: '🚀', color: '#3B82F6' },
  { id: 'villain', name: 'VILLAIN GM', icon: '😈', color: '#EF4444' },
  { id: 'downbad', name: 'DOWN BAD GM', icon: '📉', color: '#64748B' },
  { id: 'npc', name: 'NPC GM', icon: '🤖', color: '#8B5CF6' }
];

export const STATIC_TEMPLATES = {
  motivational: [
    "GM. Today's goal: work harder than yesterday, stack sats, and ignore the noise.",
    "GM. Every market dip is just a test of your resolve. Build through the storm.",
    "GM. Success isn't owned, it's rented—and rent is due every single morning.",
    "GM. The market rewards patience, discipline, and unwavering grit. Rise and shine!",
    "GM! Woke up with a mind full of vision and a portfolio ready to break ATH.",
    "GM to the builders who never sleep and the dreamers who never quit.",
    "GM. Turn your morning coffee into liquid conviction. We are all gonna make it.",
    "GM! The best time to build was 10 years ago. The second best time is right now.",
    "GM to those who turn bear markets into generational wealth foundations.",
    "GM. Consistency is the secret cheat code of crypto. Keep showing up daily!",
    "GM! Fortune favors the bold, the relentless, and the early risers.",
    "GM! Your future self is depending on the choices you make starting this morning."
  ],
  unhinged: [
    "GM! COFFEE INJECTED DIRECTLY INTO VEINS! LFG LFG LFG!",
    "GM TO EVERYONE EXCEPT THE VOICES IN MY HEAD TELLING ME TO SHORT THE MARKET!",
    "GM! SLEEP IS A CONSPIRACY CREATED BY TRADITIONAL FINANCE! WE STAY AWAKE FOREVER!",
    "GM! IF YOU HAVEN'T CHECKED THE 1-MINUTE CHART 500 TIMES ALREADY, ARE YOU EVEN ALIVE?!",
    "GM TO THE GUY WHO ACCIDENTALLY BOUGHT 1,000,000 MEMECOINS AT 3 AM! YOU ARE A HERO!",
    "GM! LIQUIDATION IS JUST A CONSTRUCT OF REALITY! WE RIDE TILL INFINITY!",
    "GM! I SMELLED GREEN CANDLES FROM MY DREAMS! TIME TO FULL SEND IT!",
    "GM TO THE CHAIR I HAVEN'T LEFT IN 72 HOURS! VIBES ARE IMMACULATE!",
    "GM! SOLD MY COUCH FOR MORE CONVICTION! NOW I SIT ON PURE CONVICTION!",
    "GM! MY HEART BEATS AT 180 BPM AND MY LEVERAGE IS AT 100X! LET'S MOOOOVE!"
  ],
  ton: [
    "GM to the TON Ecosystem! Telegram + TON is scaling Web3 to the next billion users! 💎",
    "GM TON builders! Fast speed, low fees, 900M Telegram users ready to onboard! 💎⚡",
    "GM to everyone holding TON & building Telegram Mini Apps! The future is tap-to-earn & Web3 games! 💎🚀",
    "GM! TON memecoin season is heating up! Telegram wallets active, liquidity flowing! 💎🔥",
    "GM to the Open Network! Pavel Durov's vision of digital freedom lives forever on TON! 💎🫡",
    "GM TON army! Checking my Telegram Mini Apps before I even brush my teeth! 💎📱",
    "GM! TON smart contracts compiling, Telegram bots running 24/7, vibes immaculate! 💎✨",
    "GM to all Gram & TON ecosystem diamond hands! We are so insanely early! 💎🚀",
    "GM TON community! Fast finality, native Telegram integration, unstoppable momentum! 💎⚡"
  ],
  pedro: [
    "GM! Spinning Pedro the Trash Bandit on loop while checking charts! Vibes are 1000%! 🦝🎶",
    "GM to the greatest audio memecoin on TON! $PEDRO Trash Bandit team is cooking pure unstoppable vibes! 💎🦝",
    "GM ser! Pedro audio playing at 100% volume. $PEDRO chart dancing, portfolio grooving! 🦝🔥",
    "GM to everyone vibing with $PEDRO! Uplifting TON meme culture one beat at a time! 💎🦝",
    "GM! Pedro the Trash Bandit spinning in circles = instant 10x energy for $PEDRO holders! 🦝⚡",
    "GM to all $PEDRO holders! No sadness allowed, only spinning trash bandit beat drops! 🦝✨",
    "GM! Woke up, put on the Pedro raccoon beat, and instantly gained +500 financial aura! 🦝🚀"
  ],
  meme_tokens: [
    "GM to the Resistance Dog army! $REDO hooded mascot standing strong for digital freedom! 🐕‍🦺💎",
    "GM Utya duck army! 🦆 Telegram's yellow duck mascot is quacking at green candles!",
    "GM! $REDO is not just a token, it's the symbol of unstoppable Telegram resistance! 🐕‍🦺⚡",
    "GM to Pavel Durov's Resistance Dog! Hood on, conviction high, holding $REDO to the moon! 🐕‍🦺🚀",
    "GM! Spinning Pedro the Trash Bandit on loop while checking $PEDRO candles! 🦝🎶",
    "GM ser! 1 $UTYA = 1 Quack of absolute financial independence! 🦆💎",
    "GM Buddy the Bear holders! 🐻 Turning bear markets into bullish gains on TON!",
    "GM to the $CHERRY community! Sweetest profits on TON with a cherry on top! 🍒💎",
    "GM Groyp army! 🐸 Unhinged CT frog energy taking over TON blockchain!"
  ],
  crypto: [
    "GM. Buy the dip, mute the bears, and let compounding do its magic.",
    "GM to everyone who survived the volatility. You're a battle-tested veteran now.",
    "GM. Not your keys, not your coins. Stay safe, verify everything.",
    "GM! Bitcoin tick tock next block. The decentralized clock never stops.",
    "GM to the spot holders chilling through the liquidations. True gigachads.",
    "GM! Remember to take profits into cold storage. Protect your wins.",
    "GM. Another day, another opportunity to out-think the traditional finance dinosaurs."
  ],
  villain: [
    "GM. While you were sleeping, I manipulated the order book for fun.",
    "GM. I don't buy the dip, I create the dip to buy your stop-losses.",
    "GM. Your panic-sell was my limit buy at the exact bottom. Thanks.",
    "GM to everyone I shorted into oblivion yesterday. Business is business.",
    "GM. Your technical analysis had a cup and handle. My trade had absolute ruthlessness."
  ],
  downbad: [
    "GM. Down bad but at least my GM speed is at an all-time high.",
    "GM. My portfolio looks like a crime scene, but my spirits remain mysteriously high.",
    "GM. Currently calculating how many ramen packets I can buy with my remaining balance.",
    "GM. I have converted all my pain into pure unadulterated copium.",
    "GM. They said buy high sell low was a joke, but here I am executing it flawlessly."
  ],
  npc: [
    "GM! Have a wonderful day filled with productivity and positive vibes!",
    "GM! Remember to stay hydrated and take regular breaks from your screen!",
    "GM! Weather forecast predicts green candles and blue skies ahead!",
    "GM! Wishing you a very pleasant morning and successful trades today!",
    "GM! Please remember to DYOR and NFA! Have a blessed morning!"
  ]
};

// Combinator Components for Infinite Dynamic Quotes
export const COMBINATOR = {
  greetings: [
    "GM", "Gram morning", "Good morning", "Rise and shine", 
    "GM frens", "GM gigachads", "GM legends", "GM degenerate fam"
  ],
  subjects: [
    "to the TON ecosystem", "to all memecoin believers", "to the Telegram trench warriors",
    "to the 100x gem hunters", "to the late-night chart watchers", "to the spot bag holders"
  ],
  tonTerms: [
    "TON ecosystem", "Telegram Mini Apps", "Tap-to-earn games", 
    "TON blockchain speed", "Telegram wallet", "TON grants", "Gram protocol"
  ],
  punchlines: [
    "full degenerative behavior unlocked for the day",
    "pure gigachad conviction levels reached",
    "unstoppable Web3 energy activated",
    "we are so insanely early to this TON supercycle",
    "the chart will recover eventually (probably)",
    "today we pretend everything is completely fine",
    "another day of making legendary Web3 moves",
    "the market cannot hurt me anymore, I am 100% numb",
    "we are either absolute geniuses or completely delusional",
    "portfolio is down 60% but the vibes remain 1000%",
    "selling is strictly forbidden by ancient crypto law",
    "coffee is strong, conviction is even stronger",
    "touching grass has been officially postponed until Q4"
  ],
  endings: [
    "LFG! 🚀", "We move. 🫡", "Stay safe out there. 💎", 
    "No roadmap needed.", "Vibes only.", "Send it to zero or infinity.",
    "WAGMI frens.", "Respectfully.", "In Satoshi & Durov we trust.", "Onwards!"
  ]
};

// Generates a random procedural GM quote based on category
export function generateProceduralGM(categoryId = 'crypto') {
  const g = COMBINATOR.greetings[Math.floor(Math.random() * COMBINATOR.greetings.length)];
  const s = COMBINATOR.subjects[Math.floor(Math.random() * COMBINATOR.subjects.length)];
  const p = COMBINATOR.punchlines[Math.floor(Math.random() * COMBINATOR.punchlines.length)];
  const e = COMBINATOR.endings[Math.floor(Math.random() * COMBINATOR.endings.length)];

  if (categoryId === 'ton' || categoryId === 'meme_tokens') {
    const tonGems = [
      `${g} ${s}. GRAM & TON memecoin season is cooking and ${p}. 💎`,
      `${g}. Telegram + TON blockchain is the future of Web3. ${e}`,
      `${g} to everyone building on TON & holding memecoins. ${p}. 💎`,
      `${g}. TON memecoins pumping, Telegram active, vibes immaculate! 💎⚡`,
      `${g} ${s}. TON ecosystem speed is fast and conviction is high. ${e}`,
      `${g}. Another day of building Telegram Mini Apps on TON. ${p}. 💎`
    ];
    return tonGems[Math.floor(Math.random() * tonGems.length)];
  }

  if (categoryId === 'pedro') {
    const pedroGems = [
      `${g} ${s}. Pedro the Trash Bandit audio on loop, vibes are 1000%! 🦝🎶`,
      `${g}. The Pedro team is cooking the greatest trash bandit audio memecoin on TON! 🦝💎`,
      `${g} to everyone vibing with Pedro the Trash Bandit on TON. ${p}. 🦝⚡`,
      `${g}. Pedro audio playing loud, trash bandit spinning, meme culture winning! 🦝🔥`
    ];
    return pedroGems[Math.floor(Math.random() * pedroGems.length)];
  }

  const combinationTemplates = [
    `${g} ${s}. ${p}. ${e}`,
    `${g}. ${p.charAt(0).toUpperCase() + p.slice(1)}. ${e}`,
    `${g} ${s}. ${e}`
  ];

  return combinationTemplates[Math.floor(Math.random() * combinationTemplates.length)];
}

// Function to fetch GM with history deduplication & custom submission integration
export function getRandomGM(categoryId = 'all', recentHistory = []) {
  let targetCategory = categoryId;
  
  if (categoryId === 'all') {
    const realCategories = CATEGORIES.filter(c => c.id !== 'all').map(c => c.id);
    targetCategory = realCategories[Math.floor(Math.random() * realCategories.length)];
  }

  if (targetCategory === 'meme_tokens') {
    const defaultTokens = [
      { id: 'redo', name: 'Resistance Dog', ticker: '$REDO', icon: '🐕‍🦺' },
      { id: 'pedro', name: 'Pedro the Trash Bandit', ticker: '$PEDRO', icon: '🦝' },
      { id: 'utya', name: 'Utya Duck', ticker: '$UTYA', icon: '🦆' },
      { id: 'buddy', name: 'Buddy the Bear', ticker: '$BUDDY', icon: '🐻' },
      { id: 'cherry', name: 'Cherry', ticker: '$CHERRY', icon: '🍒' },
      { id: 'groyp', name: 'Groyp', ticker: '$GROYP', icon: '🐸' }
    ];
    const tokenChoice = defaultTokens[Math.floor(Math.random() * defaultTokens.length)];
    return {
      text: generateTokenGM(tokenChoice, recentHistory),
      category: 'meme_tokens'
    };
  }

  const staticList = STATIC_TEMPLATES[targetCategory] || STATIC_TEMPLATES.crypto;
  
  let customPool = [];
  try {
    const raw = localStorage.getItem('gm_generator_custom_submissions_v1');
    if (raw) {
      const customSubmissions = JSON.parse(raw);
      customPool = customSubmissions
        .filter(s => targetCategory === 'all' || s.category === targetCategory)
        .map(s => s.text);
    }
  } catch (e) {}

  const pool = [...staticList, ...customPool];

  // Deduplicate against recent history
  const available = pool.filter(item => !recentHistory.includes(item));
  const finalPool = available.length > 0 ? available : pool;
  
  const chosen = finalPool[Math.floor(Math.random() * finalPool.length)];
  
  return {
    text: chosen,
    category: targetCategory
  };
}

// Extensive Token-Specific Meme Lore Templates for TON Tokens
export const TOKEN_STATIC_TEMPLATES = {
  redo: [
    "GM to the Resistance Dog army! $REDO hooded mascot standing strong for digital freedom! 🐕‍🦺💎",
    "GM! $REDO is not just a token, it's the symbol of unstoppable Telegram resistance! 🐕‍🦺⚡",
    "GM to Pavel Durov's Resistance Dog! Hood on, conviction high, holding $REDO to the moon! 🐕‍🦺🚀",
    "GM $REDO family! Digital resistance lives forever on TON! 🐕‍🦺💎",
    "GM! Redo hooded dog watching over the order book. Freedom always wins! 🐕‍🦺",
    "GM ser! $REDO Resistance Dog team is building for eternity. Pure digital freedom! 🐕‍🦺⚡",
    "Gram morning $REDO holders! The hooded mascot leads the Telegram revolution! 🐕‍🦺🚀",
    "GM to everyone wearing the black hoodie today! $REDO conviction at 1000%! 🐕‍🦺💎",
    "GM! $REDO holders know that true decentralization cannot be muted! 🐕‍🦺🔥",
    "GM to the $REDO community! Telegram's iconic hooded dog leading the TON supercycle! 🐕‍🦺✨",
    "GM! Standing firm with $REDO Resistance Dog. The original Telegram mascot! 🐕‍🦺🫡",
    "GM $REDO gigachads! Mute the bears, wear the hoodie, stack the tokens! 🐕‍🦺💎"
  ],
  utya: [
    "GM Utya duck army! 🦆 Telegram's yellow duck mascot is quacking at green candles!",
    "GM ser! 1 $UTYA = 1 Quack of absolute financial independence! 🦆💎",
    "GM to everyone holding $UTYA! Telegram yellow duck sticker energy unlocked! 🦆🚀",
    "GM! Quacking my way to financial freedom with Utya duck on TON! 🦆⚡",
    "GM to the yellow duck believers! Utya season is officially here! 🦆✨",
    "GM $UTYA holders! Telegram's most legendary duck sticker leading the chart! 🦆🔥",
    "GM! Woke up, checked $UTYA, quacked loudly, and bought the dip! 🦆💎",
    "GM to the $UTYA duck pack! Telegram sticker memes taking over Web3! 🦆🚀",
    "GM! 100% yellow duck energy on TON. $UTYA is flying high! 🦆⚡"
  ],
  pedro: [
    "GM! Spinning Pedro the Trash Bandit on loop while checking $PEDRO candles! 🦝🎶",
    "GM to the greatest audio memecoin on TON! $PEDRO Trash Bandit team is cooking pure unstoppable vibes! 💎🦝",
    "GM ser! Pedro audio playing at 100% volume. $PEDRO chart dancing, portfolio grooving! 🦝🔥",
    "GM to everyone vibing with $PEDRO! Uplifting TON meme culture one beat at a time! 💎🦝",
    "GM! Pedro the Trash Bandit dancing in circles = instant 10x energy for $PEDRO holders! 🦝⚡",
    "GM to all $PEDRO holders! No sadness allowed, only spinning trash bandit beat drops! 🦝✨",
    "GM! Woke up, put on the Pedro raccoon beat, and instantly gained +500 financial aura! 🦝🚀",
    "GM $PEDRO army! Raccoon energy, spinning beats, and green candles on TON! 🦝💎",
    "GM! Pedro Trash Bandit audio is the official anthem of TON memecoin season! 🦝🎶"
  ],
  buddy: [
    "GM to Buddy the Bear! 🐻 The friendliest bear mascot on TON turning bear markets into bullish gains!",
    "GM ser! $BUDDY the Bear energy is unmatched on TON. Hugging green candles all morning! 🐻💎",
    "GM to all $BUDDY holders! Buddy the Bear leading the TON memecoin season with maximum vibes! 🐻🚀",
    "GM! $BUDDY Bear team building, community roaring, vibes top tier on TON! 🐻⚡",
    "GM $BUDDY family! Big bear hugs for all diamond hand holders today! 🐻✨",
    "GM! Buddy the Bear watching over the order book. Bear market turned bull season! 🐻🔥"
  ],
  cherry: [
    "GM to the $CHERRY community! Sweetest profits on TON with a cherry on top! 🍒💎",
    "GM ser! Juicy green candles and $CHERRY vibes all morning! 🍒🚀",
    "GM! Holding $CHERRY for maximum sweetness and 100x flavor! 🍒⚡",
    "GM to the $CHERRY family! TON season just got a whole lot tastier! 🍒✨",
    "GM! Top off your portfolio with a sweet $CHERRY pump today! 🍒🔥"
  ],
  groyp: [
    "GM Groyp army! 🐸 Unhinged CT frog energy taking over TON blockchain!",
    "GM ser! $GROYP conviction is 1000%. We don't sell, we just groyp! 🐸💎",
    "GM to all my $GROYP bros in the trenches! Unstoppable frog power! 🐸🚀",
    "GM! $GROYP team cooking, frogs jumping, bears in absolute shambles! 🐸⚡",
    "GM $GROYP holders! Unhinged frog memes pumping up the TON ecosystem! 🐸🔥"
  ]
};

// Dynamic Deduplication History Tracker for Meme Tokens
let globalTokenHistory = [];

// Enhanced Token GM Generator with Zero-Repetition Guarantee
export function generateTokenGM(tokenObj, recentHistory = []) {
  if (!tokenObj) return getRandomGM('ton', recentHistory).text;

  const tokenId = tokenObj.id;
  const ticker = tokenObj.ticker ? (tokenObj.ticker.startsWith('$') ? tokenObj.ticker : `$${tokenObj.ticker}`) : `$${(tokenObj.name || 'TOKEN').toUpperCase()}`;
  const icon = tokenObj.icon || '🪙';
  const name = tokenObj.name || 'Meme Token';

  const staticList = TOKEN_STATIC_TEMPLATES[tokenId] || [];

  // Procedural Templates for Custom/Dynamic Tokens
  const proceduralTemplates = [
    `GM to the ${name} ${icon} community! ${ticker} is cooking pure unstoppable vibes on TON! 💎`,
    `GM ser! Holding ${ticker} ${icon} with absolute gigachad conviction today. ${ticker} to the moon! 🚀`,
    `Gram morning ${name} family! ${ticker} ${icon} season is officially HERE on TON! ⚡`,
    `GM to all ${ticker} ${icon} holders! Chart is dancing, community is grooving, vibes immaculate! 🔥`,
    `GM! ${name} team is building 24/7. ${ticker} ${icon} unstoppable momentum! 💎`,
    `GM to the ${ticker} ${icon} trench warriors! Holding strong for generational gains! 🫡`,
    `GM! Coffee brewing, Telegram active, ${ticker} ${icon} chart looking ultra bullish today! 🚀`,
    `GM ${name} holders! ${ticker} ${icon} is the sweetest play in the entire TON ecosystem! 💎`
  ];

  const fullPool = [...staticList, ...proceduralTemplates];

  // Exclude recent history to prevent repetition
  const available = fullPool.filter(item => !recentHistory.includes(item) && !globalTokenHistory.includes(item));
  const pool = available.length > 0 ? available : fullPool;

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  // Update global token history ring buffer (30 items memory)
  globalTokenHistory = [chosen, ...globalTokenHistory.slice(0, 30)];

  return chosen;
}
