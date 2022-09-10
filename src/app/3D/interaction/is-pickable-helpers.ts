import type { Object3D } from 'three';
import { isInteractionUserData } from './is-interaction-user-data';

export function isPickableFromVisibiity(object: Object3D | null): boolean {
  while (object) {
    if (!object.visible) {
      return false;
    }

    object = object.parent;
  }

  return true;
}

export function toggleRecursiveIsPickable(object: Object3D, isPickable: boolean): void {
  // Traverses itself too.
  object.traverse((o) => {
    if (isInteractionUserData(o.userData)) {
      o.userData.isPickable = isPickable;
    }
  });
}
