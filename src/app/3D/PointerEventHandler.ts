/* tslint:disable:member-ordering */
import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Intersection, Mesh, PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";
import { throttle } from "../utility/throttle";
import { SelectedProductMeshIntersector } from "./SelectedProductMeshIntersector";

export class PointerEventHandler {
  private element!: HTMLElement;
  private pointerPosition: Vector2 = new Vector2();

  private pointerdownPosition: { x: number, y: number } | undefined = undefined;

  private currentHoveredMesh: Mesh | undefined;
  private currentSelectedMesh: Mesh | undefined;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private selectedProductMeshIntersector: SelectedProductMeshIntersector,
  ) {
    this.productConfiguratorService.selectedProduct_Changed.subscribe(() => {
      if (this.currentHoveredMesh) {
        this.deselectCurrentHoveredMesh();
      }
      if (this.currentSelectedMesh) {
        this.deselectCurrentMesh();
      }
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
  }

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
  }

  /** Pointer Move **/
  private onPointerMove = throttle((event: PointerEvent): void => {
    if (this.pointerdownPosition) {
      return;
    }

    this.trySetMeshAndEmitEvents(event, ProductConfigurationEvent.Mesh_PointerEnter, "currentHoveredMesh", this.deselectCurrentHoveredMesh);
  }, 1000 / 60);

  private onPointerLeave = (): void => {
    if (this.currentHoveredMesh) {
      this.deselectCurrentHoveredMesh();
    }
    this.pointerdownPosition = undefined;
  }

  private onClick(event: PointerEvent): void {
    // button = 0 for left clicks on a mouse.
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    this.trySetMeshAndEmitEvents(event, ProductConfigurationEvent.Mesh_Selected, "currentSelectedMesh", this.deselectCurrentMesh);
  }

  // A method that both click & pointermove can use because they had the same functionality just different variables!
  private trySetMeshAndEmitEvents(pointerEvent: PointerEvent, selectedEvent: ProductConfigurationEvent, selectedKey: "currentSelectedMesh" | "currentHoveredMesh", deselectMethod: () => void): void {
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
        // If the object isn't the same then we need to deselect it so it can lose the selected material!
      } else {
        deselectMethod.call(this);
      }
    }

    if (!selectedObject.type.toLowerCase().includes("mesh")) {
      return;
    }

    this[selectedKey] = selectedObject as Mesh;
    this.productConfiguratorService.dispatch(selectedEvent, this[selectedKey]);
  }

  private setPointerPosition(event: PointerEvent | MouseEvent): void {
    // Convert pointer XY to screen space.
    this.pointerPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointerPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private getIntersections(event: PointerEvent | MouseEvent): Intersection[] {
    this.setPointerPosition(event);
    return this.selectedProductMeshIntersector.getIntersections(this.pointerPosition);
  }

  private deselectCurrentHoveredMesh(): void {
    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Mesh_PointerLeave, this.currentHoveredMesh);
    this.currentHoveredMesh = undefined;
  }

  private deselectCurrentMesh(): void {
    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Mesh_Deselected, this.currentSelectedMesh);
    this.currentSelectedMesh = undefined;
  }
}
