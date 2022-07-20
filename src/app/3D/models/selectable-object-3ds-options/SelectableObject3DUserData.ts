import type { SelectedOptions } from "./SelectedOptions";
import type { PolygonalObject3D } from "../../3rd-party/three/polygonal-object-3D";

export interface SelectableObject3DUserData {
  selectableObjectsOption: SelectedOptions;
  /**
   * Related Object3Ds
   */
  related?: PolygonalObject3D[];
}
