import type { Color, Material } from "three";

/**
 * A three.js material that has the color property!
 */
export interface ColorMaterial extends Material {
  color: Color;
}
