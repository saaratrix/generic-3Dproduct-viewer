import type { SelectedOptions } from './selected-options';

export interface SelectableObject3DsOption {
  /**
   * Used for SelectableOptionsType.Specific
   */
  includedObjects?: string[];
  /**
   * Used if "SelectableOptionsType.All" is used in case an object3D should be excluded.
   */
  excludeObjects?: string[];
  noRelatedObjects?: boolean;

  options: SelectedOptions;
}
