/**
 * @param angle Angle in radians
 */
export function generateRainbowTexture(angle: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d")!;
  // If x or y is negative we get only red colour.
  const x1 = canvas.width * Math.abs(Math.cos(angle));
  const y1 = canvas.height * Math.abs(Math.sin(angle));

  const gradient = context.createLinearGradient(0, 0, x1, y1);
  gradient.addColorStop(0, "rgb(255, 0, 0, 1)");
  gradient.addColorStop(0.1, "rgb(255, 154, 0, 1)");
  gradient.addColorStop(0.2, "rgb(208, 222, 33, 1)");
  gradient.addColorStop(0.3, "rgb(79, 220, 74, 1)");
  gradient.addColorStop(0.4, "rgb(63, 218, 216, 1)");
  gradient.addColorStop(0.5, "rgb(47, 201, 226, 1)");
  gradient.addColorStop(0.6, "rgb(28, 127, 238, 1)");
  gradient.addColorStop(0.7, "rgb(95, 21, 242, 1)");
  gradient.addColorStop(0.8, "rgb(186, 12, 248, 1)");
  gradient.addColorStop(0.9, "rgb(251, 7, 217, 1)");
  gradient.addColorStop(1, "rgb(255, 0, 0, 1)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}
