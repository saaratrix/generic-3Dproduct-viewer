import { Mesh } from "three";
import { SelectedOptions } from "./SelectedOptions";

export interface SelectableObject3DUserData {
  selectableMeshesOption: SelectedOptions;
  siblings?: Mesh[];
}
