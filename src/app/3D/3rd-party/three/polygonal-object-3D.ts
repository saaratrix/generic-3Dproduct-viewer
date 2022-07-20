import type { BufferGeometry, Material, Object3D } from "three";

/**
 * An Object3D type that has a geomtry property and a material property.
 * The three.js objects that have geometry and a material are (in at least r141):
 * InstancedMesh,
 * Line,
 * LineSegments,
 * Mesh,
 * Points,
 * SkinnedMesh,
 * Sprite
 */
export interface PolygonalObject3D extends Object3D {
  geometry: BufferGeometry;
  material: Material | Material[];
}
