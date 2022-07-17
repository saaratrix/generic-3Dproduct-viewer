import type { SelectedOptionsType } from "./SelectedOptionsType";
import type { SelectedSpecificColorsValue } from "./SelectedSpecificColorsValue";
import type { SelectedSpecificTexturesValue } from "./SelectedSpecificTexturesValue";

export interface SelectedOptions {
  type: SelectedOptionsType;
  value?: SelectedSpecificColorsValue | SelectedSpecificTexturesValue;
}
