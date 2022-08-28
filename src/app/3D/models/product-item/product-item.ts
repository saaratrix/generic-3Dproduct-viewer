import type { SubProductItem } from './sub-product-item';
import type { Object3D } from 'three';
import type { Model3D } from '../model-3D';
import type { InteractionGroup } from '../../../shared/3d-interactions/interaction-group';
import type { ActiveProductItemEvent } from './active-product-item-event';
import type { PolygonalObject3D } from '../../3rd-party/three/types/polygonal-object-3D';

export interface ProductItem {
  id: number;
  /**
   * A unique name used to identify the product item from routing.
   */
  name: string;
  thumbnail: string;
  models: Model3D[];
  /**
   * If true, the camera can't look at the underside of the model.
   */
  hasFloor: boolean;
  useGammaSpace: boolean;
  tooltip: string;
  subItems: SubProductItem[];
  selectedSubItem?: SubProductItem | number | null;
  /**
   * Any objects or meshes that are interactable and have any
   */
  interactions?: InteractionGroup[];

  // Variables generated at runtime:
  activeEvents: ActiveProductItemEvent[];
  /**
   * The root object3D
   */
  object3D?: Object3D;
  // The cached intersections from parsing selectableObjectsOptions, so we only have to do it once.
  selectableObject3DIntersections?: PolygonalObject3D[];
}
