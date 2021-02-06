import { Material, MeshPhongMaterial, MeshStandardMaterial } from "three";

export function isMeshStandardMaterial(material: Material): material is MeshStandardMaterial {
  return material.type === "MeshStandardMaterial";
}

export function isMeshPhongMaterial(material: Material): material is MeshPhongMaterial {
  return material.type === "MeshPhongMaterial";
}
