/* tslint:disable:member-ordering */
import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Mesh, PerspectiveCamera, Raycaster, Scene, Vector2 } from "three";
import { throttle } from "../utility/throttle";

export class PointerEventHandler {
  private element!: HTMLElement;
  private raycaster: Raycaster = new Raycaster();
  private pointerPosition: Vector2 = new Vector2();

  private currentHoveredMesh: Mesh | undefined;
  private currentSelectedMesh: Mesh | undefined;

  constructor(
    private scene: Scene,
    private camera: PerspectiveCamera,
    private productConfiguratorService: ProductConfiguratorService,
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
  private onPointerMove = throttle((event: PointerEvent): void => {
    // TODO: Probably disable on pointer down as otherwise it'd select while dragging camera.

    // Are any meshes under the current pointer location?
  }, 16);

  private onClick = (event: MouseEvent): void => {
    // Get mesh from clicked point
    this.setPointerPosition(event);

    this.raycaster.far = this.camera.far;
    this.raycaster.setFromCamera(this.pointerPosition, this.camera);
    const intersections = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersections.length === 0) {
      if (this.currentSelectedMesh) {
        this.deselectCurrentMesh();
      }
      return;
    }

    const selectedObject = intersections[0].object;

    if (this.currentSelectedMesh) {
      if (selectedObject === this.currentSelectedMesh) {
        return;
      // If the object isn't the same then we need to deselect it so it can lose the selected material!
      } else {
        this.deselectCurrentMesh();
      }
    }

    if (!selectedObject.type.toLowerCase().includes("mesh")) {
      return;
    }

    this.currentSelectedMesh = selectedObject as Mesh;
    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Mesh_Selected, this.currentSelectedMesh);
  }

  private onPointerLeave = (): void => {
    if (this.currentHoveredMesh) {
      this.productConfiguratorService.dispatch(ProductConfigurationEvent.Mesh_PointerLeave, this.currentHoveredMesh);
      this.currentHoveredMesh = undefined;
    }
  }

  private setPointerPosition(event: PointerEvent | MouseEvent): void {
    // Convert pointer XY to screen space.
    this.pointerPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.pointerPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  private deselectCurrentMesh() {
    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Mesh_Deselected, this.currentSelectedMesh);
    this.currentSelectedMesh = undefined;
  }
}
