/**
 * @param angle Angle in radians
 */
import { generateGradientTexture } from "./generate-gradient-texture";

export function generateRainbowTexture(angle: number): HTMLCanvasElement {
  return generateGradientTexture({
    width: 1024,
    height: 1024,
    angle,
    steps: [
      { offset: 0, color: "rgb(255, 0, 0, 1)" },
      { offset: 0.1, color: "rgb(255, 154, 0, 1)" },
      { offset: 0.2, color: "rgb(208, 222, 33, 1)" },
      { offset: 0.3, color: "rgb(79, 220, 74, 1)" },
      { offset: 0.4, color: "rgb(63, 218, 216, 1)" },
      { offset: 0.5, color: "rgb(47, 201, 226, 1)" },
      { offset: 0.6, color: "rgb(28, 127, 238, 1)" },
      { offset: 0.7, color: "rgb(95, 21, 242, 1)" },
      { offset: 0.8, color: "rgb(186, 12, 248, 1)" },
      { offset: 0.9, color: "rgb(251, 7, 217, 1)" },
      { offset: 1, color: "rgb(255, 0, 0, 1)" },
    ],
  });
}
