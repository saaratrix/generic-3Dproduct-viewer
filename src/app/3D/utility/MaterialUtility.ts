import { Color, Material, Mesh, MeshPhongMaterial, MeshStandardMaterial } from "three";

export function isMeshStandardMaterial(material: Material): material is MeshStandardMaterial {
  return material.type === "MeshStandardMaterial";
}

export function isMeshPhongMaterial(material: Material): material is MeshPhongMaterial {
  return material.type === "MeshPhongMaterial";
}

export function getMaterials(mesh: Mesh): Material[] {
  if (Array.isArray(mesh.material)) {
    return mesh.material;
  }
  return [mesh.material];
}

export function setMaterialParameters(mesh: Mesh, parameters: Record<string, any>): void {
  const materials = getMaterials(mesh);
  const keys = Object.keys(parameters);
  for (const material of materials) {
    for (const key of keys) {
       const parameter = parameters[key];
       material[key] = parameter;
    }
  }
}
