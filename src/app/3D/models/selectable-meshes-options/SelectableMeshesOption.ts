import { SelectedOptions } from "./SelectedOptions";

export interface SelectableMeshesOption {
  /**
   * Used for SelectableOptionsType.Specific
   */
  includedMeshes?: string[];
  excludeMeshes?: string[];      // Used if "SelectableOptionsType.All" is used in case a mesh should be excluded.
  noSiblings?: boolean;

  options: SelectedOptions;
}
