import type { Object3D } from "three";
import type { Texture, WebGLRenderer, WebGLRenderTarget } from "three";
import type { PolygonalObject3D } from "./polygonal-object-3D";

export function isPolygonalObject3D(object: Object3D): object is PolygonalObject3D {
  return !!(object as PolygonalObject3D).geometry;
}

export function isRenderTarget(object: unknown): object is WebGLRenderer {
  return (object as WebGLRenderTarget).isWebGLRenderTarget;
}

export function isTexture(object: unknown): object is Texture {
  return (object as Texture).isTexture;
}
