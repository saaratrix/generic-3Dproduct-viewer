import type { Object3D } from 'three';
import { isPickingUserData } from './is-picking-user-data';

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
    if (isPickingUserData(o.userData)) {
      o.userData.isPickable = isPickable;
    }
  });
}
