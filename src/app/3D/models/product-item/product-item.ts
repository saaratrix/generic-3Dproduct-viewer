import type { SubProductItem } from './sub-product-item';
import type { Object3D } from 'three';
import type { Model3D } from '../model-3D';
import type { PickingSetupItem } from '../../../shared/3d-picking/picking-setup-item';
import type { ActiveProductItemEvent } from './active-product-item-event';
import type { PolygonalObject3D } from '../../3rd-party/three/types/polygonal-object-3D';

export interface ProductItem {
  /**
   * A unique id used for example to identify the product item from routing.
   */
  id: string;
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
   * Any objects or meshes that are pickable and their corresponding actions.
   */
  pickingSetupItems?: PickingSetupItem[];

  // Variables generated at runtime:
  /**
   * Any active events like a material's colour is changing.
   */
  activeEvents: ActiveProductItemEvent[];
  /**
   * The root object3D
   */
  object3D?: Object3D;
  /**
   * The cached initialized pickable objects.
   */
  pickableObjects?: PolygonalObject3D[];
}
