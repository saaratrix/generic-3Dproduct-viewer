import type { PickingUserdata } from './picking-userdata';

export function isPickingUserData(userData: unknown): userData is PickingUserdata {
  return !!(userData as PickingUserdata).pickingActions;
}
