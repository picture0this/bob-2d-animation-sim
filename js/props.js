/* Scene props drawn in the same flat, thick-outline style: starburst, bolt, gift box, controller. */
(function (global) {
  const K = '#141414', Y = '#FBBF16', P = '#E8308A', W = '#FFFFFF', B = '#74A7DB';

  function starburst() {
    const outer = [165, 132, 160, 140, 168, 130, 158, 142];
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 4 + 0.12;
      pts.push([170 + Math.cos(a) * outer[i], 170 + Math.sin(a) * outer[i]]);
      const b = a + Math.PI / 8;
      pts.push([170 + Math.cos(b) * 64, 170 + Math.sin(b) * 64]);
    }
    const p = pts.map(xy => xy.map(v => v.toFixed(1)).join(',')).join(' ');
    return `<svg viewBox="0 0 340 340" overflow="visible"><polygon points="${p}" fill="${Y}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></svg>`;
  }

  function bolt() {
    return `<svg viewBox="0 0 60 100" overflow="visible"><path d="M38 2 L8 54 H28 L16 98 L54 38 H33 L46 2 Z" fill="${P}" stroke="${K}" stroke-width="4.5" stroke-linejoin="round"/></svg>`;
  }

  function gift() {
    return `<svg viewBox="0 0 140 130" overflow="visible">
      <g class="gift-base">
        <rect x="18" y="52" width="104" height="72" rx="6" fill="${P}" stroke="${K}" stroke-width="5"/>
        <rect x="60" y="52" width="20" height="72" fill="${Y}" stroke="${K}" stroke-width="4"/>
      </g>
      <g class="gift-lid" data-ox="70" data-oy="46">
        <path d="M70 34 C52 4 28 18 66 34 Z" fill="${Y}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M70 34 C88 4 112 18 74 34 Z" fill="${Y}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
        <rect x="10" y="34" width="120" height="24" rx="6" fill="${P}" stroke="${K}" stroke-width="5"/>
        <rect x="59" y="34" width="22" height="24" fill="${Y}" stroke="${K}" stroke-width="4"/>
        <circle cx="70" cy="33" r="6.5" fill="${Y}" stroke="${K}" stroke-width="4"/>
      </g>
    </svg>`;
  }

  // Generic PlayStation-style gamepad: white wings, black core, touchpad, sticks, face buttons.
  function controller() {
    return `<svg viewBox="-6 -6 212 142" overflow="visible">
      <path d="M42 18 Q100 4 158 18 Q188 24 196 66 Q202 112 180 122 Q162 130 148 106 Q138 90 120 90 H80 Q62 90 52 106 Q38 130 20 122 Q-2 112 4 66 Q12 24 42 18 Z" fill="${W}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M30 104 Q24 118 16 116 M170 104 Q176 118 184 116" fill="none" stroke="#D9D9D9" stroke-width="5" stroke-linecap="round"/>
      <path d="M58 54 Q100 62 142 54 L148 88 Q140 90 120 90 H80 Q60 90 52 88 Z" fill="${K}"/>
      <path d="M64 16 Q100 9 136 16 L131 52 Q100 57 69 52 Z" fill="#F4F4F4" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M61 19 L66 54 M139 19 L134 54" stroke="${B}" stroke-width="3" stroke-linecap="round"/>
      <rect x="36" y="42" width="12" height="28" rx="3" fill="${K}"/>
      <rect x="28" y="50" width="28" height="12" rx="3" fill="${K}"/>
      <circle cx="78" cy="75" r="12" fill="#3a3a3a" stroke="${K}" stroke-width="3"/><circle cx="78" cy="75" r="6.5" fill="#555"/>
      <circle cx="122" cy="75" r="12" fill="#3a3a3a" stroke="${K}" stroke-width="3"/><circle cx="122" cy="75" r="6.5" fill="#555"/>
      <circle cx="100" cy="72" r="4" fill="#cfcfcf"/>
      <g stroke="${K}" stroke-width="3" fill="${W}">
        <circle cx="158" cy="42" r="7"/><circle cx="172" cy="56" r="7"/><circle cx="158" cy="70" r="7"/><circle cx="144" cy="56" r="7"/>
      </g>
      <g fill="none" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round">
        <path d="M158 38.6 L161.4 44.6 H154.6 Z" stroke="#1FA99A"/>
        <circle cx="172" cy="56" r="3.2" stroke="${P}"/>
        <path d="M155.6 67.6 L160.4 72.4 M160.4 67.6 L155.6 72.4" stroke="#4F86C6"/>
        <rect x="141" y="53" width="6" height="6" stroke="#B05BD6"/>
      </g>
    </svg>`;
  }

  global.Props = { starburst, bolt, gift, controller };
})(window);
