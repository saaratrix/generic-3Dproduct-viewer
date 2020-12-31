import { SelectableOptionsType } from "./SelectableOptionsType";

export interface SelectableOptions {
  type: SelectableOptionsType;
  /**
   * Names of the meshes that are selectable, will be converted to a boolean on the mesh's userdata.
   * If SelectableOptionsType.All is used this list is not necessary.
   */
  meshes?: string[];
  excludeMeshes?: string[];      // Used if "SelectableOptionsType.All" is used in case a mesh should be excluded.
}
