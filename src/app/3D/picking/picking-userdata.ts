import type { PickingAction } from './picking-action';

export interface PickingUserdata {
  pickingActions: PickingAction[];
  isPickable: boolean;
}
