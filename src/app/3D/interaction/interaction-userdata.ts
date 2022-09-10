import type { InteractionAction } from './interaction-action';

export interface InteractionUserdata {
  interactionActions: InteractionAction[];
  isPickable: boolean;
}
