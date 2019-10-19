import { MaterialInfo } from "./MaterialInfo";
import { Euler, Vector3 } from "three";

export interface Model3D {
  filename: string;
  materialInfo: MaterialInfo;
  position?: Vector3 | null;
  // Rotation in euler angles in radians
  rotation?: Euler | null;
  scale?: Vector3 | null;
}
