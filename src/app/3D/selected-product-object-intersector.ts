import type { ProductConfiguratorService } from "../product-configurator.service";
import type { Intersection, PerspectiveCamera, Vector2 } from "three";
import { Raycaster } from "three";
import type { Subscription } from "rxjs";
import type { SelectableObject3DUserData } from "./models/selectable-object-3ds-options/selectable-object-3D-user-data";
import type { SelectableObject3DsOption } from "./models/selectable-object-3ds-options/selectable-object-3Ds-option";
import type { ProductItem } from "./models/product-item/product-item";
import type { PolygonalObject3D } from "./3rd-party/three/types/polygonal-object-3D";
import { isPolygonalObject3D } from "./3rd-party/three/types/is-three-js-custom-type";

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
        if (productItem.selectableObject3DIntersections) {
          this.intersectableObjects = productItem.selectableObject3DIntersections;
          return;
        }

        this.intersectableObjects = [];
        if (!productItem.object3D || !Array.isArray(productItem.selectableObject3DsOptions)) {
          return;
        }

        for (const option of productItem.selectableObject3DsOptions) {
          this.parseSelectableObjectsOption(productItem, option);
        }

        productItem.selectableObject3DIntersections = this.intersectableObjects;
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

    const intersectableObjects = this.intersectableObjects.filter(i => !(i.userData as SelectableObject3DUserData).isPickingDisabled);
    return this.raycaster.intersectObjects(intersectableObjects, false);
  }

  private parseSelectableObjectsOption(productItem: ProductItem, option: SelectableObject3DsOption): void {
    const intersectableObjects: PolygonalObject3D[] = [];

    productItem.object3D!.traverse(object => {
      if (!isPolygonalObject3D(object)) {
        return;
      }

      // Check if the object is excluded
      if (Array.isArray(option.excludeObjects) && option.excludeObjects.includes(object.name)) {
        return;
      }

      // Check if the object is included.
      if (Array.isArray(option.includedObjects) && !option.includedObjects.includes(object.name)) {
        return;
      }
      const userData = object.userData as SelectableObject3DUserData;
      userData.selectableObjectsOption = { ...option.options };
      intersectableObjects.push(object);
    });

    // Iterate over all objects to set the related objects.
    // If two different SelectableObjectsOption targets the same object the last one would win.
    if (!option.noRelatedObjects) {
      for (const object of intersectableObjects) {
        const userData = object.userData as SelectableObject3DUserData;
        userData.related = intersectableObjects.filter(o => o !== object);
      }
    }

    // Finally add the intersectableObjects found but skip potential duplicates
    for (const object of intersectableObjects) {
      if (this.intersectableObjects.indexOf(object) === -1) {
        this.intersectableObjects.push(object);
      }
    }
  }
}
