/* 1 · Welcome — Bob pops in waving, pitches the deal, headline lands after him. */
Scenes.welcome = {
  caption: '<b>Welcome.</b> Bob pops in waving like he owns the place, pitches the deal in two lines. Headline lands after him.',

  async play(screen, ctx) {
    const C = CONFIG.welcome;
    const { anim, set, wait, loop } = Engine;
    const words = C.title.split(' ').map(w => `<span class="word">${w}</span>`).join('');

    screen.className = 'screen s-welcome';
    screen.innerHTML = `
      <div class="w-bob"></div>
      <h1 class="w-title">${words}</h1>
      <p class="w-sub">${C.sub}</p>
      <div class="pager"><i class="on"></i><i></i><i></i></div>
      <div class="btn-primary w-btn">${C.cta}</div>`;

    const $ = s => screen.querySelector(s);
    const bob = Bob.mount($('.w-bob'));
    // Motion lines beside the waving hand (same viewBox as Bob so they line up).
    $('.w-bob').insertAdjacentHTML('beforeend',
      `<svg viewBox="28 0 184 272" overflow="visible"><g class="w-fx" fill="none" stroke="#141414" stroke-width="4" stroke-linecap="round">
        <path d="M206 118 L214 108"/><path d="M212 140 L224 138"/><path d="M208 162 L218 170"/></g></svg>`);
    const fx = $('.w-fx');
    const wordEls = screen.querySelectorAll('.word');
    const sub = $('.w-sub'), pager = $('.pager'), btn = $('.w-btn');

    set(bob.root, { s: 0, y: 40 });
    set(bob.glasses, { o: 0 });
    set(wordEls, { o: 0, y: 34, s: 0.7 });
    set(sub, { o: 0, y: 16 });
    set(pager, { o: 0 });
    set(btn, { o: 0, y: 30 });
    set(fx, { o: 0 });
    bob.face('happy', 'smile');

    await wait(250);

    // Pop in: body overshoots, ear springs, shades drop onto the forehead.
    anim(bob.ear, { from: { r: -26 }, r: 0 }, 1100, { ease: 'outElastic', delay: 120 });
    anim(bob.glasses, { from: { y: -46, o: 1 }, y: 0 }, 700, { ease: 'outBounce', delay: 180 });
    await anim(bob.root, { s: 1, y: 0 }, 620, { ease: 'outBack' });
    bob.face('open', 'smile');

    // Arm up, then wave.
    await anim(bob.armR, { r: -126 }, 360, { ease: 'outBack' });
    anim(fx, { o: 1 }, 150);
    const wave = (async () => {
      for (let i = 0; i < 3; i++) {
        await anim(bob.armR, { r: -144 }, 190, { ease: 'inOutSine' });
        await anim(bob.armR, { r: -108 }, 190, { ease: 'inOutSine' });
      }
      await anim(bob.armR, { r: -126 }, 170, { ease: 'inOutSine' });
      anim(fx, { o: 0 }, 200);
    })();

    // "Hey. I'm Bob." — he talks, the words land one by one after him.
    bob.talk(5);
    wordEls.forEach((w, i) => anim(w, { o: 1, y: 0, s: 1 }, 440, { ease: 'outBackBig', delay: 160 + i * 150 }));
    await wait(160 + wordEls.length * 150 + 260);
    await anim(sub, { o: 1, y: 0 }, 420);
    anim(pager, { o: 1 }, 300);
    await anim(btn, { o: 1, y: 0 }, 460, { ease: 'outBack' });
    await wave;
    bob.face('open', 'smile');
    ctx.done();

    // Idle: breathe, ear sway, blink, a friendly wave every few seconds.
    bob.blinkLoop();
    loop(t => {
      set(bob.idle, { y: Math.sin(t * 2.2) * 2.5 });
      set(bob.ear, { r: Math.sin(t * 1.6) * 4 });
      const ph = t % 4.5, amp = ph < 1.3 ? Math.sin((ph / 1.3) * Math.PI) : 0;
      set(bob.armR, { r: -126 + Math.sin(t * 13) * 16 * amp });
      set(fx, { o: amp });
      set(btn, { s: 1 + Math.max(0, Math.sin(t * 3)) * 0.015 });
    });
  },
};
