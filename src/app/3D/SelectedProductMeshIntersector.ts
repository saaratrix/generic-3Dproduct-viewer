import { ProductConfiguratorService } from "../product-configurator.service";
import { Intersection, Mesh, Object3D, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { Subscription } from "rxjs";
import { SelectableOptionsType } from "./models/SelectableOptionsType";
import { SelectableObject3DUserData } from "./models/SelectableObject3DUserData";

export class SelectedProductMeshIntersector {
  private raycaster: Raycaster = new Raycaster();
  private intersectableObjects: Mesh[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private camera: PerspectiveCamera,
    private productConfiguratorService: ProductConfiguratorService,
  ) {
    this.subscriptions.push(
      this.productConfiguratorService.selectedProduct_Changed.subscribe(productItem => {
        this.intersectableObjects = [];
        const selectableOptions = productItem.selectableOptions;
        if (!productItem.object3D || !selectableOptions || selectableOptions.type === SelectableOptionsType.NotSelectable) {
          return;
        }

        // TODO: Optimize by putting the data on the productItem?
        // Add all meshes that aren't excluded
        productItem.object3D.traverse(object => {
          const mesh = object as Mesh;
          // Exclude all non-mesh objects
          if (!mesh.isMesh) {
            return;
          }

          if (!Array.isArray(selectableOptions.excludeMeshes) || !selectableOptions.excludeMeshes.includes(mesh.name)) {
            this.intersectableObjects.push(mesh);
          }
        });

        // If SelectableOptionsType.All then Loop over all intersectableObjects and add related siblings
        if (selectableOptions.type === SelectableOptionsType.All) {
          for (const object of this.intersectableObjects) {
            const userData = object.userData as SelectableObject3DUserData;
            userData.siblings = this.intersectableObjects.filter(o => o !== object);
          }
        }
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
    return this.raycaster.intersectObjects(this.intersectableObjects, false);
  }

}
