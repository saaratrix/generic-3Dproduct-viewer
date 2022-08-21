import type { Texture, WebGLRenderer, WebGLRenderTarget } from 'three';
import type { Material, MeshPhongMaterial, MeshStandardMaterial } from 'three';

export function isRenderTarget(object: unknown): object is WebGLRenderer {
  return (object as WebGLRenderTarget).isWebGLRenderTarget;
}

export function isTexture(object: unknown): object is Texture {
  return (object as Texture).isTexture;
}

export function isMeshStandardMaterial(material: Material): material is MeshStandardMaterial {
  return material.type === 'MeshStandardMaterial';
}

export function isMeshPhongMaterial(material: Material): material is MeshPhongMaterial {
  return material.type === 'MeshPhongMaterial';
}
