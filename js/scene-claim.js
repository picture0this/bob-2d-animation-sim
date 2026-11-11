/* 2 · Claim secured — window fills, tightens by distance, Bob drops his shades
   ("Time Police mode") and skates toward the store while the ring drains. */
Scenes.claim = {
  caption: '<b>Claim secured.</b> Distance-adjusted countdown. Bob drops his shades (Time Police mode) and skates toward the store as the ring drains.',

  async play(screen, ctx) {
    const C = CONFIG.claim;
    const { anim, set, wait, tween, loop, haptic, shake } = Engine;

    screen.className = 'screen s-claim';
    screen.innerHTML = `
      <div class="c-label">CLAIM SECURED</div>
      <h2 class="c-title">${C.title}</h2>
      <div class="c-sub">${C.store} · ${C.area}</div>
      <div class="c-ring">
        <svg viewBox="0 0 200 200"><circle class="c-ring-track" cx="100" cy="100" r="86"/>
          <circle class="c-ring-prog" cx="100" cy="100" r="86" pathLength="100" transform="rotate(-90 100 100)"/></svg>
        <div class="c-time"><b>00:00</b><span>to arrive</span></div>
      </div>
      <div class="c-track">
        <div class="c-line"><div class="c-fill"></div></div>
        <div class="c-pin"></div>
        <div class="c-skater"><div class="c-speed"><i></i><i></i><i></i></div><div class="c-bob"></div></div>
        <div class="c-lab you">You</div>
        <div class="c-lab dist"><span>${C.km.toFixed(1)}</span> km to go</div>
        <div class="c-lab dest">${C.store}</div>
      </div>
      <div class="c-bubble"><span></span></div>
      <div class="btn-primary c-qr">Show QR at counter</div>
      <div class="c-row"><div>Directions</div><div class="ghost">Release claim</div></div>`;

    const $ = s => screen.querySelector(s);
    const label = $('.c-label'), title = $('.c-title'), sub = $('.c-sub');
    const ring = $('.c-ring'), prog = $('.c-ring-prog'), timeB = $('.c-time b');
    const track = $('.c-track'), line = $('.c-line'), fill = $('.c-fill'), pin = $('.c-pin');
    const skater = $('.c-skater'), speed = $('.c-speed');
    const you = $('.c-lab.you'), dist = $('.c-lab.dist'), distN = $('.c-lab.dist span'), dest = $('.c-lab.dest');
    const bubble = $('.c-bubble'), bubbleText = $('.c-bubble span'), qr = $('.c-qr'), row = $('.c-row');
    const bob = Bob.mount($('.c-bob'), { full: true });

    const WINDOW = 30 * 60; // full claim window in seconds
    const mmss = s => { s = Math.max(0, Math.round(s)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
    let timeLeft = 0;
    const setTime = s => {
      timeLeft = s;
      timeB.textContent = mmss(s);
      const pct = Math.max(0, Math.min(100, (s / WINDOW) * 100));
      prog.style.strokeDasharray = `${pct} 100`;
      prog.style.opacity = pct < 0.5 ? 0 : 1;
    };
    const travel = () => track.clientWidth - 50;
    const setProgress = p => {
      const x = p * travel();
      set(skater, { x });
      fill.style.width = `${x}px`;
      set(dist, { x: Math.min(Math.max(x, 92), track.clientWidth - 140) });
      distN.textContent = (C.km * (1 - p)).toFixed(1);
      bubble.style.setProperty('--tail', `${Math.min(Math.max(x + 2, 22), 270)}px`);
    };
    const say = txt => { bubbleText.textContent = txt; return anim(bubble, { from: { s: 0.9 }, s: 1, o: 1, y: 0 }, 340, { ease: 'outBack' }); };

    // Initial state
    set(label, { o: 0, s: 1.8 }); set(title, { o: 0, y: 18 }); set(sub, { o: 0 });
    set(ring, { o: 0, s: 0.85 }); set(timeB, { o: 0, s: 0.6 });
    set([line, you, dest, dist], { o: 0 }); set(pin, { s: 0 });
    set(bob.root, { o: 0, y: -110 }); bob.pose('balance'); bob.face('open', 'smile');
    set(bubble, { o: 0, s: 0.85, y: 10 }); set(qr, { o: 0, y: 26 }); set(row, { o: 0, y: 26 });
    setTime(0); setProgress(0);

    await wait(200);

    // Stamp + title
    haptic(25);
    anim(label, { o: 1, s: 1 }, 380, { ease: 'outBackBig' });
    anim(title, { o: 1, y: 0 }, 420, { delay: 120 });
    anim(sub, { o: 1 }, 400, { delay: 260 });
    await anim(ring, { o: 1, s: 1 }, 420, { ease: 'outBack', delay: 180 });

    // Window fills to 30:00
    anim(timeB, { o: 1, s: 1 }, 380, { ease: 'outBack' });
    await tween(800, t => setTime(t * WINDOW), { ease: 'outCubic' });

    // Track appears, Bob drops onto his board
    anim([line, you, dest, dist], { o: 1 }, 260);
    anim(pin, { s: 1 }, 450, { ease: 'outBack', delay: 140 });
    await anim(bob.root, { o: 1, y: 0 }, 650, { ease: 'outBounce' });
    await anim(bob.root, { sy: 0.86 }, 90, { ease: 'outQuad' });
    await anim(bob.root, { sy: 1 }, 260, { ease: 'outBack' });

    // Time Police mode: shades come down, window tightens to the real distance.
    await anim(bob.glasses, { y: 48 }, 380, { ease: 'outBounce' });
    haptic([15, 40, 15]);
    say(C.lines[0]);
    timeB.classList.add('warn');
    shake(ring, 6, 420, 40);
    await tween(700, t => setTime(WINDOW - t * (WINDOW - C.windowAfter)), { ease: 'inOutCubic' });
    timeB.classList.remove('warn');
    anim(qr, { o: 1, y: 0 }, 450, { ease: 'outBack' });
    anim(row, { o: 1, y: 0 }, 450, { ease: 'outBack', delay: 90 });
    await wait(900);

    // Skate! Lean in, speed lines, ring drains with the trip, ollie before the store.
    anim(bob.root, { r: 7 }, 300);
    set(speed, { o: 1 });
    let saidHalf = false;
    const t0 = C.windowAfter, spent = C.tripMinutes * 60;
    const skate = tween(4600, (p, raw) => {
      setProgress(p);
      setTime(t0 - p * spent);
      set(bob.idle, { y: -Math.abs(Math.sin(raw * 38)) * 2.2 * (1 - raw) });
      if (!saidHalf && p > 0.48 && raw < 1) { saidHalf = true; say(C.lines[1]); }
    }, { ease: 'inOutSine' });
    const ollie = (async () => {
      await wait(3350);
      bob.face('happy', 'open');
      anim(bob.board, { r: -14 }, 200);
      await anim(bob.root, { y: -38, r: -6 }, 260, { ease: 'outQuad' });
      anim(bob.board, { r: 0 }, 260);
      await anim(bob.root, { y: 0, r: 7 }, 340, { ease: 'outBounce' });
      bob.face('open', 'smile');
    })();
    await skate;
    await ollie;
    set(speed, { o: 0 });
    set(bob.idle, { y: 0 });

    // Arrived: shades back up, arms up, pin pops.
    await anim(bob.root, { r: 0 }, 240, { ease: 'outBack' });
    haptic(30);
    bob.face('happy', 'open');
    anim(bob.glasses, { y: 0 }, 420, { ease: 'outBack' });
    anim(bob.armL, { r: 126 }, 380, { ease: 'outBack' });
    anim(bob.armR, { r: -126 }, 380, { ease: 'outBack' });
    anim(pin, { s: 1.3 }, 150).then(() => anim(pin, { s: 1 }, 320, { ease: 'outBack' }));
    anim(dist, { o: 0 }, 250);
    say(C.lines[2]);
    await wait(450);
    const endTime = timeLeft;
    ctx.done();

    // Idle: live countdown, happy bounce, arms pump, QR button breathes.
    bob.face('happy', 'smile');
    loop(t => {
      setTime(endTime - t);
      set(bob.idle, { y: -Math.abs(Math.sin(t * 3)) * 4 });
      set(bob.armL, { r: 126 + Math.sin(t * 6) * 8 });
      set(bob.armR, { r: -126 - Math.sin(t * 6) * 8 });
      set(qr, { s: 1 + Math.max(0, Math.sin(t * 3.2)) * 0.025 });
    });
  },
};
