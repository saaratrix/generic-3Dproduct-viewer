import { Injectable, OnDestroy } from '@angular/core';
import { ProductConfiguratorService } from '../product-configurator.service';
import type { Subscription } from 'rxjs';
import type { ProductItem } from '../../3D/models/product-item/product-item';
import type { PolygonalObject3D } from '../../3D/3rd-party/three/types/polygonal-object-3D';
import type { InteractionGroup } from './interaction-group';
import type { Object3D } from 'three';
import { isPolygonalObject3D } from '../../3D/3rd-party/three/types/is-three-js-custom-type';

@Injectable({
  providedIn: 'root',
})
export class ProductItemInteractionAttacherService implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    productConfiguratorService: ProductConfiguratorService,
  ) {
    this.subscriptions.push(
      productConfiguratorService.productLoadingFinished.subscribe(event => this.attachInteractionActions(event.product)),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  attachInteractionActions(product: ProductItem): void {
    if (!product.interactions || !product.object3D) {
      product.interactableObjects = [];
      return;
    }

    const intersectableObjects: Set<PolygonalObject3D> = new Set<PolygonalObject3D>();
    for (const interaction of product.interactions) {
      if (!interaction.actions?.length) {
        continue;
      }

      const objects = this.getObjects(interaction, product.object3D);
      this.setupInteraction(objects, interaction);
      objects.forEach(o => intersectableObjects.add(o));
    }

    product.interactableObjects = Array.from(intersectableObjects.values());
  }

  getObjects(interaction: InteractionGroup, rootObject: Object3D): PolygonalObject3D[] {
    const objects: PolygonalObject3D[] = [];
    rootObject.traverse(o => {
      if (!isPolygonalObject3D(o)) {
        return;
      }

      const objectName = o.name.toLocaleUpperCase();
      if (!!interaction.excluded?.length && interaction.excluded.some(name => name.toLocaleUpperCase() === objectName)) {
        return;
      }

      if (!!interaction.included?.length && !interaction.included.some(name => name.toLocaleUpperCase() === objectName)) {
        return;
      }

      objects.push(o);
    });

    return objects;
  }

  setupInteraction(objects: PolygonalObject3D[], interaction: InteractionGroup): void {

  }
}
