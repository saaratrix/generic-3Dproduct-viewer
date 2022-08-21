import type { ProductConfiguratorService } from '../product-configurator.service';
import type { Intersection } from 'three';
import { Vector2 } from 'three';
import { throttle } from '../utility/throttle';
import type { SelectedProductObjectIntersector } from './selected-product-object-intersector';
import type { Subject } from 'rxjs';
import { isPolygonalObject3D } from './3rd-party/three/types/is-three-js-custom-type';
import type { PolygonalObject3D } from './3rd-party/three/types/polygonal-object-3D';
import { Subscription } from 'rxjs';

interface PointerCoordinates {
  x: number;
  y: number;
}

export class PointerEventHandler {
  private element!: HTMLElement;
  private pointerPosition: Vector2 = new Vector2();

  private pointerdownPosition: PointerCoordinates | undefined = undefined;

  private currentHoveredObject: PolygonalObject3D | undefined;
  private currentSelectedObject: PolygonalObject3D | undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private selectedProductObjectIntersector: SelectedProductObjectIntersector,
  ) {
    this.subscriptions.push(
      this.productConfiguratorService.selectedProductChanged.subscribe(() => {
        this.tryDeselectCurrentHoveredObject();
        this.tryDeselectCurrentObject();
      }),
      this.productConfiguratorService.object3DPointerEnter.subscribe(object => this.currentHoveredObject = object),
      this.productConfiguratorService.object3DPointerLeave.subscribe(() => this.currentHoveredObject = undefined),
      this.productConfiguratorService.object3DSelected.subscribe(object => this.currentSelectedObject = object),
      this.productConfiguratorService.object3DDeselected.subscribe(() => this.currentSelectedObject = undefined),
    );

  }

  public dispose(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  public initPointerEvents(element: HTMLElement): void {
    this.element = element;

    element.addEventListener('pointerdown', this.onPointerDown);
    element.addEventListener('pointerup', this.onPointerUp);
    element.addEventListener('pointermove', this.onPointerMove);
    element.addEventListener('pointerleave', this.onPointerLeave);
  }

  public removePointerEvents(): void {
    this.element.removeEventListener('pointerdown', this.onPointerDown);
    this.element.addEventListener('pointerup', this.onPointerUp);
    this.element.removeEventListener('pointermove', this.onPointerMove);
    this.element.removeEventListener('pointerleave', this.onPointerLeave);
  }

  // Creating lambdas, so we don't have to do .bind() on the methods.
  private onPointerDown = (event: PointerEvent): void => {
    this.pointerdownPosition = { x: event.clientX, y: event.clientY };
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (this.pointerdownPosition) {
      // Check how much the pointer has moved.
      const deltaX = event.clientX - this.pointerdownPosition!.x;
      const deltaY = event.clientY - this.pointerdownPosition!.y;

      // If the user moved their cursor more than say 5 pixels then we don't do the click.
      if ((deltaX ** 2 + deltaY ** 2) < 5) {
        this.onClick(event);
      }
    }

    this.pointerdownPosition = undefined;
  };

  /** Pointer Move **/
  private onPointerMove = throttle((event: PointerEvent): void => {
    if (this.pointerdownPosition) {
      return;
    }

    this.trySetObjectAndEmitEvents(event, this.productConfiguratorService.object3DPointerEnter, 'currentHoveredObject', this.tryDeselectCurrentHoveredObject);
  }, 1000 / 60);

  private onPointerLeave = (): void => {
    this.tryDeselectCurrentHoveredObject();
    this.pointerdownPosition = undefined;
  };

  private onClick(event: PointerEvent): void {
    // button = 0 for left-clicks on a mouse.
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    this.trySetObjectAndEmitEvents(event, this.productConfiguratorService.object3DSelected, 'currentSelectedObject', this.tryDeselectCurrentObject);
  }

  // A method that both click & pointermove can use because they had the same functionality just different variables!
  private trySetObjectAndEmitEvents(pointerEvent: PointerEvent, subject: Subject<PolygonalObject3D>, selectedKey: 'currentSelectedObject' | 'currentHoveredObject', deselectMethod: () => void): void {
    const intersections = this.getIntersections(pointerEvent);

    if (intersections.length === 0) {
      if (this[selectedKey]) {
        deselectMethod.call(this);
      }
      return;
    }

    const selectedObject = intersections[0].object;

    if (this[selectedKey]) {
      if (selectedObject === this[selectedKey]) {
        return;
      // If the object isn't the same then we need to deselect it, so it can lose the selected material!
      } else {
        deselectMethod.call(this);
      }
    }

    if (!isPolygonalObject3D(selectedObject)) {
      return;
    }

    subject.next(selectedObject);
  }

  private setPointerPosition(event: PointerEvent | MouseEvent): void {
    // Convert pointer XY to screen space.
    this.pointerPosition.x = (event.clientX / this.element.offsetWidth) * 2 - 1;
    this.pointerPosition.y = -(event.clientY / this.element.offsetHeight) * 2 + 1;
  }

  private getIntersections(event: PointerEvent | MouseEvent): Intersection[] {
    this.setPointerPosition(event);
    return this.selectedProductObjectIntersector.getIntersections(this.pointerPosition);
  }

  private tryDeselectCurrentHoveredObject(): void {
    if (!this.currentHoveredObject) {
      return;
    }

    this.productConfiguratorService.object3DPointerLeave.next(this.currentHoveredObject);
  }

  private tryDeselectCurrentObject(): void {
    if (!this.currentSelectedObject) {
      return;
    }

    this.productConfiguratorService.object3DDeselected.next(this.currentSelectedObject);
  }
}
