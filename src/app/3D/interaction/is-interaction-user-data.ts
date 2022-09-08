import type { InteractionUserdata } from './interaction-userdata';

export function isInteractionUserData(userData: unknown): userData is InteractionUserdata {
  return !!(userData as InteractionUserdata).interactionActions;
}
