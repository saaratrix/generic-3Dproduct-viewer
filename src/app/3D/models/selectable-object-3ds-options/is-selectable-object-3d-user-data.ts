import { SelectableObject3DUserData } from "./selectable-object-3D-user-data";

export function isSelectableObject3dUserData(userData: unknown): userData is SelectableObject3DUserData {
  return !!(userData as SelectableObject3DUserData).selectableObjectsOption;
}
