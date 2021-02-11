import { Material, Mesh, MeshPhongMaterial, MeshStandardMaterial } from "three";
import { ColorMaterial } from "../3rd-party/three/ColorMaterial";

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

export function getMaterialsFromMesh(mesh: Mesh): Material[] {
  if (Array.isArray(mesh.material)) {
    return mesh.material;
  }
  return [mesh.material];
}

export function getMaterialsFromMeshes(meshes: Mesh[]): Material[] {
  const result: Material[] = [];
  for (const mesh of meshes) {
    result.push(...getMaterialsFromMesh(mesh));
  }
  return result;
}

export function setMaterialParameters(mesh: Mesh, parameters: Record<string, any>): void {
  const materials = getMaterialsFromMesh(mesh);
  const keys = Object.keys(parameters);
  for (const material of materials) {
    for (const key of keys) {
       const parameter = parameters[key];
       material[key] = parameter;
    }
  }
}
