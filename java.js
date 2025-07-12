/* Ayla’s Light – main logic */
window.onload = () => {
  /* ——————————————————————————— existing fade-in & toggles ————————————————— */
  document.body.classList.remove('not-loaded');

  /* day / night toggle */
  const modeBtn = document.getElementById('modeToggle');
  modeBtn.textContent = '🌙';
  modeBtn.addEventListener('click', () => {
    const isDay = document.body.classList.toggle('day-mode');
    modeBtn.textContent = isDay ? '🌞' : '🌙';
  });

  /* comfort note (original) */
  const msgBtn   = document.getElementById('messageToggle');
  const note     = document.getElementById('note');
  const closeBtn = document.getElementById('noteClose');
  const noteTxt  = note.querySelector('.note__text');
  const rawText  = noteTxt.textContent.trim();

  const typeMessage = (el, text) => {
    el.innerHTML = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.animationDelay = `${i * 40}ms`;
      el.appendChild(span);
    });
  };

  const showNote = () => {
    note.classList.add('note--visible');
    setTimeout(() => typeMessage(noteTxt, rawText), 600);
  };
  const hideNote = () => {
    note.classList.remove('note--visible');
  };

  msgBtn.addEventListener('click', () => 
    note.classList.contains('note--visible') ? hideNote() : showNote()
  );
  closeBtn.addEventListener('click', hideNote);

  /* ——————————————————————— Fireflies in a Love-Jar —————————————————————— */
  const loveJar        = document.getElementById('loveJar');
  const jarFireflies   = document.getElementById('jarFireflies');
  const jarProgressEl  = document.getElementById('jarProgress');
  const phraseNote     = document.getElementById('phraseNote');
  const phraseNoteTxt  = phraseNote.querySelector('.note__text');
  const phraseNoteCls  = document.getElementById('phraseNoteClose');
  const captureSound   = document.getElementById('captureSound');

  /* Placeholder – supply real phrases later */
  const phrases = [
  "You're my everything.",
  "I'm yours completely.",
  "You complete me.",
  "You melt me.",
  "You're my constant.",
  "My heart is yours.",
  "I'm all yours.",
  "You're it for me.",
  "Forever yours.",
  "You stole my heart.",
  "You're my home.",
  "You're my forever.",
  "I'm yours, forever.",
  "You're my everything.",
  "You're my better half.",
  "You're my one and only.",
  "You're my forever favorite.",
  "I'm wholeheartedly yours.",
  "I'm yours and only yours.",
  "I'm irrevocably yours.",
  "My soul recognizes yours.",
  "You're the love of my life.",
  "You're my soul mate.",
  "My soul loves yours.",
  "I'm deeply in love with you.",
  "You're my heart's desire.",
  "You're my heart and soul.",
  "You own my heart completely.",
  "My love for you knows no bounds.",
  "You're my endless love.",
  "You're my life's greatest treasure.",
  "You're my greatest adventure.",
  "You're my life's greatest blessing.",
  "You're my sweetest obsession.",
  "You're my life's true love story.",
  "You're my ultimate happiness.",
  "You're my definition of love.",
  "You're my life's most beautiful story.",
  "You're my guiding star.",
  "You are my true north.",
  "I love you 3000.",
  "You're my lobster.",
  "You're my happy thought.",
  "You're my favorite human.",
  "You're my favorite person.",
  "You're my paradise.",
  "You're my sunshine.",
  "You're special to me.",
  "You've captured my heart.",
  "I choose you, every day.",
  "I love you without knowing how, or when, or from where.",
  "Whatever our souls are made of, yours and mine are the same.",
  "You have bewitched me, body and soul.",
  "I wish I knew how to quit you.",
  "You and I, it's as though we've been taught to kiss in heaven.",
  "You are the finest, loveliest, tenderest, and most beautiful person I have ever known.",
  "I am who I am because of you.",
  "To love or have loved, that is enough.",
  "You are my sun, my moon, and all my stars.",
  "As you wish.",
  "I'm addicted to you.",
  "I'm captivated by you.",
  "You've swept me off my feet.",
  "I'm crazy about you.",
  "I'm hopelessly devoted to you.",
  "I'm truly, madly, deeply yours.",
  "You're my heart's favorite song.",
  "I'm profoundly in love with you.",
  "You fill my heart with joy.",
  "You make my heart soar.",
  "You're the peace in my chaos.",
  "With you, I'm home.",
  "You make my world beautiful.",
  "You're my comfort zone.",
  "You're my inspiration.",
  "You're the air I breathe.",
  "You're my weakness and my strength.",
  "You're my favorite reason to wake up.",
  "My heart smiles because of you.",
  "You're always on my mind.",
  "I cherish every moment with you.",
  "I cherish you endlessly.",
  "You're my reason for happiness.",
  "You're my reason to smile.",
  "My heart belongs to you.",
  "I treasure you.",
  "You're the best part of my day.",
  "My life is brighter because of you.",
  "Loving you is my favorite thing to do.",
  "You're the best decision I've ever made.",
  "You're my happily ever after.",
  "I'd choose you every day.",
  "You're my perfect match.",
  "You hold the key to my heart.",
  "You mean everything and more to me.",
  "You're my absolute everything.",
  "You're my heartbeat.",
  "You're my greatest gift.",
  "I can't imagine life without you.",
  "I'm yours until the end of time."
];

  /* adaptive live-firefly count */
  const LIVE_COUNT = window.matchMedia('(max-width:480px)').matches ? 6 :
                     window.matchMedia('(max-width:768px)').matches ? 8 : 12;

  /* state */
  let captured = 0;
  let currentFirefly = null;
  let activePool = [];

  /* random helpers */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const vw   = x => `${x}vw`, vh = y => `${y}vh`;

  /* spawn initial live fireflies */
  phrases.slice(0, LIVE_COUNT).forEach((phrase, idx) => createFirefly(idx, phrase));

  function createFirefly(id, phrase) {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.dataset.id = id;
    f.dataset.phrase = phrase;

    // Meadow firefly zone (horizontal: 10vw–85vw, vertical: 60vh–85vh)
    const xBand = [10, 85];
    const yBand = [60, 85];

    f.style.setProperty('--x0', vw(rand(...xBand)));
    f.style.setProperty('--y0', vh(rand(...yBand)));
    f.style.setProperty('--x1', vw(rand(...xBand)));
    f.style.setProperty('--y1', vh(rand(...yBand)));
    f.style.setProperty('--x2', vw(rand(...xBand)));
    f.style.setProperty('--y2', vh(rand(...yBand)));
    f.style.setProperty('--x3', vw(rand(...xBand)));
    f.style.setProperty('--y3', vh(rand(...yBand)));

    f.addEventListener('click', () => catchFirefly(f));
    document.body.appendChild(f);
    activePool.push(f);
  }

  /* catch > show note > store */
  function catchFirefly(f) {
    if (currentFirefly) return; // one at a time
    currentFirefly = f;
    f.classList.add('firefly--captured');

    /* play ping */
    captureSound.currentTime = 0;
    captureSound.play();

    /* show small note */
    phraseNote.classList.add('note--visible');
    typeMessage(phraseNoteTxt, f.dataset.phrase);
  }

  phraseNoteCls.addEventListener('click', () => {
    phraseNote.classList.remove('note--visible');
    if (!currentFirefly) return;

    /* slide to jar */
    const rectJar = loveJar.getBoundingClientRect();
    currentFirefly.style.transition = 'transform .8s ease, opacity .8s ease';
    currentFirefly.style.transform = `translate(${rectJar.left + rectJar.width / 2 - 3}px, ${rectJar.top + rectJar.height / 2 - 3}px) scale(0.4)`;
    currentFirefly.style.opacity = '0.8';

    /* after transition … */
    setTimeout(() => storeFirefly(currentFirefly), 800);
    currentFirefly = null;
  });

  function storeFirefly(f) {
    f.remove();                     // remove from body
    f.style.transition = '';        // reset
    f.style.transform  = '';        // reset
    f.style.opacity    = '';
    f.className = 'firefly firefly--captured';
    jarFireflies.appendChild(f);
    jarFireflies.appendChild(f);    // mini inside jar
    captured++;
    jarProgressEl.textContent = `${captured} / 100`;
    loveJar.setAttribute('aria-label', `Captured fireflies – ${captured} / 100`);
    loveJar.style.setProperty('--glow', (captured / 100).toFixed(2));

    /* milestone flower sprout every 20 */
    if (captured % 20 === 0) sproutFlower();

    /* replace live firefly with next phrase (if available) */
    const nextIdx = LIVE_COUNT + captured - 1;
    if (phrases[nextIdx]) createFirefly(nextIdx, phrases[nextIdx]);
  }

  /* sprout extra flower (clone of existing front flower) */
  function sproutFlower() {
    const base = document.querySelector('.flower');
    if (!base) return;
    const clone = base.cloneNode(true);
    clone.style.left = rand(10, 90) + '%';
    clone.style.bottom = rand(5, 15) + 'vmin';
    clone.style.transform = `rotate(${rand(-30, 30)}deg) scale(${rand(0.5, 0.9)})`;
    document.querySelector('.flowers').appendChild(clone);
  }

  /* release all fireflies on jar click */
  loveJar.addEventListener('click', () => {
    const minis = Array.from(jarFireflies.children);
    minis.forEach(m => {
      m.classList.remove('firefly--captured');
      document.body.appendChild(m);
      activePool.push(m);
      /* resume random flight */
      requestAnimationFrame(() => m.style.animation = 'none'); // restart keyframes
      requestAnimationFrame(() => m.style.animation = '');
    });
    captured = 0;
    loveJar.style.setProperty('--glow', '0');
    jarProgressEl.textContent = '0 / 100';
    loveJar.setAttribute('aria-label', 'Captured fireflies – 0 / 100');
    /* remove extra flowers */
    document.querySelectorAll('.flowers .sprouted').forEach(e => e.remove());
  });

  /* accessibility: hide note with Esc */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && phraseNote.classList.contains('note--visible')) {
      phraseNoteCls.click();
    }
  });

  initFireflyCanvas();
};
