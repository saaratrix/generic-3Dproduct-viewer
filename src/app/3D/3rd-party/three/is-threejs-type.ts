import type { Object3D, Mesh } from "three";
import type { Texture, WebGLRenderer, WebGLRenderTarget } from "three";

export function isMesh(object: Object3D): object is Mesh {
  return (object as Mesh).isMesh;
}

export function isRenderTarget(object: unknown): object is WebGLRenderer {
  return (object as WebGLRenderTarget).isWebGLRenderTarget;
}

export function isTexture(object: unknown): object is Texture {
  return (object as Texture).isTexture;
}
