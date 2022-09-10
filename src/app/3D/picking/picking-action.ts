import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';
import type { PickingActionTypes } from './picking-action-types';

export interface PickingAction {
  /**
   * The picking type to identify what kind of action it is.
   * Since the data isn't a class we can't use instanceof.
   * It can also be used to filter related objects to a certain type.
   */
  type: PickingActionTypes;

  /**
   * If true the objects count as one object when performing an action.
   */
  groupObjectsTogether?: boolean;

  // Dynamically populated.
  /**
   * The objects that the action affects.
   */
  objects?: Set<PolygonalObject3D>;
}
