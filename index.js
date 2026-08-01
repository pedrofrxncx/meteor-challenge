// DOM element references
const image = document.getElementById('myImage');
const scanline = document.getElementById('scanline');

// Sprinkle CSS starfield (tiny random dots, no extra DOM weight beyond this)
(function spawnStars() {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden';
  el.innerHTML = Array.from({ length: 70 }, () => {
    const s = Math.random() > 0.88 ? 2 : 1;
    const op = 0.15 + Math.random() * 0.55;
    const dur = (2 + Math.random() * 4).toFixed(1);
    const del = (Math.random() * 4).toFixed(1);
    return `<div style="position:absolute;left:${(Math.random()*100).toFixed(2)}%;top:${(Math.random()*100).toFixed(2)}%;width:${s}px;height:${s}px;border-radius:50%;background:#fff;opacity:${op.toFixed(2)};animation:tw ${dur}s ${del}s ease-in-out infinite alternate"></div>`;
  }).join('');
  document.body.prepend(el);
})();

function runAnalysis() {
  // Trigger visual scanning animation
  scanline.classList.add('running');

  // Prepare canvas for pixel-level image analysis
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const w = canvas.width, h = canvas.height;

  // Pass 1: count stars (white), meteors (red), meteors above water (blue below)
  let stars = 0, meteors = 0, waterBound = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a !== 255) continue;

    if (r === 255 && g === 255 && b === 255) { stars++; continue; }

    if (r === 255 && g === 0 && b === 0) {
      meteors++;
      const px = (i / 4) | 0;
      const x = px % w, y = (px / w) | 0;
      // scan downward from this pixel for a blue water pixel
      for (let row = y; row < h; row++) {
        const j = (row * w + x) * 4;
        if (data[j] === 0 && data[j+1] === 0 && data[j+2] === 255 && data[j+3] === 255) {
          waterBound++;
          break;
        }
      }
    }
  }

  // Pass 2: column counts → binary strings → hidden message
  const redCol   = new Int16Array(w);
  const whiteCol = new Int16Array(w);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const j = (y * w + x) * 4;
      const r = data[j], g = data[j+1], b = data[j+2], a = data[j+3];
      if (a !== 255) continue;
      if (r === 255 && g === 0   && b === 0  ) redCol[x]++;
      if (r === 255 && g === 255 && b === 255) whiteCol[x]++;
    }
  }

  // Decode binary string to readable text
  const decodeBin = str =>
    (str.match(/.{8}/g) ?? [])
      .map(c => String.fromCharCode(parseInt(c, 2)))
      .join('');

  const message =
    decodeBin(Array.from(whiteCol).join('')) +
    decodeBin(Array.from(redCol).join(''));

  scanline.classList.remove('running');
  render(stars, meteors, waterBound, message);
}

function render(stars, meteors, water, message) {
  // Update stat cards with analysis results
  document.getElementById('n-stars').textContent   = stars;
  document.getElementById('n-meteors').textContent = meteors;
  document.getElementById('n-water').textContent   = water;

  document.querySelectorAll('.card').forEach((el, i) =>
    setTimeout(() => el.classList.add('show'), i * 120)
  );

  const tx   = document.getElementById('transmission');
  const body = document.getElementById('tx-body');
  tx.classList.add('show');

  // Typing effect for hidden message
  const cursor = Object.assign(document.createElement('span'), { className: 'cursor' });
  body.appendChild(cursor);
  let i = 0;
  const type = () => {
    if (i < message.length) { 
      cursor.before(message[i++]); 
      setTimeout(type, 20); 
    }
  };
  setTimeout(type, 600);
}

image.addEventListener('load', runAnalysis);
if (image.complete && image.naturalWidth) runAnalysis();
