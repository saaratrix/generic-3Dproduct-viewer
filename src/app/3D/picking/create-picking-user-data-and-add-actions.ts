import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';
import type { PickingAction } from './picking-action';
import type { PickingUserdata } from './picking-userdata';

/**
 * Creates or uses an existing picking user data object and adds the input actions.
 * If an existing picking object exists it will attempt to combine them.
 */
export function createPickingUserDataAndAddActions(objects: PolygonalObject3D[], actions: PickingAction[]): void {
  for (const action of actions!) {
    if (!action.objects) {
      action.objects = new Set<PolygonalObject3D>();
    }
    objects.forEach(o => action.objects!.add(o));
  }

  for (const object of objects) {
    const combinedActions = new Set((object.userData as PickingUserdata).pickingActions ?? []);
    actions.forEach(a => combinedActions.add(a));

    const userData: PickingUserdata = {
      pickingActions: Array.from(combinedActions),
      isPickable: true,
    };

    object.userData = {
      ...object.userData,
      ...userData,
    };
  }
}
