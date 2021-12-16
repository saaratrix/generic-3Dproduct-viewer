import type { Object3D, Mesh } from "three";

export function isMesh(object: Object3D): object is Mesh {
  return (object as Mesh).isMesh;
}
