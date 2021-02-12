import { SelectedOptionsType } from "./SelectedOptionsType";
import { SelectedSpecificColorsValue } from "./SelectedSpecificColorsValue";

export interface SelectedOptions {
    type: SelectedOptionsType;
    value?: SelectedSpecificColorsValue | any;
}
