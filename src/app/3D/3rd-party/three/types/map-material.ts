import type { Material, Texture } from 'three';

/**
 * A three.js material that has the color property!
 */
export interface MapMaterial extends Material {
  map: Texture;
}
