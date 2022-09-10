import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';
import type { Object3D } from 'three';
import { isPickingUserData } from './is-picking-user-data';
import type { PickingActionTypes } from './picking-action-types';

/**
 * Gets all related objects by checking all the grouped picking actions.
 * Does not include itself in the result.
 * @param type Used to get related objects of a certain type.
 */
export function getRelatedObjects(object: Object3D, type?: PickingActionTypes): PolygonalObject3D[] {
  if (!isPickingUserData(object.userData)) {
    return [];
  }

  const groupActions = object.userData.pickingActions.filter(a => {
    if (!a.groupObjectsTogether) {
      return false;
    }

    if (type && a.type !== type) {
      return false;
    }

    return true;
  });
  if (groupActions.length === 0) {
    return [];
  }

  const flattenedObjects = groupActions.flatMap(a => a.objects ?? new Set<PolygonalObject3D>());
  const objects = new Set(...flattenedObjects);
  objects.delete(object as PolygonalObject3D);
  return Array.from(objects);
}
