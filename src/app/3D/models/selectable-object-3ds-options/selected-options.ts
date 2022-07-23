import type { SelectedOptionsType } from "./selected-options-type";
import type { SelectedSpecificColorsValue } from "./selected-specific-colors-value";
import type { SelectedSpecificTexturesValue } from "./selected-specific-textures-value";

export interface SelectedOptions {
  type: SelectedOptionsType;
  value?: SelectedSpecificColorsValue | SelectedSpecificTexturesValue;
}
