import type { ProductConfiguratorService } from '../shared/product-configurator.service';
import type { Intersection, PerspectiveCamera, Vector2 } from 'three';
import { Raycaster } from 'three';
import type { Subscription } from 'rxjs';
import type { PolygonalObject3D } from './3rd-party/three/types/polygonal-object-3D';
import type { PickingUserdata } from './picking/picking-userdata';

export class SelectedProductObjectIntersector {
  private raycaster: Raycaster = new Raycaster();
  private intersectableObjects: PolygonalObject3D[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private camera: PerspectiveCamera,
    private productConfiguratorService: ProductConfiguratorService,
  ) {
    this.subscriptions.push(
      this.productConfiguratorService.selectedProductChanged.subscribe(productItem => {
        if (!productItem.pickableObjects) {
          this.intersectableObjects = [];
          return;
        }

        this.intersectableObjects = productItem.pickableObjects as PolygonalObject3D[];
      }),
    );
  }

  public dispose(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public getIntersections(pointerPosition: Vector2): Intersection[] {
    this.raycaster.far = this.camera.far;
    this.raycaster.setFromCamera(pointerPosition, this.camera);

    const intersectableObjects = this.intersectableObjects.filter(i => !!(i.userData as PickingUserdata).isPickable);
    return this.raycaster.intersectObjects(intersectableObjects, false);
  }
}
