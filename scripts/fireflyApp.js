// scripts/fireflyApp.js
(() => {
  // —— Utilities ——
  const rng      = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

  // —— Canvas & State ——
  let canvas, ctx, animationID;
  const fireflies = [];
  const capturedFireflies = [];           // store captured Firefly instances
  let captured = 0;
  let currentCatch = null;

  // —— Phrases ——
  // (Make sure this array has exactly 100 entries)
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

  // —— DOM Refs ——
  let loveJar, jarFireflies, jarProgressEl;
  let phraseNote, phraseNoteTxt, phraseNoteClose, captureSound;

  // —— Firefly Class ——
  class Firefly {
    constructor(x, y, r, phrase) {
      this.x = x; this.y = y; this.r = r;
      this.phrase = phrase;
      this.vx = Math.random() * Math.PI;
      this.vy = Math.random() * Math.PI;
      this.glow = { strength: rng(100, 220), growing: true };
      this.state = 'flying'; // or 'to-jar'
      this.t = 0;
    }
    draw() {
      // glow pulse
      if (this.glow.growing) {
        this.glow.strength++;
        if (this.glow.strength >= 255) this.glow.growing = false;
      } else {
        this.glow.strength--;
        if (this.glow.strength <= 80) this.glow.growing = true;
      }

      // move toward jar when caught
      if (this.state === 'to-jar') {
        this.t += 0.02;
        const jarRect = loveJar.getBoundingClientRect();
        const tx = jarRect.left + jarRect.width / 2;
        const ty = jarRect.top + jarRect.height / 2;
        this.x = this.startX + (tx - this.startX) * this.t;
        this.y = this.startY + (ty - this.startY) * this.t;
        if (this.t >= 1) this._finished = true;
      } else {
        // Get jar position
        const jarRect = loveJar.getBoundingClientRect();
        const jarCenter = {
          x: jarRect.left + jarRect.width / 2,
          y: jarRect.top + jarRect.height / 2
        };
        
        // Calculate distance to jar center
        const dx = this.x - jarCenter.x;
        const dy = this.y - jarCenter.y;
        const distToJar = Math.sqrt(dx * dx + dy * dy);
        
        // Define no-fly zone (jar bounds + padding)
        const noFlyZone = jarRect.width/2 + 40; // 40px padding
        
        if (distToJar < noFlyZone) {
          // Inside no-fly zone - adjust velocity to move away from jar
          const angle = Math.atan2(dy, dx);
          this.vx = angle;
          this.vy = angle;
        } else {
          // Normal movement
          if (this.x + this.r >= canvas.width || this.x - this.r <= 0) this.vx -= 0.07;
          else this.vx += Math.random() * 0.34 - 0.17;
          if (this.y + this.r >= canvas.height || this.y - this.r <= 0) this.vy -= 0.07;
          else this.vy += Math.random() * 0.34 - 0.17;
        }
        
        this.x += 0.75 * Math.cos(this.vx);
        this.y += 0.75 * Math.sin(this.vy);
      }

      // draw glow
      const grad = ctx.createRadialGradient(this.x, this.y, this.r/5, this.x, this.y, this.r);
      grad.addColorStop(0, `#ffffea`);
      const hexGlow = this.glow.strength.toString(16).padStart(2, '0');
      grad.addColorStop(0.1, `#ff881b${hexGlow}`);
      grad.addColorStop(1, `#ff881b00`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  // —— Initialization ——
  window.initFireflyApp = () => {
    loveJar       = document.getElementById('loveJar');
    jarFireflies  = document.getElementById('jarFireflies');
    jarProgressEl = document.getElementById('jarProgress');
    phraseNote    = document.getElementById('phraseNote');
    phraseNoteTxt = phraseNote.querySelector('.note__text');
    phraseNoteClose = document.getElementById('phraseNoteClose');
    captureSound  = document.getElementById('captureSound');

    // set up canvas
    canvas = document.createElement('canvas');
    canvas.id = 'firefly-canvas';
    Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', zIndex: 800, pointerEvents: 'auto' });
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', onCanvasClick);

    // spawn one firefly per phrase
    for (let i = 0; i < phrases.length; i++) {
      const r = rng(4, 14);
      const x = rng(r, canvas.width - r);
      const y = rng(r, canvas.height - r);
      fireflies.push(new Firefly(x, y, r, phrases[i]));
    }

    phraseNoteClose.addEventListener('click', onPhraseClose);
    loveJar.addEventListener('click', releaseAll);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && phraseNote.classList.contains('note--visible')) phraseNoteClose.click();
    });

    animate();
  };

  // —— Animation Loop ——
  function animate() {
    animationID = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireflies.forEach(f => f.draw());
    // remove those that reached the jar
    for (let i = fireflies.length - 1; i >= 0; i--) {
      if (fireflies[i]._finished) fireflies.splice(i, 1);
    }
  }

  // —— Click to catch ——
  function onCanvasClick(e) {
    if (currentCatch) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (const f of fireflies) {
      if (distance(f.x, f.y, mx, my) < f.r) {
        catchFirefly(f);
        break;
      }
    }
  }

  function catchFirefly(f) {
    currentCatch = f;
    phraseNote.classList.add('note--visible');
    phraseNoteTxt.innerHTML = '';
    [...f.phrase].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.animationDelay = `${i*40}ms`;
      phraseNoteTxt.appendChild(span);
    });
    captureSound.currentTime = 0;
    captureSound.play();
  }

  // —— After closing phrase ——
  function onPhraseClose() {
    phraseNote.classList.remove('note--visible');
    if (!currentCatch) return;
    currentCatch.state  = 'to-jar';
    currentCatch.startX = currentCatch.x;
    currentCatch.startY = currentCatch.y;
    currentCatch.t      = 0;

    const checkDone = () => {
      if (currentCatch._finished) {
        storeFirefly(currentCatch);
        currentCatch = null;
      } else {
        requestAnimationFrame(checkDone);
      }
    };
    checkDone();
  }

  // —— Store in jar ——
  function storeFirefly(f) {
    capturedFireflies.push(f);            // keep instance for release

    const mini = document.createElement('div');
    mini.className = 'firefly firefly--captured';
    mini.style.width  = `${f.r}px`;
    mini.style.height = `${f.r}px`;
    const dx = rng(-10, 10);
    const dy = rng(-10, 10);
    const dur = (rng(30, 70) / 10) + 's';
    mini.style.setProperty('--dx', `${dx}px`);
    mini.style.setProperty('--dy', `${dy}px`);
    mini.style.setProperty('--float-dur', dur);
    jarFireflies.appendChild(mini);

    captured++;
    jarProgressEl.textContent = `${captured} / 100`;
    loveJar.setAttribute('aria-label', `Captured fireflies – ${captured} / 100`);
    loveJar.style.setProperty('--glow', (captured/100).toFixed(2));

    if (captured % 20 === 0) {
      const base = document.querySelector('.flower');
      if (base) {
        const clone = base.cloneNode(true);
        clone.classList.add('sprouted');
        clone.style.left   = `${rng(10,90)}%`;
        clone.style.bottom = `${rng(5,15)}vmin`;
        clone.style.transform = `rotate(${rng(-30,30)}deg) scale(${rng(50,90)/100})`;
        document.querySelector('.flowers').appendChild(clone);
      }
    }
  }

  // —— Release all ——
  function releaseAll() {
    const jarRect = loveJar.getBoundingClientRect();
    const jarCenterX = jarRect.left + jarRect.width / 2;
    const jarCenterY = jarRect.top + jarRect.height / 2;
    
    capturedFireflies.forEach(f => {
      f.x = jarCenterX;
      f.y = jarCenterY;
      
      // Calculate a random angle for initial burst (0 to 2π)
      const releaseAngle = Math.random() * Math.PI * 2;
      // Give each firefly an initial velocity away from the jar
      const initialSpeed = 2;  // Adjust this value to control burst speed
      f.vx = Math.cos(releaseAngle) * initialSpeed;
      f.vy = Math.sin(releaseAngle) * initialSpeed;
      
      f.state = 'flying';
      f._finished = false;
      fireflies.push(f);
    });
    capturedFireflies.length = 0;

    jarFireflies.innerHTML = '';
    captured = 0;
    jarProgressEl.textContent = '0 / 100';
    loveJar.setAttribute('aria-label','Captured fireflies – 0 / 100');
    loveJar.style.setProperty('--glow','0');
  }

  window.addEventListener('load', initFireflyApp);
})();
