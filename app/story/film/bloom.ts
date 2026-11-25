/** Mask resolution; enlarged by the canvas, which is what feathers its edge. */
const W = 96;
const H = 96;
/** Softness of the edge, as a share of the spread. */
const EDGE = 0.16;

const smooth = (x: number) => x * x * (3 - 2 * x);

/** Two octaves of value noise, 0..1. */
function noise(x: number, y: number) {
  const hash = (i: number, j: number) => {
    const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const octave = (u: number, v: number) => {
    const i = Math.floor(u);
    const j = Math.floor(v);
    const a = smooth(u - i);
    const b = smooth(v - j);
    const top = hash(i, j) * (1 - a) + hash(i + 1, j) * a;
    const bottom = hash(i, j + 1) * (1 - a) + hash(i + 1, j + 1) * a;
    return top * (1 - b) + bottom * b;
  };
  return octave(x * 5, y * 5) * 0.65 + octave(x * 13, y * 13) * 0.35;
}

/** When the colour reaches each cell, 0..1: it spreads from where the sticky note fell, lower right. */
function arrivals() {
  const field = new Float32Array(W * H);
  let low = Infinity;
  let high = -Infinity;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const u = x / W;
      const v = y / H;
      const at = Math.hypot(u - 0.78, v - 0.74) + noise(u, v) * 0.34;
      field[y * W + x] = at;
      low = Math.min(low, at);
      high = Math.max(high, at);
    }
  return field.map((at) => (at - low) / (high - low));
}

/** Paints `src` onto the canvas as far as the colour has spread. */
export function createBloom(canvas: HTMLCanvasElement, src: string) {
  const context = canvas.getContext("2d");
  const mask = document.createElement("canvas");
  mask.width = W;
  mask.height = H;
  const maskContext = mask.getContext("2d");
  const image = new Image();
  let progress = 0;
  let drawn = -1;
  let field: Float32Array | null = null;
  let pixels: ImageData | null = null;

  const draw = () => {
    if (!context || !maskContext || !image.naturalWidth || drawn === progress) return;
    drawn = progress;
    if (canvas.width !== image.naturalWidth) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (progress === 0) return;
    if (progress < 1) {
      field ??= arrivals();
      pixels ??= maskContext.createImageData(W, H);
      const front = progress * (1 + EDGE);
      for (let i = 0; i < field.length; i++) {
        const x = Math.min(1, Math.max(0, (front - field[i]) / EDGE));
        pixels.data[i * 4 + 3] = smooth(x) * 255;
      }
      maskContext.putImageData(pixels, 0, 0);
      context.globalCompositeOperation = "copy";
      context.imageSmoothingQuality = "high";
      context.drawImage(mask, 0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = "source-in";
    }
    context.drawImage(image, 0, 0);
    context.globalCompositeOperation = "source-over";
  };
  image.onload = draw;
  image.src = src;

  return (value: number) => {
    // The edge is soft enough that 120 steps look continuous.
    progress = Math.round(Math.min(1, Math.max(0, value)) * 120) / 120;
    draw();
  };
}
