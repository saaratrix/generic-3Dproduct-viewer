import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';
import type { InteractionAction } from './interaction-action';
import type { InteractionUserdata } from './interaction-userdata';

export function addActionsToObjects(objects: PolygonalObject3D[], actions: InteractionAction[]): void {
  for (const action of actions!) {
    if (!action.objects) {
      action.objects = new Set<PolygonalObject3D>();
    }
    objects.forEach(o => action.objects?.add(o));
  }

  for (const object of objects) {
    const combinedActions = new Set((object.userData as InteractionUserdata).interactionActions ?? []);
    actions.forEach(a => combinedActions.add(a));

    const userData: InteractionUserdata = {
      interactionActions: Array.from(combinedActions),
      isPickable: true,
    };

    object.userData = {
      ...object.userData,
      ...userData,
    };
  }
}
