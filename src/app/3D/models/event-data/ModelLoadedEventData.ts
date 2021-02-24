import { Object3D } from "three";
import { Model3D } from "../Model3D";

export interface ModelLoadedEventData {
  object: Object3D | undefined;
  model: Model3D;
}
