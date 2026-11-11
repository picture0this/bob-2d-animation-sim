/* 3 · The reveal — Bob holds his breath while it verifies, then the gift bursts open:
   starburst, bolts, confetti, the controller pops out, "Free. Told you.", tokens count up. */
Scenes.reveal = {
  caption: '<b>The reveal (peak).</b> Fires the moment staff scan. Bob holds his breath while it verifies, then burst, strong haptic, tokens count up.',

  async play(screen, ctx) {
    const C = CONFIG.reveal;
    const { anim, set, wait, tween, loop, haptic, shake, count } = Engine;

    screen.className = 'screen s-reveal';
    screen.innerHTML = `
      <div class="r-pill"><span>VERIFYING</span></div>
      <div class="r-stage">
        <div class="r-star-spin"><div class="r-star">${Props.starburst()}</div></div>
        <i class="r-dot d1"></i><i class="r-dot d2"></i><i class="r-dot d3"></i>
        <div class="r-bolt b1">${Props.bolt()}</div>
        <div class="r-bolt b2">${Props.bolt()}</div>
        <div class="r-bob"></div>
        <div class="r-prize"><div class="r-glow"></div><div class="r-ctl">${Props.controller()}</div></div>
        <div class="r-gift">${Props.gift()}</div>
        <div class="r-confetti"></div>
      </div>
      <h1 class="r-head"><span class="l1">${C.l1}</span><span class="l2">${C.l2}</span></h1>
      <div class="r-enjoy">Enjoy it, ${C.name}</div>
      <div class="r-card"><b class="r-plus">+0</b>
        <div><strong>tokens</strong> for showing up<small>Wallet: <span class="r-wallet">${C.wallet - C.tokens}</span></small></div></div>
      <div class="btn-primary r-btn">${C.cta}</div>
      <div class="r-flash"></div>`;

    const $ = s => screen.querySelector(s);
    const pill = $('.r-pill'), pillText = $('.r-pill span');
    const starSpin = $('.r-star-spin'), star = $('.r-star');
    const b1 = $('.b1'), b2 = $('.b2'), dots = screen.querySelectorAll('.r-dot');
    const prize = $('.r-prize'), glow = $('.r-glow'), gift = $('.r-gift'), lid = $('.gift-lid');
    const confetti = $('.r-confetti'), flash = $('.r-flash');
    const l1 = $('.l1'), l2 = $('.l2'), enjoy = $('.r-enjoy');
    const card = $('.r-card'), plus = $('.r-plus'), wallet = $('.r-wallet'), btn = $('.r-btn');
    const bob = Bob.mount($('.r-bob'));

    // Initial state: only Bob + the wrapped gift.
    set(star, { s: 0 }); set([b1, b2], { s: 0 }); set(dots, { s: 0 });
    set(prize, { o: 0, s: 0.2 }); set(glow, { o: 0 });
    set([l1, l2], { o: 0 }); set(enjoy, { o: 0, y: 12 }); set(card, { o: 0, y: 34 }); set(btn, { o: 0, y: 30 });
    set(bob.root, { s: 0.9, o: 0 }); set(gift, { o: 0, y: -60 });
    bob.pose('hold'); bob.face('open', 'o');

    // Anticipation: Bob and the gift arrive, he inhales and holds it.
    anim(bob.root, { s: 1, o: 1 }, 380, { ease: 'outBack' });
    await anim(gift, { o: 1, y: 0 }, 600, { ease: 'outBounce', delay: 120 });
    bob.face('squeeze', 'tight');
    anim(bob.cheeks, { from: { s: 0.4, o: 1 }, s: 1.15 }, 900, { ease: 'outBack' });
    anim(bob.root, { sy: 1.03, sx: 0.98 }, 900, { ease: 'outCubic' });
    await tween(1700, (p, raw) => {
      const a = raw * 2.4;
      set(bob.head, { x: (Math.random() - 0.5) * a, r: (Math.random() - 0.5) * a });
      set(gift, { r: Math.sin(raw * 70) * raw * 6, y: -Math.abs(Math.sin(raw * 35)) * raw * 5 });
      pillText.textContent = 'VERIFYING' + '.'.repeat(1 + (Math.floor(raw * 9) % 3));
    }, { ease: 'linear' });
    set(bob.head, { x: 0, r: 0 });

    // BURST — flash, strong haptic, screen shake.
    haptic([40, 30, 140]);
    anim(flash, { from: { o: 0.9 }, o: 0 }, 380);
    shake(screen, 11, 520, 46);
    pillText.textContent = `REDEEMED · ${C.store}`;
    anim(pill, { from: { s: 1.25 }, s: 1 }, 380, { ease: 'outBack' });

    // Bob explodes with joy.
    bob.face('happy', 'open');
    anim(bob.cheeks, { o: 0, s: 0.6 }, 200);
    anim(bob.root, { sy: 1, sx: 1, y: -22 }, 180, { ease: 'outQuad' }).then(() => anim(bob.root, { y: 0 }, 460, { ease: 'outBounce' }));
    anim(bob.armL, { r: 126 }, 420, { ease: 'outBackBig' });
    anim(bob.armR, { r: -126 }, 420, { ease: 'outBackBig' });
    anim(bob.ear, { from: { r: -30 }, r: 0 }, 1100, { ease: 'outElastic' });
    anim(bob.glasses, { from: { y: -18 }, y: 0 }, 650, { ease: 'outBounce' });

    // Starburst, bolts, dots.
    anim(star, { from: { s: 0, r: -70 }, s: 1, r: 0 }, 760, { ease: 'outBackBig' });
    anim(b1, { from: { s: 0, r: -40 }, s: 1, r: 0 }, 480, { ease: 'outBackBig', delay: 120 });
    anim(b2, { from: { s: 0, r: 40 }, s: 1, r: 0 }, 480, { ease: 'outBackBig', delay: 220 });
    dots.forEach((d, i) => anim(d, { s: 1 }, 420, { ease: 'outBackBig', delay: 160 + i * 90 }));

    // Gift opens, the controller pops out.
    anim(lid, { y: -150, r: -40, o: 0 }, 560, { ease: 'outCubic' });
    anim(gift, { y: 60, s: 0.6, o: 0 }, 420, { ease: 'inBack', delay: 60 });
    anim(prize, { from: { y: 60, r: -14 }, s: 1, y: 0, o: 1, r: 0 }, 780, { ease: 'outBackBig', delay: 80 });
    anim(glow, { o: 1 }, 500, { delay: 200 });
    burstConfetti(confetti, 30);

    // "Free. Told you."
    await wait(420);
    haptic(20);
    await anim(l1, { from: { s: 2.4 }, s: 1, o: 1 }, 280, { ease: 'outBack' });
    await wait(130);
    haptic(30);
    await anim(l2, { from: { s: 2.4 }, s: 1, o: 1 }, 280, { ease: 'outBack' });
    shake(screen, 6, 300, 40);
    anim(enjoy, { o: 1, y: 0 }, 380, { delay: 80 });

    // Tokens count up.
    await anim(card, { o: 1, y: 0 }, 480, { ease: 'outBack', delay: 240 });
    await Promise.all([
      count(plus, 0, C.tokens, 600, v => '+' + Math.round(v)),
      count(wallet, C.wallet - C.tokens, C.wallet, 900),
    ]);
    haptic(15);
    anim(card, { s: 1.07 }, 120).then(() => anim(card, { s: 1 }, 320, { ease: 'outBack' }));
    await anim(btn, { o: 1, y: 0 }, 440, { ease: 'outBack' });
    ctx.done();

    // Idle celebration: star spins, Bob bounces and pumps, prize floats, bolts buzz.
    loop(t => {
      set(starSpin, { r: t * 9 });
      set(bob.idle, { y: -Math.abs(Math.sin(t * 3.2)) * 6 });
      set(bob.armL, { r: 126 + Math.sin(t * 6.4) * 9 });
      set(bob.armR, { r: -126 - Math.sin(t * 6.4) * 9 });
      set(bob.ear, { r: Math.sin(t * 6.4) * 4 });
      set(prize, { y: Math.sin(t * 2) * 5, r: Math.sin(t * 1.3) * 3 });
      set(b1, { r: Math.sin(t * 5) * 7, s: 1 + Math.sin(t * 5) * 0.05 });
      set(b2, { r: -Math.sin(t * 5 + 1) * 7, s: 1 + Math.sin(t * 5 + 1) * 0.05 });
      dots.forEach((d, i) => set(d, { y: Math.sin(t * 2.4 + i * 2) * 5 }));
    });
  },
};

function burstConfetti(host, n) {
  const colors = ['#FBBF16', '#E8308A', '#74A7DB', '#E4EE3A', '#FFFFFF', '#141414'];
  for (let i = 0; i < n; i++) {
    const el = document.createElement('i');
    if (i % 3 === 0) el.className = 'round';
    el.style.background = colors[i % colors.length];
    host.appendChild(el);
    const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
    const d = 120 + Math.random() * 120, spin = (Math.random() - 0.5) * 900;
    const dur = 1300 + Math.random() * 600;
    Engine.set(el, { s: 0.6 + Math.random() * 0.6 });
    Engine.tween(dur, (p, raw) => {
      const k = Engine.ease.outCubic(raw);
      Engine.set(el, {
        x: Math.cos(a) * d * k,
        y: Math.sin(a) * d * k + 220 * raw * raw,
        r: spin * raw,
        o: raw < 0.65 ? 1 : 1 - (raw - 0.65) / 0.35,
      });
    }, { ease: 'linear' });
  }
}
