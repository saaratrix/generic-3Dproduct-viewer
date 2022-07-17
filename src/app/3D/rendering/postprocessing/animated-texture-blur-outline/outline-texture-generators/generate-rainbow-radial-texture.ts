import type { GradientStop } from "./gradient-options";
import { generateRadialGradientTexture } from "./generate-radial-gradient-texture";

/**
 * Generate a radial rainbow texture with an offset as the starting position.
 * @param offset
 */
export function generateRainbowRadialTexture(offset: number): HTMLCanvasElement {
  offset = (offset % 1);

  const colors = [
    { start: (0.0 + offset) % 1, end: 0.1 + offset, color: "rgb(255, 0, 0, 1)" },
    { start: (0.1 + offset) % 1, end: 0.2 + offset, color: "rgb(255, 154, 0, 1)" },
    { start: (0.2 + offset) % 1, end: 0.3 + offset, color: "rgb(208, 222, 33, 1)" },
    { start: (0.3 + offset) % 1, end: 0.4 + offset, color: "rgb(79, 220, 74, 1)" },
    { start: (0.4 + offset) % 1, end: 0.5 + offset, color: "rgb(63, 218, 216, 1)" },
    { start: (0.5 + offset) % 1, end: 0.6 + offset, color: "rgb(47, 201, 226, 1)" },
    { start: (0.6 + offset) % 1, end: 0.7 + offset, color: "rgb(28, 127, 238, 1)" },
    { start: (0.7 + offset) % 1, end: 0.8 + offset, color: "rgb(95, 21, 242, 1)" },
    { start: (0.8 + offset) % 1, end: 0.9 + offset, color: "rgb(186, 12, 248, 1)" },
    { start: (0.9 + offset) % 1, end: 1.0 + offset, color: "rgb(251, 7, 217, 1)" },
  ];

  colors.sort((a, z) => {
    if (a.end > 1 && z.end <= 1) {
      return -1;
    }

    return a.end - z.end;
  });

  const steps: GradientStop[] = [];
  for (let i = 0; i < colors.length; i++) {
    const current = colors[i];
    const offset = i === 0 ? 0 : current.start;

    steps.push({
      color: current.color,
      offset: offset,
    });
  }

  // This is commented out because the logic isn't flawless, it just pushes out the colour instantly in a noticeable pop.
  // But we can't see the last ring, so we just don't show it.
  // Add last color if last step isn't already added.
  // if (Math.abs(steps[steps.length - 1].offset - 1) > Number.EPSILON) {
  //   steps.push({
  //     color: colors[0].color,
  //     offset: 1,
  //   });
  // }

  return generateRadialGradientTexture({
    width: window.innerWidth,
    height: window.innerHeight,
    steps,
  });
}
