// Escalation Engine for "MAKE IT WORSE 💀"
// Mascot-aware escalation that seamlessly fits the base generated GM statement

export const ESCALATION_LEVELS = [
  { level: 1, label: 'Normal', color: '#10B981', emoji: '☀️' },
  { level: 2, label: 'Crypto', color: '#F59E0B', emoji: '📈' },
  { level: 3, label: 'Degen', color: '#8B5CF6', emoji: '⚡' },
  { level: 4, label: 'Unhinged', color: '#F43F5E', emoji: '🤪' },
  { level: 5, label: 'Final Boss', color: '#DC2626', emoji: '🗿' }
];

function detectMascotType(tokenObj, categoryId, currentText = '') {
  const textLower = currentText.toLowerCase();

  if (tokenObj) {
    const tid = (tokenObj.id || '').toLowerCase();
    const tname = (tokenObj.name || '').toLowerCase();
    const icon = tokenObj.icon || '';

    if (tid === 'redo' || tname.includes('resistance') || tname.includes('redo') || icon === '🐕‍🦺') {
      return 'redo';
    }
    if (tid === 'pedro' || tname.includes('pedro') || icon === '🦝') {
      return 'pedro';
    }
    if (tid === 'utya' || tname.includes('utya') || icon === '🦆') {
      return 'utya';
    }
    if (tid === 'buddy' || tname.includes('buddy') || icon === '🐻') {
      return 'buddy';
    }
    if (tid === 'cherry' || tname.includes('cherry') || icon === '🍒') {
      return 'cherry';
    }
    if (tid === 'groyp' || tname.includes('groyp') || icon === '🐸') {
      return 'groyp';
    }
    return 'custom_token';
  }

  if (categoryId === 'pedro' || textLower.includes('pedro') || textLower.includes('🦝')) {
    return 'pedro';
  }
  if (categoryId === 'degen' || textLower.includes('groyp') || textLower.includes('🐸')) {
    return 'groyp';
  }
  if (textLower.includes('redo') || textLower.includes('resistance dog') || textLower.includes('🐕‍🦺')) {
    return 'redo';
  }
  if (textLower.includes('utya') || textLower.includes('🦆')) {
    return 'utya';
  }

  return 'generic';
}

function getModifiersForMascot(mascotType, level, tokenObj) {
  const ticker = tokenObj?.ticker || '$TOKEN';
  const name = tokenObj?.name || 'Token';
  const icon = tokenObj?.icon || '🪙';

  const POOLS = {
    redo: {
      2: [
        "Hood on, conviction high. $REDO watching over the order book.",
        "Digital resistance lives forever on TON! Checking $REDO candles every 30 seconds."
      ],
      3: [
        "Swapped rent money into $REDO hooded dog tokens. Resistance Dog army standing strong, bears in absolute shambles!",
        "Pavel Durov didn't build TON for you to sell your $REDO! Conviction at 1000%."
      ],
      4: [
        "WARNING: DO NOT SHORT $REDO OR PAVEL DUROV WILL BAN YOUR SPOTIFY PLAYLIST!",
        "Drinking coffee at 3 AM screaming 'FREEDOM' while $REDO green candles pump!"
      ],
      5: [
        "$REDO RESISTANCE OVERLOAD! MAXIMUM DIGITAL FREEDOM UNLOCKED. WE CONQUER TON!",
        "HOOD ON, DIAMOND HANDS ENGAGED, $REDO ARMY UNSTOPPABLE!"
      ]
    },
    pedro: {
      2: [
        "Spinning Pedro the Trash Bandit on 100% volume while $PEDRO pumps.",
        "$PEDRO team cooking pure unstoppable audio vibes."
      ],
      3: [
        "Swapped rent money into $PEDRO trash bandit audio. Portfolio dancing on loop!",
        "$PEDRO audio playing at 100% volume, zero regrets, maximum energy."
      ],
      4: [
        "WARNING: IF YOU DON'T DANCE TO $PEDRO YOU HAVE NO VIBES!",
        "Holding $PEDRO for 48 hours straight and my conviction is infinite!"
      ],
      5: [
        "$PEDRO SPINNING OVERLOAD! AUDIO MEMECOIN SEASON HAS REACHED MAXIMUM HYPERDRIVE!",
        "SPINNING TRASH BANDIT BEAT DROPS UNLOCKED! $PEDRO TO THE MOON!"
      ]
    },
    utya: {
      2: [
        "Quacking at green candles all morning. 1 $UTYA = 1 Quack of freedom.",
        "Yellow duck sticker energy unlocked for $UTYA!"
      ],
      3: [
        "Swapped rent money into $UTYA yellow duck tokens on TON.",
        "$UTYA army quacking all the way to financial independence!"
      ],
      4: [
        "WARNING: THE $UTYA YELLOW DUCK ARMY IS TAKING OVER TELEGRAM!",
        "Quacking so hard the bears ran away!"
      ],
      5: [
        "$UTYA DUCK OVERLOAD! MAXIMUM DUCK POWER REACHED ON TON!",
        "YELLOW DUCK REVOLUTION COMPLETE!"
      ]
    },
    buddy: {
      2: [
        "Buddy the Bear hugging green candles for $BUDDY all morning.",
        "$BUDDY bear energy roaring loud on TON."
      ],
      3: [
        "Swapped rent money into $BUDDY bear tokens on TON.",
        "$BUDDY bear team building, community roaring!"
      ],
      4: [
        "WARNING: $BUDDY THE BEAR IS TURNING BEAR MARKETS INTO BULL RUNS!",
        "Bear market cancelled, $BUDDY bullish run engaged!"
      ],
      5: [
        "$BUDDY BEAR OVERLOAD! MAXIMUM BULLISH BEAR POWER ENGAGED!",
        "$BUDDY TO THE MOON AND BEYOND!"
      ]
    },
    cherry: {
      2: [
        "Sweet juicy green candles and $CHERRY vibes all morning.",
        "Holding $CHERRY for maximum sweetness and 100x flavor."
      ],
      3: [
        "Swapped rent money into $CHERRY for maximum 100x flavor.",
        "Juicy profits cooking with the $CHERRY community!"
      ],
      4: [
        "WARNING: $CHERRY SEASON IS COOKING ON TON!",
        "Sweetest green candles taking $CHERRY to the top!"
      ],
      5: [
        "$CHERRY OVERLOAD! MAXIMUM SWEET PROFIT UNLOCKED!",
        "SWEET 1000% GAINS SECURED!"
      ]
    },
    groyp: {
      2: [
        "If you're bearish today, kindly unfollow. $GROYP conviction at 1000%.",
        "Portfolio down, frog conviction up for $GROYP."
      ],
      3: [
        "Swapped rent money into $GROYP frog coins. Unhinged frog power activated!",
        "$GROYP team cooking, frogs jumping, bears in absolute shambles!"
      ],
      4: [
        "WARNING: DO NOT SHORT $GROYP OR THE FROGS WILL DELETE YOUR PLAYLIST!",
        "Unhinged $GROYP energy taking over TON!"
      ],
      5: [
        "$GROYP OVERLOAD! MAXIMUM UNHINGED FROG ENERGY REACHED!",
        "FROG ARMY VICTORIOUS ON TON!"
      ]
    },
    custom_token: {
      2: [
        `Holding ${ticker} ${icon} with 100x conviction today.`,
        `Portfolio down, ${ticker} ${icon} conviction higher than ever.`
      ],
      3: [
        `Swapped rent money into ${ticker} ${icon} tokens. No regrets!`,
        `${name} team building 24/7, bears in absolute shambles!`
      ],
      4: [
        `WARNING: DO NOT SHORT ${ticker} ${icon} OR YOU WILL REGRET IT!`,
        `Maximum ${ticker} ${icon} conviction engaged!`
      ],
      5: [
        `${ticker} OVERLOAD! MAXIMUM UNHINGED ${name.toUpperCase()} ENERGY REACHED!`,
        `${ticker} TO THE MOON!`
      ]
    },
    generic: {
      2: [
        "Checking charts every 45 seconds. Conviction at an all-time high.",
        "Portfolio down, conviction up. NFA, DYOR, but mostly just LFG."
      ],
      3: [
        "Swapped rent money into high-conviction memecoins. Leverage set to 100x!",
        "If this doesn't pump by 2 PM I am applying to work at McDonald's."
      ],
      4: [
        "WARNING: DO NOT SHORT THE MARKET OR THE LAWS OF PHYSICS WILL BEND!",
        "Drinking coffee at 3 AM while screaming at green candles on my monitors!"
      ],
      5: [
        "SYSTEM OVERLOAD! MAXIMUM UNHINGED LEVEL REACHED. WE ARE GOING TO MARS!",
        "CEILINGS NO LONGER EXIST! SACRIFICE YOUR SLEEP TO THE GREEN CANDLE GODS!"
      ]
    }
  };

  const pool = POOLS[mascotType]?.[level] || POOLS.generic[level] || POOLS.generic[3];
  return pool;
}

export function escalateGM(currentText, currentLevel, tokenObj = null, categoryId = 'crypto') {
  const mascotType = detectMascotType(tokenObj, categoryId, currentText);
  const nextLevel = Math.min(currentLevel + 1, 5);

  const modifiers = getModifiersForMascot(mascotType, nextLevel, tokenObj);
  const rawSuffix = modifiers[Math.floor(Math.random() * modifiers.length)];

  // Clean rawSuffix so it flows seamlessly with the existing statement
  let cleanSuffix = rawSuffix.trim()
    .replace(/^(GM\.|GM ser\.|GM|Gram morning|Gram morning ser\.)\s*/i, '');

  let baseText = currentText.trim();

  // Ensure baseText ends with punctuation
  if (!/[.!?]$/.test(baseText)) {
    baseText += '.';
  }

  // Capitalize first letter of cleanSuffix
  cleanSuffix = cleanSuffix.charAt(0).toUpperCase() + cleanSuffix.slice(1);

  // Prevent duplicate suffix appending
  if (baseText.includes(cleanSuffix)) {
    return {
      text: baseText,
      level: nextLevel
    };
  }

  const escalatedText = `${baseText} ${cleanSuffix}`;

  return {
    text: escalatedText,
    level: nextLevel
  };
}
