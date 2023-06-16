import type { Material, Texture } from 'three';

export interface MapMaterial extends Material {
  map: Texture;
}
