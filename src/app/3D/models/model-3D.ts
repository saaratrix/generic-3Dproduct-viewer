import type { MaterialInfo } from './material-info';
import type { Euler, Vector3 } from 'three';

export interface Model3D {
  path: string;
  materialInfo: MaterialInfo;
  position?: Vector3 | null;
  // Rotation in euler angles in radians
  rotation?: Euler | null;
  scale?: Vector3 | null;
}
