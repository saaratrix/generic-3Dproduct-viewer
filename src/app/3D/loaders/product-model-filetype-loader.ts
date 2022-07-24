import type { MaterialInfo } from "../models/material-info";
import type { Object3D } from "three";

export interface ProductModelFiletypeLoader {
  load(file: string, materialInfo: MaterialInfo): Promise<Object3D>;
}
