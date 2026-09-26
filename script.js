const menuBtn = document.querySelector('#menuBtn');
const nav = document.querySelector('#nav');
const navLinks = document.querySelectorAll('#nav a');

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
  const isOpen = nav.classList.contains('active');
  menuBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

// Position the background pulse lines directly on top of the real grid
// branches. Instead of approximating a pixel position and hoping it lands
// on a grid line, this only ever picks from the actual list of valid grid
// columns (x = 70, 210, 350, ...) and rows (y = 0, 140, 280, ...) that
// exist on the current screen — so a trace can never miss the grid it's
// supposed to follow.
function layoutPulses() {
  const TILE = 140;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const localH = h + TILE; // matches .bg-pulses: top:-140px, height:calc(100% + 140px)

  function validPositions(max, offset) {
    const arr = [];
    for (let v = offset; v <= max - 40; v += TILE) arr.push(v);
    return arr.length ? arr : [offset];
  }

  function pickFraction(arr, frac) {
    const idx = Math.round((arr.length - 1) * frac);
    return arr[Math.max(0, Math.min(arr.length - 1, idx))];
  }

  const cols = validPositions(w, 70);      // valid branch columns
  const rows = validPositions(localH, 0);  // valid branch rows (tile tops)

  const colX = {
    left: pickFraction(cols, 0.08),
    center: pickFraction(cols, 0.5),
    right: pickFraction(cols, 0.92),
  };
  const rowY = {
    top: pickFraction(rows, 0.12),
    middle: pickFraction(rows, 0.5),
    bottom: pickFraction(rows, 0.85),
  };

  function leftBranch(x, y) {
    return `M${x} ${y} V${y + 45} L${x - 32} ${y + 90} V${y + 140}`;
  }
  function rightBranch(x, y) {
    return `M${x} ${y} V${y + 45} L${x + 32} ${y + 90} V${y + 140}`;
  }

  const placements = [
    ['pulse-tl', colX.left,   rowY.top,    leftBranch],
    ['pulse-tc', colX.center, rowY.top,    rightBranch],
    ['pulse-tr', colX.right,  rowY.top,    leftBranch],
    ['pulse-ml', colX.left,   rowY.middle, rightBranch],
    ['pulse-mc', colX.center, rowY.middle, leftBranch],
    ['pulse-mr', colX.right,  rowY.middle, rightBranch],
    ['pulse-bl', colX.left,   rowY.bottom, leftBranch],
    ['pulse-bc', colX.center, rowY.bottom, rightBranch],
    ['pulse-br', colX.right,  rowY.bottom, leftBranch],
  ];

  placements.forEach(([id, x, y, branchFn]) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('d', branchFn(x, y));
  });
}

layoutPulses();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(layoutPulses, 150);
});