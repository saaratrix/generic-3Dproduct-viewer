import type { Mesh } from "three";
import type { SelectedOptions } from "./SelectedOptions";

export interface SelectableObject3DUserData {
  selectableMeshesOption: SelectedOptions;
  siblings?: Mesh[];
}
