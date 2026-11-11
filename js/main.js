/* Copy for each screen — edit freely. */
const CONFIG = {
  welcome: {
    title: "Hey. I'm Bob.",
    sub: 'I made Balash so you can try your city for free. Stores drop free stuff. You grab it. Done.',
    cta: "Let's go",
  },
  claim: {
    title: 'PS5 controller is yours',
    store: 'Game Hub',
    area: 'Block 10, Salmiya',
    km: 1.4,
    windowAfter: 22 * 60, // window after it tightens to the real distance (seconds)
    tripMinutes: 6,       // how much of the window the simulated trip uses
    lines: [
      "Window tightened. You're 1.4 km out. I believe in you. Mostly.",
      'Halfway. Smooth roads, cool head.',
      "Made it. Show the QR and it's yours.",
    ],
  },
  reveal: {
    store: 'GAME HUB',
    l1: 'Free.',
    l2: 'Told you.',
    name: 'Fatima',
    tokens: 2,
    wallet: 40,
    cta: "Nice. What's next?",
  },
};

(function () {
  const stage = document.getElementById('stage');
  const screen = document.getElementById('screen');
  const phone = document.getElementById('phone');
  const caption = document.getElementById('caption');
  const hint = document.getElementById('skipHint');
  const buttons = document.querySelectorAll('.controls button');

  const under = document.querySelector('.under');
  function fit() {
    const h = stage.clientHeight - under.offsetHeight - 24;
    const w = stage.clientWidth - 32;
    const s = Math.max(0.35, Math.min(h / 780, w / 380, 1.1));
    document.documentElement.style.setProperty('--s', s.toFixed(4));
  }
  window.addEventListener('resize', fit);
  fit();

  Engine.onIntro(on => hint.classList.toggle('show', on));

  function play(name) {
    const scene = Scenes[name];
    if (!scene) return;
    buttons.forEach(b => b.classList.toggle('active', b.dataset.scene === name));
    caption.innerHTML = scene.caption;
    fit();
    Engine.set(screen, { x: 0, y: 0, r: 0, s: 1, o: 1 });
    Engine.run((root, ctx) => scene.play(root, ctx), screen);
  }

  buttons.forEach(b => b.addEventListener('click', e => {
    if (e.detail > 0) b.blur(); // mouse click: drop focus so Space skips instead of replaying
    play(b.dataset.scene);
  }));
  phone.addEventListener('pointerdown', () => Engine.skip());
  document.addEventListener('keydown', e => {
    const map = { 1: 'welcome', 2: 'claim', 3: 'reveal' };
    if (map[e.key]) play(map[e.key]);
    if (e.key === ' ') { e.preventDefault(); Engine.skip(); }
  });

  // Wait for the fonts so text lands in its final spot; fall back after a moment if offline.
  let started = false;
  const start = () => { if (!started) { started = true; fit(); play('welcome'); } };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  setTimeout(start, 1200);
})();
