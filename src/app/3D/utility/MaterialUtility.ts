import type { Material, MeshPhongMaterial, MeshStandardMaterial } from "three";
import type { ColorMaterial } from "../3rd-party/three/color-material";
import type { PolygonalObject3D } from "../3rd-party/three/polygonal-object-3D";

export function isColorMaterial(material: Material): material is ColorMaterial {
  const colorMaterial = material as ColorMaterial;
  return !!colorMaterial.color;
}

export function isMeshStandardMaterial(material: Material): material is MeshStandardMaterial {
  return material.type === "MeshStandardMaterial";
}

export function isMeshPhongMaterial(material: Material): material is MeshPhongMaterial {
  return material.type === "MeshPhongMaterial";
}

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

export function setMaterialParameters(object: PolygonalObject3D, parameters: Record<string, unknown>): void {
  const materials = getMaterialsFromObject(object);
  const keys = Object.keys(parameters);
  for (const material of materials) {
    for (const key of keys) {
      const parameter = parameters[key];
      material[key] = parameter;
    }
  }
}
