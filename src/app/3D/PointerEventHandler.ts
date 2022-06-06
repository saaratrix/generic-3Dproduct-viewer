import { ProductConfiguratorService } from "../product-configurator.service";
import { Intersection, Mesh, Vector2 } from "three";
import { throttle } from "../utility/throttle";
import { SelectedProductMeshIntersector } from "./SelectedProductMeshIntersector";
import type { Subject } from "rxjs";
import { isMesh } from "./3rd-party/three/IsMesh";

interface PointerCoordinates {
  x: number;
  y: number;
}

export class PointerEventHandler {
  private element!: HTMLElement;
  private pointerPosition: Vector2 = new Vector2();

  private pointerdownPosition: PointerCoordinates | undefined = undefined;

  private currentHoveredMesh: Mesh | undefined;
  private currentSelectedMesh: Mesh | undefined;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private selectedProductMeshIntersector: SelectedProductMeshIntersector,
  ) {
    this.productConfiguratorService.selectedProductChanged.subscribe(() => {
      this.tryDeselectCurrentHoveredMesh();
      this.tryDeselectCurrentMesh();
    });
  }

  public initPointerEvents(element: HTMLElement): void {
    this.element = element;

    element.addEventListener("pointerdown", this.onPointerDown);
    element.addEventListener("pointerup", this.onPointerUp);
    element.addEventListener("pointermove", this.onPointerMove);
    element.addEventListener("pointerleave", this.onPointerLeave);
  }

  public removePointerEvents(): void {
    this.element.removeEventListener("pointerdown", this.onPointerDown);
    this.element.addEventListener("pointerup", this.onPointerUp);
    this.element.removeEventListener("pointermove", this.onPointerMove);
    this.element.removeEventListener("pointerleave", this.onPointerLeave);
  }

  // Creating lambdas so we don't have to do .bind() on the methods.
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

    this.trySetMeshAndEmitEvents(event, this.productConfiguratorService.meshPointerEnter, "currentHoveredMesh", this.tryDeselectCurrentHoveredMesh);
  }, 1000 / 60);

  private onPointerLeave = (): void => {
    this.tryDeselectCurrentHoveredMesh();
    this.pointerdownPosition = undefined;
  };

  private onClick(event: PointerEvent): void {
    // button = 0 for left clicks on a mouse.
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    this.trySetMeshAndEmitEvents(event, this.productConfiguratorService.meshSelected, "currentSelectedMesh", this.tryDeselectCurrentMesh);
  }

  // A method that both click & pointermove can use because they had the same functionality just different variables!
  private trySetMeshAndEmitEvents(pointerEvent: PointerEvent, subject: Subject<Mesh>, selectedKey: "currentSelectedMesh" | "currentHoveredMesh", deselectMethod: () => void): void {
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

    if (!isMesh(selectedObject)) {
      return;
    }

    this[selectedKey] = selectedObject;
    subject.next(selectedObject);
  }

  private setPointerPosition(event: PointerEvent | MouseEvent): void {
    // Convert pointer XY to screen space.
    this.pointerPosition.x = (event.clientX / this.element.offsetWidth) * 2 - 1;
    this.pointerPosition.y = -(event.clientY / this.element.offsetHeight) * 2 + 1;
  }

  private getIntersections(event: PointerEvent | MouseEvent): Intersection[] {
    this.setPointerPosition(event);
    return this.selectedProductMeshIntersector.getIntersections(this.pointerPosition);
  }

  private tryDeselectCurrentHoveredMesh(): void {
    if (!this.currentHoveredMesh) {
      return;
    }

    this.productConfiguratorService.meshPointerLeave.next(this.currentHoveredMesh);
    this.currentHoveredMesh = undefined;
  }

  private tryDeselectCurrentMesh(): void {
    if (!this.currentSelectedMesh) {
      return;
    }

    this.productConfiguratorService.meshDeselected.next(this.currentSelectedMesh);
    this.currentSelectedMesh = undefined;
  }
}
