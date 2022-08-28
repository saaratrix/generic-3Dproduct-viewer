import type { ProductConfiguratorService } from '../shared/product-configurator.service';
import type { Intersection, PerspectiveCamera, Vector2 } from 'three';
import { Raycaster } from 'three';
import type { Subscription } from 'rxjs';
import type { InteractionGroup } from '../shared/3d-interactions/interaction-group';
import type { ProductItem } from './models/product-item/product-item';
import type { PolygonalObject3D } from './3rd-party/three/types/polygonal-object-3D';
import { isPolygonalObject3D } from './3rd-party/three/types/is-three-js-custom-type';
import type { InteractionUserdata } from './interaction/interaction-userdata';

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
        if (productItem.interactableObjects) {
          this.intersectableObjects = productItem.interactableObjects as PolygonalObject3D[];
          return;
        }

        this.intersectableObjects = [];
        if (!productItem.object3D || !Array.isArray(productItem.interactions)) {
          return;
        }

        // for (const option of productItem.interactions) {
        //   this.parseSelectableObjectsOption(productItem, option);
        // }

        productItem.interactableObjects = this.intersectableObjects;
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

    const intersectableObjects = this.intersectableObjects.filter(i => !i.userData.isPickable);
    return this.raycaster.intersectObjects(intersectableObjects, false);
  }

  // private parseSelectableObjectsOption(productItem: ProductItem, option: InteractionGroup): void {
  //   const intersectableObjects: PolygonalObject3D[] = [];
  //
  //   productItem.object3D!.traverse(object => {
  //     if (!isPolygonalObject3D(object)) {
  //       return;
  //     }
  //
  //     // Check if the object is excluded
  //     if (Array.isArray(option.excluded) && option.excluded.includes(object.name)) {
  //       return;
  //     }
  //
  //     // Check if the object is included.
  //     if (Array.isArray(option.included) && !option.include.includes(object.name)) {
  //       return;
  //     }
  //     const userData = object.userData as InteractionUserdata;
  //     userData.selectableObjectsOption = { ...option.actions };
  //     intersectableObjects.push(object);
  //   });
  //
  //   // Iterate over all objects to set the related objects.
  //   // If two different SelectableObjectsOption targets the same object the last one would win.
  //   if (!option.noRelatedObjects) {
  //     for (const object of intersectableObjects) {
  //       const userData = object.userData as InteractionUserdata;
  //       userData.related = intersectableObjects.filter(o => o !== object);
  //     }
  //   }
  //
  //   // Finally add the intersectableObjects found but skip potential duplicates
  //   for (const object of intersectableObjects) {
  //     if (this.intersectableObjects.indexOf(object) === -1) {
  //       this.intersectableObjects.push(object);
  //     }
  //   }
  // }
}
