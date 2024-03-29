import type { Material } from 'three';
import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';

export type MaterialParameters = 'color';

export function getMaterialsFromObject(object: PolygonalObject3D): Material[] {
  if (Array.isArray(object.material)) {
    return object.material;
  }
  return [object.material];
}

export function getMaterialsFromObjects(objects: PolygonalObject3D[]): Material[] {
  const result: Material[] = [];
  for (const object of objects) {
    result.push(...getMaterialsFromObject(object));
  }
  return result;
}

export function setMaterialParameters(object: PolygonalObject3D, parameters: Record<MaterialParameters, unknown>): void {
  const materials = getMaterialsFromObject(object);
  const keys = Object.keys(parameters) as MaterialParameters[];
  for (const material of materials) {
    for (const key of keys) {
      const value = parameters[key];

      if (key in material) {
        material[key] = value;
      }
    }
  }
}
