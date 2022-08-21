import type { Material, Object3D } from 'three';
import type { PolygonalObject3D } from './polygonal-object-3D';
import type { ColorMaterial } from './color-material';

export function isPolygonalObject3D(object: Object3D): object is PolygonalObject3D {
  return !!(object as PolygonalObject3D).geometry;
}

export function isColorMaterial(material: Material): material is ColorMaterial {
  const colorMaterial = material as ColorMaterial;
  return !!colorMaterial.color;
}
