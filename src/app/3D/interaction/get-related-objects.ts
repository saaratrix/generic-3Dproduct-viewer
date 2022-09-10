import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';
import type { Object3D } from 'three';
import { isInteractionUserData } from './is-interaction-user-data';

export function getRelatedObjects(object: Object3D): PolygonalObject3D[] {
  if (!isInteractionUserData(object.userData)) {
    return [];
  }

  const groupActions = object.userData.interactionActions.filter(a => a.groupObjectsTogether);
  if (groupActions.length === 0) {
    return [];
  }

  const flattenedObjects = groupActions.flatMap(a => a.objects ?? new Set<PolygonalObject3D>());
  const objects = new Set(...flattenedObjects);
  objects.delete(object as PolygonalObject3D);
  return Array.from(objects);
}
