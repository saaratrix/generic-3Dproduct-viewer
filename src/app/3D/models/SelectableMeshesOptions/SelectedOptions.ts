import { SelectedOptionsType } from "./SelectedOptionsType";

export interface SelectedOptions<T = any> {
    type: SelectedOptionsType;
    value?: T;
}
