import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';
import type { InteractionActionTypes } from './interaction-action-types';

export interface InteractionAction {
  priority?: number;
  /**
   * The interaction type to identify what kind of action it is.
   * Since the data isn't a class we can't use instanceof.
   */
  type: InteractionActionTypes;

  /**
   * If true the objects count as one object when performing an action.
   */
  groupObjectsTogether?: boolean;

  // Dynamically generated.
  objects?: Set<PolygonalObject3D>;
}
