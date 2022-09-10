import type { PickingAction } from '../../3D/picking/picking-action';

/**
 * List of object3Ds that can be picked and the actions that happens when picked.
 */
export interface PickingSetupItem {
  /**
   * Optional, if set the object3D's name must be included in this array.
   */
  included?: string[];
  /**
   * Optional, If set the object3D will always be excluded.
   */
  excluded?: string[];

  actions?: PickingAction[];
}
