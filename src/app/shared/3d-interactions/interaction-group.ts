/**
 * List of object3Ds that can be interacted with and the actions that happens when interacted with.
 */
import type { InteractionAction } from '../../3D/interaction/interaction-action';

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
   * If true then the meshes will be treated as one object for outlining
   */
  groupTogether?: boolean;

  /**
   * A list of data attached to the interaction object
   */
  actions?: InteractionAction[];
}
