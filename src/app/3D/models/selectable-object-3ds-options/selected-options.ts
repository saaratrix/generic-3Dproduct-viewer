import type { SelectedOptionsType } from './selected-options-type';
import type { SelectedSpecificColorsValue } from './selected-specific-colors-value';
import type { SelectedSpecificTexturesValue } from './selected-specific-textures-value';

export type SelectedOptionsValue = SelectedSpecificColorsValue | SelectedSpecificTexturesValue;

export interface SelectedOptions<T extends SelectedOptionsValue | unknown = unknown> {
  type: SelectedOptionsType;
  value?: T;
}
