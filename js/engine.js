/* Tiny timeline engine: tweens, loops, skip-to-end. No dependencies, works from file://. */
(function (global) {
  const tweens = new Set();
  const loops = new Set();
  const store = new WeakMap();
  let raf = 0, gen = 0, skipping = false, intro = false;
  let onIntroChange = () => {};

  const ease = {
    linear: t => t,
    inQuad: t => t * t,
    outQuad: t => 1 - (1 - t) * (1 - t),
    inCubic: t => t * t * t,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outBack: t => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
    outBackBig: t => 1 + 4 * Math.pow(t - 1, 3) + 3 * Math.pow(t - 1, 2),
    inBack: t => 2.70158 * t * t * t - 1.70158 * t * t,
    outElastic: t =>
      t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
    outBounce: t => {
      const n = 7.5625, d = 2.75;
      if (t < 1 / d) return n * t * t;
      if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
      return n * (t -= 2.625 / d) * t + 0.984375;
    },
  };

  const isList = el => el instanceof NodeList || Array.isArray(el);

  // Per-element transform state. SVG elements rotate/scale around data-ox / data-oy (user units).
  function st(el) {
    let s = store.get(el);
    if (!s) {
      const d = el.dataset || {};
      s = { x: 0, y: 0, r: 0, s: 1, sx: 1, sy: 1, o: 1,
            svg: el instanceof SVGElement, ox: +(d.ox || 0), oy: +(d.oy || 0) };
      store.set(el, s);
    }
    return s;
  }

  function apply(el) {
    const s = st(el), sx = s.s * s.sx, sy = s.s * s.sy;
    if (s.svg) {
      el.setAttribute('transform',
        `translate(${s.x + s.ox} ${s.y + s.oy}) rotate(${s.r}) scale(${sx} ${sy}) translate(${-s.ox} ${-s.oy})`);
    } else {
      el.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.r}deg) scale(${sx},${sy})`;
    }
    el.style.opacity = s.o;
  }

  function set(el, props) {
    if (!el) return;
    if (isList(el)) { el.forEach(e => set(e, props)); return; }
    Object.assign(st(el), props);
    apply(el);
  }

  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  function frame() {
    raf = 0;
    const now = performance.now();
    for (const tw of Array.from(tweens)) {
      if (tw.gen !== gen) { tweens.delete(tw); continue; }
      const e = now - tw.t0;
      if (e < 0) continue;
      const raw = tw.dur > 0 ? Math.min(1, e / tw.dur) : 1;
      try { tw.fn(tw.ease(raw), raw); } catch (err) { console.error(err); }
      if (raw >= 1) { tweens.delete(tw); tw.resolve(); }
    }
    for (const l of Array.from(loops)) {
      try { l.fn((now - l.t0) / 1000, l); } catch (err) { console.error(err); }
    }
    if (tweens.size || loops.size) kick();
  }

  // fn(easedT, rawT). Resolves when done. While skipping, completes instantly.
  function tween(dur, fn, opts = {}) {
    const e = typeof opts.ease === 'function' ? opts.ease : ease[opts.ease || 'outCubic'];
    const delay = opts.delay || 0;
    return new Promise(resolve => {
      if (skipping || (dur <= 0 && delay <= 0)) { fn(1, 1); resolve(); return; }
      tweens.add({ t0: performance.now() + delay, dur, fn, ease: e, resolve, gen });
      kick();
    });
  }

  // anim(el, { x, y, r, s, sx, sy, o, from: {...} }, ms, { ease, delay })
  function anim(el, to, dur = 400, opts = {}) {
    if (!el) return Promise.resolve();
    if (isList(el)) return Promise.all(Array.from(el).map(e => anim(e, to, dur, opts)));
    const s = st(el);
    if (to.from) { Object.assign(s, to.from); apply(el); }
    const keys = Object.keys(to).filter(k => k !== 'from');
    let from = null;
    return tween(dur, t => {
      if (!from) { from = {}; keys.forEach(k => (from[k] = s[k])); }
      keys.forEach(k => (s[k] = from[k] + (to[k] - from[k]) * t));
      apply(el);
    }, opts);
  }

  const wait = ms => tween(ms, () => {}, { ease: 'linear' });

  const count = (el, a, b, dur, fmt = v => Math.round(v), opts = {}) =>
    tween(dur, t => { el.textContent = fmt(a + (b - a) * t); }, opts);

  const shake = (el, amp = 8, dur = 400, freq = 40) =>
    tween(dur, (t, raw) => set(el, { x: Math.sin(raw * freq) * amp * (1 - raw) }), { ease: 'linear' });

  function haptic(pattern) {
    const ua = navigator.userActivation;
    if (ua && !ua.hasBeenActive) return; // Chrome blocks vibration before the first real tap
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* not supported */ }
  }

  function loop(fn) {
    const l = { fn, t0: performance.now() };
    loops.add(l);
    kick();
    return { stop: () => loops.delete(l) };
  }

  function setIntro(on) { intro = on; onIntroChange(on); }

  // Jump every running intro tween to its end; later intro steps finish instantly.
  function skip() {
    if (!intro) return false;
    skipping = true;
    for (const tw of Array.from(tweens)) {
      tweens.delete(tw);
      try { tw.fn(1, 1); } catch (err) { console.error(err); }
      tw.resolve();
    }
    return true;
  }

  function reset() {
    tweens.clear();
    loops.clear();
    skipping = false;
    gen++;
  }

  async function run(sceneFn, root) {
    reset();
    setIntro(true);
    const myGen = gen;
    const ctx = {
      alive: () => myGen === gen,
      done: () => { if (myGen === gen) { skipping = false; setIntro(false); } },
    };
    try { await sceneFn(root, ctx); } catch (err) { console.error(err); }
  }

  global.Engine = {
    ease, set, get: st, anim, tween, wait, count, shake, haptic, loop, skip, run,
    isIntro: () => intro,
    onIntro: f => { onIntroChange = f; },
  };
  global.Scenes = global.Scenes || {};
})(window);
