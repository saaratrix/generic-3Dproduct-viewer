import type { GradientOptions } from './gradient-options';

export function generateRadialGradientTexture(options: GradientOptions): HTMLCanvasElement {
  const width = options.width;
  const height = options.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  // We use the hypotenuse for width, height, so we don't distort the radial texture.
  const diameter = Math.hypot(width, height);

  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, diameter);

  for (const step of options.steps) {
    const offset = Math.min(step.offset, 1);
    gradient.addColorStop(offset, step.color);
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  return canvas;
}
