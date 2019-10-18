import { MaterialInfo } from "./MaterialInfo";
import { Quaternion, Vector3 } from "three";

export interface Model3D {
  filename: string;
  materialInfo: MaterialInfo;
  position?: Vector3 | null;
  rotation?: Quaternion | null;
  scale?: Vector3 | null;
}
