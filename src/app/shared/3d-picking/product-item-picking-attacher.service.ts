import { Injectable, OnDestroy } from '@angular/core';
import { ProductConfiguratorService } from '../product-configurator.service';
import type { Subscription } from 'rxjs';
import type { ProductItem } from '../../3D/models/product-item/product-item';
import type { PolygonalObject3D } from '../../3D/3rd-party/three/types/polygonal-object-3D';
import type { PickingSetupItem } from './picking-setup-item';
import type { Object3D } from 'three';
import { isPolygonalObject3D } from '../../3D/3rd-party/three/types/is-three-js-custom-type';
import type { PickingAction } from '../../3D/picking/picking-action';
import { createPickingUserDataAndAddActions } from '../../3D/picking/create-picking-user-data-and-add-actions';

@Injectable({
  providedIn: 'root',
})
export class ProductItemPickingAttacherService implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    productConfiguratorService: ProductConfiguratorService,
  ) {
    this.subscriptions.push(
      productConfiguratorService.productLoadingFinished.subscribe(event => this.attachPickingActions(event.product)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  attachPickingActions(product: ProductItem): void {
    if (!product.pickingSetupItems || !product.object3D) {
      product.pickableObjects = [];
      return;
    }

    const intersectableObjects: Set<PolygonalObject3D> = new Set<PolygonalObject3D>();

    for (const pickingSetupItem of product.pickingSetupItems) {
      if (!pickingSetupItem.actions?.length) {
        continue;
      }

      const objects = this.getObjects(pickingSetupItem, product.object3D);
      this.setupPickingActionsForObjects(objects, pickingSetupItem.actions);
      objects.forEach(o => intersectableObjects.add(o));
    }

    product.pickableObjects = Array.from(intersectableObjects.values());
  }

  /**
   * Get all pickable objects for the input pickingSetupItem.
   */
  getObjects(pickingSetupItem: PickingSetupItem, rootObject: Object3D): PolygonalObject3D[] {
    const objects: PolygonalObject3D[] = [];
    rootObject.traverse(o => {
      if (!isPolygonalObject3D(o)) {
        return;
      }

      const objectName = o.name.toLocaleUpperCase();
      if (!!pickingSetupItem.excluded?.length && pickingSetupItem.excluded.some(name => name.toLocaleUpperCase() === objectName)) {
        return;
      }

      if (!!pickingSetupItem.included?.length && !pickingSetupItem.included.some(name => name.toLocaleUpperCase() === objectName)) {
        return;
      }

      objects.push(o);
    });

    return objects;
  }

  setupPickingActionsForObjects(objects: PolygonalObject3D[], actions: PickingAction[]): void {
    createPickingUserDataAndAddActions(objects, actions);
  }
}
