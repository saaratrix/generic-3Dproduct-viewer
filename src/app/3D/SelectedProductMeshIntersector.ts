import { ProductConfiguratorService } from "../product-configurator.service";
import { Intersection, Object3D, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Subscription } from "rxjs";

export class SelectedProductMeshIntersector {
  private raycaster: Raycaster = new Raycaster();
  private intersectableObjects: Object3D[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private camera: PerspectiveCamera,
    private productConfiguratorService: ProductConfiguratorService,
  ) {
    this.subscriptions.push(
      this.productConfiguratorService.selectedProduct_Changed.subscribe(() => {

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
    return this.raycaster.intersectObjects(this.intersectableObjects, true);
  }

}
