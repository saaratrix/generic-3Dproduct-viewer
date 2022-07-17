import type { ProductConfiguratorService } from "../product-configurator.service";
import type { Subscription } from "rxjs";
import type { Mesh, WebGLRenderer } from "three";
import type { SelectableObject3DUserData } from "./models/selectable-meshes-options/SelectableObject3DUserData";

export class SelectedProductHighlighter {
  private hoveredMesh: Mesh | undefined;
  private selectedMesh: Mesh | undefined;

  private subscriptions: Subscription[] = [];

  constructor(renderer: WebGLRenderer, private productConfiguratorService: ProductConfiguratorService) {
    this.subscriptions.push(
      this.productConfiguratorService.meshPointerEnter.subscribe((mesh) => {
        this.hoveredMesh = mesh;
        this.setHoverMaterial(mesh);
      }),
      this.productConfiguratorService.meshPointerLeave.subscribe((mesh) => {
        this.hoveredMesh = undefined;
        this.clearHoverMaterial(mesh);
      }),
      // Selection
      this.productConfiguratorService.meshSelected.subscribe(mesh => {
        this.selectedMesh = mesh;
        this.setSelectedMaterial(mesh);
      }),
      this.productConfiguratorService.meshDeselected.subscribe(mesh => {
        this.selectedMesh = undefined;
        this.clearSelectedMaterial(mesh);
      }),
    );
  }

  dispose(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.hoveredMesh = undefined;
    this.selectedMesh = undefined;
  }

  isAnyProductHighlighted(): boolean {
    return !!(this.hoveredMesh || this.selectedMesh);
  }

  private setSelectedMaterial(mesh: Mesh): void {
    this.enableLayer(mesh, 2);
    if (this.hoveredMesh && this.areMeshOrSiblingsEqual(mesh, this.hoveredMesh)) {
      this.clearHoverMaterial(this.hoveredMesh);
    }
  }

  private clearSelectedMaterial(mesh: Mesh): void {
    this.disableLayer(mesh, 2);
    if (this.hoveredMesh && this.areMeshOrSiblingsEqual(mesh, this.hoveredMesh)) {
      this.setHoverMaterial(this.hoveredMesh);
    }
  }

  private setHoverMaterial(mesh: Mesh): void {
    if (this.selectedMesh && this.areMeshOrSiblingsEqual(mesh, this.selectedMesh)) {
      return;
    }
    this.enableLayer(mesh, 1);
  }

  private clearHoverMaterial(mesh: Mesh): void {
    this.disableLayer(mesh, 1);
  }

  private areMeshOrSiblingsEqual(a: Mesh, b: Mesh): boolean {
    if (a === b) {
      return true;
    }

    const allA = [a, ...((a.userData as SelectableObject3DUserData)?.siblings ?? [])];
    const allB = [b, ...((b.userData as SelectableObject3DUserData)?.siblings ?? [])];

    return allA.some(a => allB.some(b => b === a));
  }

  private enableLayer(mesh: Mesh, channel: number): void {
    mesh.layers.enable(channel);

    const userData = mesh.userData as SelectableObject3DUserData;
    if (!Array.isArray(userData?.siblings)) {
      return;
    }

    for (const sibling of userData.siblings) {
      sibling.layers.enable(channel);
    }
  }

  private disableLayer(mesh: Mesh, channel: number): void {
    mesh.layers.disable(channel);

    const userData = mesh.userData as SelectableObject3DUserData;
    if (!Array.isArray(userData?.siblings)) {
      return;
    }

    for (const sibling of userData.siblings) {
      sibling.layers.disable(channel);
    }
  }
}
