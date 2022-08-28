import type { InteractionAction } from './interaction-action';

export interface InteractionUserdata {
  interactionActions: InteractionAction[];
  isPickable: boolean;
  /**
   * If the meshes inside InteractionAction[] should be outlined as well.
   */
  outlineRelated: boolean;
}
