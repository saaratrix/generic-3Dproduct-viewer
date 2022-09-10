import type { InteractionAction } from '../../3D/interaction/interaction-action';

/**
 * List of object3Ds that can be interacted with and the actions that happens when interacted with.
 */
export interface InteractionGroup {
  /**
   * Optional, if set the object3D's name must be included in this array.
   */
  included?: string[];
  /**
   * Optional, If set the object3D will always be excluded.
   */
  excluded?: string[];

  /**
   * A list of data attached to the interaction object
   */
  actions?: InteractionAction[];
}
