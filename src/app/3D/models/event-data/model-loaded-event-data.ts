import type { Object3D } from 'three';
import type { Model3D } from '../model-3D';

export interface ModelLoadedEventData {
  object: Object3D | undefined;
  model: Model3D;
}
