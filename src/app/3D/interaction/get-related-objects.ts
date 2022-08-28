import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';
import type { Object3D } from 'three';
import { isInteractionUserData } from './isInteractionUserData';

export function getRelatedObjects(object: Object3D): PolygonalObject3D[] {
  if (!isInteractionUserData(object.userData)) {
    return [];
  }

  if (!object.userData.interactionActions.some(a => a.groupObjectsTogether)) {
    return [];
  }

  const flattenedObjects = object.userData.interactionActions.flatMap(a => a.objects ?? []);
  const objects = new Set(flattenedObjects);
  return Array.from(objects);
}
