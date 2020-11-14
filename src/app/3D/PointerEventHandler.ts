import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Mesh } from "three";

export class PointerEventHandler {
  private element!: HTMLElement;

  private currentHoveredMesh: Mesh | undefined;
  private currentSelectedMesh: Mesh | undefined;

  constructor(
    private productConfiguratorService: ProductConfiguratorService
  ) {}

  public initPointerEvents(element: HTMLElement): void {
    this.element = element;

    element.addEventListener("click", this.onClick);
    element.addEventListener("pointermove", this.onPointerMove);
    element.addEventListener("pointerleave", this.onPointerLeave);
  }

  public removePointerEvents(): void {
    this.element.removeEventListener("click", this.onClick);
    this.element.removeEventListener("pointermove", this.onPointerMove);
    this.element.removeEventListener("pointerleave", this.onPointerLeave);
  }

  // Creating lambdas so we don't have to do .bind() on the methods.
  private onPointerMove = (event: PointerEvent): void => {
    // TODO: Probably disable on pointer down as otherwise it'd select while dragging camera.

    // Are any meshes under the current pointer location?
  }

  private onClick = (event: MouseEvent): void => {
    // Get mesh from clicked point
  }

  private onPointerLeave = (): void => {
    if (this.currentHoveredMesh) {
      this.productConfiguratorService.dispatch(ProductConfigurationEvent.Mesh_PointerLeave, this.currentHoveredMesh);
      this.currentHoveredMesh = undefined;
    }
  }
}
