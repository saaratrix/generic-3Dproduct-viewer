export interface GradientOptions {
  width: number,
  height: number,
  /**
   * Angle in radians.
   */
  angle?: number;
  steps: GradientStop[];
}

export interface GradientStop {
  offset: number,
  color: string,
}

export function generateGradientTexture(options: GradientOptions): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  const width = options.width;
  const height = options.height;

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d")!;

  // Idea for rotation math: https://www.reddit.com/r/gamedev/comments/n2xs41/calculate_degrees_of_linear_gradient_in_canvas/gwnjh3a/
  // Which is based on this: https://patrickbrosset.medium.com/do-you-really-understand-css-linear-gradients-631d9a895caf
  // We add 180 degrees because CSS gradients offset 0 is at the bottom and 1 is at the top.
  const angle = Math.PI - (options.angle ?? 0);
  // Since gradient starts at the bottom we will use X = sin and Y = cos.
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const halfLength = (Math.abs(width * sin) + Math.abs(height * cos)) / 2;

  const halfX = sin * halfLength;
  const halfY = cos * halfLength;

  const centerX = width / 2;
  const centerY = height / 2;

  const x1 = centerX - halfX;
  const y1 = centerY - halfY;
  const x2 = centerX + halfX;
  const y2 = centerY + halfY;

  const gradient = context.createLinearGradient(x1, y1, x2, y2);
  for (const step of options.steps) {
    gradient.addColorStop(step.offset, step.color);
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  return canvas;
}
