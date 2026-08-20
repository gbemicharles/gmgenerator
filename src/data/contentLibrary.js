/**
 * GM Generator - Comprehensive Content Library & Procedural Engine
 * Feature-rich Web3 quote generator with deduplication, TON meme lore, 
 * Pedro character integrations, and 22 full categories.
 */

export const CATEGORIES = [
  { id: 'all', name: 'ALL CATEGORIES', icon: '✨', color: '#F3BA2F' },
  { id: 'motivational', name: 'MOTIVATIONAL GM', icon: '🔥', color: '#F59E0B' },
  { id: 'unhinged', name: 'UNHINGED GM', icon: '🤪', color: '#EC4899' },
  { id: 'ton', name: 'TON ECOSYSTEM', icon: '💎', color: '#0088CC' },
  { id: 'pedro', name: 'PEDRO TRASH BANDIT', icon: '🦝', color: '#A855F7' },
  { id: 'meme_tokens', name: 'MEME TOKENS', icon: '🪙', color: '#10B981' },
  { id: 'crypto', name: 'CRYPTO DEGEN', icon: '🚀', color: '#3B82F6' },
  { id: 'villain', name: 'VILLAIN GM', icon: '😈', color: '#EF4444' },
  { id: 'downbad', name: 'DOWN BAD GM', icon: '📉', color: '#64748B' },
  { id: 'npc', name: 'NPC GM', icon: '🤖', color: '#8B5CF6' },
  { id: 'bull_market', name: 'BULL MARKET GM', icon: '📈', color: '#22C55E' },
  { id: 'bear_market', name: 'BEAR MARKET GM', icon: '🐻', color: '#D97706' },
  { id: 'nft_degens', name: 'NFT DEGEN GM', icon: '🖼️', color: '#8B5CF6' },
  { id: 'airdrop_hunter', name: 'AIRDROP HUNTER', icon: '🪂', color: '#06B6D4' },
  { id: 'trader_pro', name: 'PRO TRADER GM', icon: '📊', color: '#10B981' },
  { id: 'solana_vibes', name: 'SOLANA VIBES', icon: '☀️', color: '#9333EA' },
  { id: 'eth_maxi', name: 'ETH MAXI GM', icon: '🔷', color: '#6366F1' },
  { id: 'btc_hodler', name: 'BITCOIN HODLER', icon: '₿', color: '#F7931A' },
  { id: 'defi_degen', name: 'DEFI YIELD FARMER', icon: '🌾', color: '#84CC16' },
  { id: 'alpha_caller', name: 'ALPHA CALLER', icon: '📢', color: '#EAB308' },
  { id: 'dev_builder', name: 'DEV & BUILDER', icon: '💻', color: '#0284C7' },
  { id: 'coffee_vibes', name: 'MORNING COFFEE', icon: '☕', color: '#B45309' }
];

export const COMBINATOR = {
  prefixes: [
    "GM to all",
    "Rise and shine",
    "Good morning",
    "Shoutout to",
    "Salute to",
    "Big GM to",
    "Wake up"
  ],
  subjects: [
    "Telegram degens",
    "TON ecosystem builders",
    "diamond hands",
    "meme token hodlers",
    "audio memecoin squad",
    "crypto traders",
    "yield farmers",
    "future millionaires"
  ],
  actions: [
    "building through the noise",
    "holding through the dips",
    "stacking sats daily",
    "spinning Pedro tracks on loop",
    "buying every single dip",
    "scaling Web3 to 900M users",
    "chasing green candles"
  ],
  outros: [
    "We are all gonna make it! 🚀",
    "Vibes are 1000%! 💎",
    "LFG to the moon! 🔥",
    "Stay relentless! ⚡",
    "WAGMI frens! 🫡",
    "Let's win together! 👑"
  ]
};

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
    "GM! Pedro DJ spinning the highest volume tracks while Telegram degens buy the dip! 🎧🦝",
    "GM from Pedro Astronaut! Next stop: the moon, Mars, and the top of Telegram trending! 🚀🦝",
    "GM! Pedro King crowned with diamond hands! Long live the audio memecoin empire! 👑🦝",
    "GM Pedro squad! Spinning round and round like Pedro in the meme video! WAGMI! 🔄🦝",
    "GM! If Pedro is spinning, my conviction is winning! LFG Pedro team! 🦝🔥"
  ],
  meme_tokens: [
    "GM to Resistance Dog $REDO! Standing strong against censorship on Telegram & TON! 🐶🛡️",
    "GM to $PEDRO holders! Audio meme energy powering the Telegram revolution! 🦝🎶",
    "GM to $UTYA duck squad! Quacking our way straight to the top of TON DEXs! 🦆💎",
    "GM to $BUDDY & $CHERRY holders! Pure meme culture leading the next Web3 wave! 🍒🐾",
    "GM to $GROYP community! Memes speak louder than words in crypto markets! 🎭⚡",
    "GM! Stacking TON meme tokens before the global mass adoption tsunami! 💎🪙"
  ],
  crypto: [
    "GM degens! Checked portfolio before opening eyes. Up 20% or down 40%, we ride!",
    "GM to everyone who survived another 100x volatility swing while sleeping.",
    "GM! Charts are green, coffee is hot, candles are breaking resistance levels!",
    "GM to those who read whitepapers for fun and trade with 50x leverage for sport.",
    "GM! Another day, another opportunity to find the next 1000x gem on Telegram.",
    "GM degen fam! No sleep, no fear, only market orders and pure conviction!"
  ],
  villain: [
    "GM. I am once again asking for your stop loss so I can sweep it before mooning.",
    "GM. Your panic sell at the bottom was my limit buy order. Thank you for your service.",
    "GM to everyone except the bears shorting my favorite TON ecosystem token.",
    "GM. Liquidation cascade triggered. My bids were waiting patiently at the bottom.",
    "GM. I don't follow trends. Trends follow my market buy orders."
  ],
  downbad: [
    "GM. Down 90% from ATH but my conviction is up 1000%. We hold till glory.",
    "GM. Breakfast: instant noodles. Lunch: cope. Dinner: diamond hands.",
    "GM to everyone whose portfolio is currently bleeding but spirits remain invincible.",
    "GM. Gas fees cost more than my remaining wallet balance, but I am still here.",
    "GM. Woke up to 14 liquidation notifications. Refreshed chart and said GM anyway."
  ],
  npc: [
    "GM! Have a nice day! Remember to drink water and check market prices!",
    "GM world! Loading daily routine: coffee, Twitter scroll, Telegram check, repeat.",
    "GM! It is another glorious morning in Web3! Press start to begin your day!",
    "GM fellow humans! May your trades be profitable and your gas fees low!"
  ],
  bull_market: [
    "GM! Up Only season is here! Every candle is green and every dip is bought in 3 seconds! 📈🚀",
    "GM to the bull run believers! ATH breaking every hour, portfolio looking legendary! 📈💰",
    "GM! Wake up, check charts, smile! We are in full bull mode! 📈🔥",
    "GM! Bears in hibernation, bulls running the show! Pack your bags for the moon! 📈🌕"
  ],
  bear_market: [
    "GM. Bear markets build empires. Keep accumulating quietly while others panic. 🐻🛡️",
    "GM to the true survivors. Bear markets separate tourists from generational builders. 🐻💎",
    "GM. Price is noise. Value is real. Stacking sats in the cold winter. 🐻⚡",
    "GM! The best entries are made when nobody is watching. Keep holding! 🐻🚀"
  ],
  nft_degens: [
    "GM NFT collectors! Right click save is coping, holding the PFP is living! 🖼️💎",
    "GM! Sweeping floors before breakfast, updating Discord status, vibes 10/10! 🖼️🔥",
    "GM to the JPEG connoisseurs! Minting at 3 AM with 0 sleep! 🖼️🚀"
  ],
  airdrop_hunter: [
    "GM Airdrop Farmers! 50 wallets interacted, testnets bridged, claim buttons ready! 🪂💰",
    "GM! Staking, bridging, swapping, voting—doing 100 transactions before sunrise! 🪂⚡",
    "GM to the relentless drop hunters! Retest, snapshot, claim, repeat! 🪂🔥"
  ],
  trader_pro: [
    "GM traders! Order book analyzed, Fibonacci levels set, risk managed like a boss! 📊💎",
    "GM. Emotionless execution, strict stop losses, clean profit targets. Let's trade. 📊⚡",
    "GM to the TA masterminds drawing trendlines on 4-hour charts with surgical precision! 📊🚀"
  ],
  solana_vibes: [
    "GM Solana squad! 65k TPS, instant finality, sub-cent fees all day long! ☀️⚡",
    "GM SOL degens! Swapping tokens faster than the speed of light! ☀️🔥",
    "GM to the Solana ecosystem builders! Fast, fluid, unstoppable! ☀️🚀"
  ],
  eth_maxi: [
    "GM ETH Maxis! Ultra sound money, staking yields compounding, L2s scaling to infinity! 🔷⚡",
    "GM! Ethereum layer 2 fees dropping to fractions of a cent! The world computer is live! 🔷💎",
    "GM to the Ethereum stakers securing decentralized global financial architecture! 🔷🚀"
  ],
  btc_hodler: [
    "GM Bitcoiners! 21 million hard cap, tick-tock next block, unconfiscatable freedom money! ₿🛡️",
    "GM! Halving aftermath, institutional ETF inflows, Satoshi's vision winning! ₿⚡",
    "GM to the HODLers! Not selling a single satoshi for fiat paper money! ₿💎"
  ],
  defi_degen: [
    "GM Yield Farmers! APR high, liquidity pools balanced, harvesting rewards at dawn! 🌾💰",
    "GM to the DeFi degens providing liquidity across 10 cross-chain vaults! 🌾⚡",
    "GM! Smart contracts audited, collateral ratio safe, yield compounding nonstop! 🌾🚀"
  ],
  alpha_caller: [
    "GM Alpha Squad! Call dropped in Telegram group before 10x breakout! 📢🔥",
    "GM! Research done, early entry taken, sharing alpha with the inner circle! 📢💎",
    "GM to the alpha callers who never miss a trending token runner! 📢⚡"
  ],
  dev_builder: [
    "GM Builders! Code compiling, smart contracts deployed, zero bugs on mainnet! 💻⚡",
    "GM to the devs working 20-hour shifts building the decentralized future! 💻🛡️",
    "GM! GitHub commits pushed, unit tests passing 100%, shipping products daily! 💻🚀"
  ],
  coffee_vibes: [
    "GM! Fresh espresso brewing, charts open, mind sharp as a razor! ☕⚡",
    "GM to coffee lovers who convert caffeine straight into green candles! ☕🔥",
    "GM! First sip of coffee hit the spot. Ready to conquer the crypto markets! ☕🚀"
  ]
};

export function getRandomGM(category = 'all', excludeQuote = null) {
  let availableCategories = Object.keys(STATIC_TEMPLATES);
  if (category !== 'all' && STATIC_TEMPLATES[category]) {
    availableCategories = [category];
  }

  const randomCategoryKey = availableCategories[Math.floor(Math.random() * availableCategories.length)];
  const quotesList = STATIC_TEMPLATES[randomCategoryKey];

  let quote = quotesList[Math.floor(Math.random() * quotesList.length)];
  if (excludeQuote && quotesList.length > 1) {
    let attempts = 0;
    while (quote === excludeQuote && attempts < 10) {
      quote = quotesList[Math.floor(Math.random() * quotesList.length)];
      attempts++;
    }
  }

  const categoryObj = CATEGORIES.find(c => c.id === randomCategoryKey) || CATEGORIES[0];
  return {
    quote,
    category: categoryObj.name,
    categoryId: categoryObj.id,
    color: categoryObj.color,
    icon: categoryObj.icon
  };
}

export function generateTokenGM(token) {
  const tokenQuotes = {
    REDO: [
      "GM Resistance Dog $REDO army! Standing firm for privacy & decentralization on Telegram & TON! 🐶🛡️",
      "GM $REDO holders! The mascot of digital resistance leading the TON meme surge! 🐶⚡"
    ],
    PEDRO: [
      "GM $PEDRO squad! The ultimate audio memecoin on TON spinning nonstop vibes! 🦝🎶",
      "GM $PEDRO holders! Pedro Team audio memecoin culture cooking maximum energy! 🦝🔥"
    ],
    UTYA: [
      "GM $UTYA duck army! Quacking our way straight to the top of Telegram DEXs! 🦆💎",
      "GM $UTYA holders! TON duck memes flying high with unstoppable community power! 🦆⚡"
    ],
    BUDDY: [
      "GM $BUDDY holders! Best friends in crypto building the ultimate TON meme vibe! 🐾✨",
      "GM $BUDDY squad! Loyalty, memes, and green candles all day long! 🐾🚀"
    ],
    CHERRY: [
      "GM $CHERRY holders! Sweetest meme token on TON picking green candles daily! 🍒🔥",
      "GM $CHERRY community! Fresh vibes, high volume, maximum momentum! 🍒💎"
    ],
    GROYP: [
      "GM $GROYP army! Memes speak louder than words in crypto markets! 🎭⚡",
      "GM $GROYP holders! Unhinged meme power taking over Telegram! 🎭🚀"
    ]
  };

  const symbol = token.symbol.toUpperCase();
  const list = tokenQuotes[symbol] || [
    `GM $${symbol} holders! Stacking ${token.name} tokens before the next massive wave! 🪙🚀`
  ];

  const quote = list[Math.floor(Math.random() * list.length)];
  return {
    quote,
    category: `${token.symbol} COMMUNITY`,
    categoryId: 'meme_tokens',
    color: '#10B981',
    icon: '🪙'
  };
}
