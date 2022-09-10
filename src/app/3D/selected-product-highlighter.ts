import type { ProductConfiguratorService } from '../shared/product-configurator.service';
import type { Subscription } from 'rxjs';
import type { WebGLRenderer } from 'three';
import type { PolygonalObject3D } from './3rd-party/three/types/polygonal-object-3D';
import { getRelatedObjects } from './interaction/get-related-objects';

export class SelectedProductHighlighter {
  private hoveredObject: PolygonalObject3D | undefined;
  private selectedObject: PolygonalObject3D | undefined;

  private subscriptions: Subscription[] = [];

  constructor(renderer: WebGLRenderer, private productConfiguratorService: ProductConfiguratorService) {
    this.subscriptions.push(
      this.productConfiguratorService.object3DPointerEnter.subscribe((object) => {
        this.hoveredObject = object;
        this.setHoverMaterial(object);
      }),
      this.productConfiguratorService.object3DPointerLeave.subscribe((object) => {
        this.hoveredObject = undefined;
        this.clearHoverMaterial(object);
      }),
      // Selection
      this.productConfiguratorService.object3DSelected.subscribe(object => {
        if (this.selectedObject) {
          this.clearSelectedMaterial(this.selectedObject);
        }

        this.selectedObject = object;
        this.setSelectedMaterial(object);
      }),
      this.productConfiguratorService.object3DDeselected.subscribe(object => {
        this.selectedObject = undefined;
        this.clearSelectedMaterial(object);
      }),
    );
  }

  dispose(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.hoveredObject = undefined;
    this.selectedObject = undefined;
  }

  isAnyProductHighlighted(): boolean {
    return !!(this.hoveredObject || this.selectedObject);
  }

  private setSelectedMaterial(object: PolygonalObject3D): void {
    this.enableLayer(object, 2);
    if (this.hoveredObject && this.areObjectOrRelatedEqual(object, this.hoveredObject)) {
      this.clearHoverMaterial(this.hoveredObject);
    }
  }

  private clearSelectedMaterial(object: PolygonalObject3D): void {
    this.disableLayer(object, 2);
    if (this.hoveredObject && this.areObjectOrRelatedEqual(object, this.hoveredObject)) {
      this.setHoverMaterial(this.hoveredObject);
    }
  }

  private setHoverMaterial(object: PolygonalObject3D): void {
    if (this.selectedObject && this.areObjectOrRelatedEqual(object, this.selectedObject)) {
      return;
    }
    this.enableLayer(object, 1);
  }

  private clearHoverMaterial(object: PolygonalObject3D): void {
    this.disableLayer(object, 1);
  }

  private areObjectOrRelatedEqual(a: PolygonalObject3D, b: PolygonalObject3D): boolean {
    if (a === b) {
      return true;
    }

    const allA = [a, ...getRelatedObjects(a)];
    const allB = [b, ...getRelatedObjects(b)];

    return allA.some(a => allB.some(b => b === a));
  }

  private enableLayer(object: PolygonalObject3D, channel: number): void {
    object.layers.enable(channel);

    const related = getRelatedObjects(object);
    for (const sibling of related) {
      sibling.layers.enable(channel);
    }
  }

  private disableLayer(object: PolygonalObject3D, channel: number): void {
    object.layers.disable(channel);

    const related = getRelatedObjects(object);
    for (const sibling of related) {
      sibling.layers.disable(channel);
    }
  }
}
