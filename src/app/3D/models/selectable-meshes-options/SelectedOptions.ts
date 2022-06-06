import { SelectedOptionsType } from "./SelectedOptionsType";
import { SelectedSpecificColorsValue } from "./SelectedSpecificColorsValue";
import { SelectedSpecificTexturesValue } from "./SelectedSpecificTexturesValue";

export interface SelectedOptions {
  type: SelectedOptionsType;
  value?: SelectedSpecificColorsValue | SelectedSpecificTexturesValue;
}
