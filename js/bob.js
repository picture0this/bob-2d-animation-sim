/* Bob — flat 2D rig matching the Balash wireframes (orange head, tall ear, white shades on
   the forehead, white face, white hoodie, black crossbody strap, orange hands).
   Every moving part is its own <g> with a pivot in data-ox / data-oy. */
(function (global) {
  const O = '#F26430', K = '#141414', W = '#FFFFFF', P = '#E8308A', PANTS = '#1F1F1F', BLUSH = '#FF8FA3';

  function lens(x, y, w, h) {
    return `<rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="9" fill="${K}"/>
      <rect x="${x - 1.5}" y="${y - 1.5}" width="${w + 3}" height="${h + 3}" rx="7" fill="${W}"/>
      <rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="3.5" fill="${K}"/>`;
  }

  // Arm = white sleeve with black outline + orange hand. Pivot at the shoulder.
  function arm(cls, sx, sy, ex, ey) {
    const hx = ex + (ex - sx) * 0.08, hy = ey + (ey - sy) * 0.08;
    return `<g class="${cls}" data-ox="${sx}" data-oy="${sy}">
      <line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${K}" stroke-width="23" stroke-linecap="round"/>
      <line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${W}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="11" fill="${O}" stroke="${K}" stroke-width="4.5"/>
    </g>`;
  }

  const LEGS = `<g class="bob-legs">
      <path d="M80 252 H118 L119 318 H72 Z" fill="${PANTS}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M122 252 H160 L168 318 H121 Z" fill="${PANTS}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M66 334 V326 Q66 311 83 311 H106 Q122 311 122 326 V334 Z" fill="${O}" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/>
      <rect x="64" y="325" width="60" height="10" rx="5" fill="${W}" stroke="${K}" stroke-width="4"/>
      <path d="M118 334 V326 Q118 311 134 311 H157 Q174 311 174 326 V334 Z" fill="${O}" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/>
      <rect x="116" y="325" width="60" height="10" rx="5" fill="${W}" stroke="${K}" stroke-width="4"/>
    </g>`;

  const BOARD = `<g class="bob-board" data-ox="120" data-oy="344">
      <rect x="42" y="337" width="156" height="11" rx="5.5" fill="${P}" stroke="${K}" stroke-width="4"/>
      <circle cx="72" cy="354" r="7.5" fill="${K}"/><circle cx="72" cy="354" r="2.5" fill="${W}"/>
      <circle cx="168" cy="354" r="7.5" fill="${K}"/><circle cx="168" cy="354" r="2.5" fill="${W}"/>
    </g>`;

  const BAG = `<g class="bob-bag">
      <rect x="146" y="236" width="34" height="30" rx="6" fill="${K}"/>
      <path d="M146 247 H180" stroke="#2c2c2c" stroke-width="2"/>
      <path d="M160 248 V262 M160 258 a4.2 4.2 0 1 0 8.4 0 a4.2 4.2 0 1 0 -8.4 0" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
    </g>`;

  const HEAD = `<g class="bob-head" data-ox="120" data-oy="182">
      <g class="bob-ear" data-ox="120" data-oy="96">
        <rect x="104" y="12" width="32" height="92" rx="16" fill="${O}" stroke="${K}" stroke-width="5"/>
      </g>
      <circle cx="120" cy="125" r="58" fill="${O}" stroke="${K}" stroke-width="5"/>
      <path d="M74.5 118 H165.5 A46 46 0 1 1 74.5 118 Z" fill="${W}"/>
      <line x1="69" y1="117" x2="171" y2="117" stroke="${K}" stroke-width="6" stroke-linecap="round"/>
      <g class="bob-cheek" data-ox="92" data-oy="153"><ellipse cx="92" cy="153" rx="9" ry="6" fill="${BLUSH}"/></g>
      <g class="bob-cheek" data-ox="148" data-oy="153"><ellipse cx="148" cy="153" rx="9" ry="6" fill="${BLUSH}"/></g>
      <g data-eyes="open"><g class="bob-eyes-open" data-ox="120" data-oy="140">
        <ellipse cx="104" cy="140" rx="7.5" ry="10.5" fill="${K}"/><circle cx="106.5" cy="135.5" r="2.6" fill="${W}"/>
        <ellipse cx="136" cy="140" rx="7.5" ry="10.5" fill="${K}"/><circle cx="138.5" cy="135.5" r="2.6" fill="${W}"/>
      </g></g>
      <g data-eyes="happy" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round">
        <path d="M95 144 Q104 131 113 144"/><path d="M127 144 Q136 131 145 144"/>
      </g>
      <g data-eyes="squeeze" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M96 133 L110 140 L96 147"/><path d="M144 133 L130 140 L144 147"/>
      </g>
      <path data-mouth="smile" d="M111 158 Q120 166 129 158" fill="none" stroke="${K}" stroke-width="4.5" stroke-linecap="round"/>
      <g data-mouth="open">
        <path d="M104 154 Q120 157 136 154 Q134 177 120 177 Q106 177 104 154 Z" fill="${K}" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M112 171 Q120 164 128 171 Q124 175.5 120 175.5 Q116 175.5 112 171 Z" fill="#FF6B7A"/>
      </g>
      <path data-mouth="tight" d="M111 161 Q115.5 157 120 161 Q124.5 165 129 161" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
      <ellipse data-mouth="o" cx="120" cy="162" rx="5" ry="6.5" fill="${K}"/>
      <g class="bob-glasses" data-ox="120" data-oy="91"><g transform="rotate(-4 120 91)">
        <rect x="108" y="85" width="24" height="8" rx="3" fill="${W}" stroke="${K}" stroke-width="3"/>
        ${lens(74, 80, 40, 22)}${lens(126, 80, 40, 22)}
      </g></g>
    </g>`;

  function svg(opts = {}) {
    const full = !!opts.full;
    const vb = full ? '28 0 184 366' : '28 0 184 272';
    const oy = full ? 360 : 270;
    return `<svg class="bob${full ? ' bob-full' : ''}" viewBox="${vb}" overflow="visible" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bob">
<g class="bob-idle" data-ox="120" data-oy="${oy}"><g class="bob-root" data-ox="120" data-oy="${oy}">
  ${full ? BOARD + LEGS : ''}
  ${arm('bob-arm-l', 92, 196, 78, 252)}
  ${arm('bob-arm-r', 148, 196, 162, 252)}
  <path class="bob-hoodie" d="M84 178 Q120 168 156 178 L170 262 Q171 270 162 270 H78 Q69 270 70 262 Z" fill="${W}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M88 179 Q120 198 152 179" fill="none" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
  <path d="M111 192 L109 212 M129 192 L131 212" stroke="${K}" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="90" y1="184" x2="163" y2="262" stroke="${K}" stroke-width="9" stroke-linecap="round"/>
  ${full ? BAG : ''}
  ${HEAD}
</g></g></svg>`;
  }

  // Arm rotations (degrees) for common poses. Left arm positive = up/out, right arm negative.
  const POSE = { down: [0, 0], up: [126, -126], balance: [58, -58], hold: [14, -14] };

  function mount(container, opts = {}) {
    container.innerHTML = svg(opts);
    const el = container.querySelector('svg');
    const q = s => el.querySelector(s);
    const E = global.Engine;
    const bob = {
      el,
      idle: q('.bob-idle'), root: q('.bob-root'), head: q('.bob-head'), ear: q('.bob-ear'),
      glasses: q('.bob-glasses'), armL: q('.bob-arm-l'), armR: q('.bob-arm-r'),
      eyes: q('.bob-eyes-open'), cheeks: el.querySelectorAll('.bob-cheek'),
      board: q('.bob-board'), legs: q('.bob-legs'),
      curEyes: 'open', curMouth: 'smile',
      face(eyes = bob.curEyes, mouth = bob.curMouth) {
        bob.curEyes = eyes; bob.curMouth = mouth;
        el.querySelectorAll('[data-eyes]').forEach(g => { g.style.display = g.dataset.eyes === eyes ? '' : 'none'; });
        el.querySelectorAll('[data-mouth]').forEach(g => { g.style.display = g.dataset.mouth === mouth ? '' : 'none'; });
      },
      pose(name) { const [l, r] = POSE[name]; E.set(bob.armL, { r: l }); E.set(bob.armR, { r: r }); },
      async talk(syllables = 4) {
        for (let i = 0; i < syllables; i++) {
          bob.face(undefined, 'open'); await E.wait(110);
          bob.face(undefined, 'smile'); await E.wait(95);
        }
      },
      blinkLoop(period = 3.4) {
        return E.loop(t => {
          const p = (t + 1.4) % period;
          E.set(bob.eyes, { sy: p < 0.16 ? 1 - Math.sin((p / 0.16) * Math.PI) * 0.92 : 1 });
        });
      },
    };
    E.set(bob.cheeks, { o: 0 });
    bob.face('open', 'smile');
    return bob;
  }

  global.Bob = { svg, mount, POSE, colors: { O, K, W, P } };
})(window);
