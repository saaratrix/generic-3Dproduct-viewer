import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Subscription } from "rxjs";
import { Mesh, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect";


export class SelectedProductHighlighter {

  private subscriptions: Subscription[] = [];

  private isHovering: boolean = false;
  private selectedMesh: Mesh | undefined;

  private selectedEffect!: OutlineEffect;
  private hoverEffect!: OutlineEffect;

  constructor(renderer: WebGLRenderer, private productConfiguratorService: ProductConfiguratorService) {
    this.createOutlineEffects(renderer);
    this.subscriptions.push(
      this.productConfiguratorService.mesh_PointerEnter.subscribe((mesh) => {
        this.setHoverMaterial(mesh);
      }),
      this.productConfiguratorService.mesh_PointerLeave.subscribe((mesh) => {
        this.clearHoverMaterial(mesh);
      }),
      // Selection
      this.productConfiguratorService.mesh_Selected.subscribe(mesh => {
        this.selectedMesh = mesh;
        this.setSelectedMaterial(mesh);
      }),
      this.productConfiguratorService.mesh_Deselected.subscribe(mesh => {
        this.clearSelectedMaterial(mesh);
        this.selectedMesh = undefined;
      }),
    );
  }

  dispose(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public renderOutline(scene: Scene, camera: PerspectiveCamera): void {
    if (this.isHovering) {
      camera.layers.set(1);
      this.hoverEffect.renderOutline(scene, camera);
    }

    if (this.selectedMesh) {
      camera.layers.set(2);
      this.selectedEffect.renderOutline(scene, camera);
    }

    camera.layers.set(0);
  }

  private createOutlineEffects(renderer: WebGLRenderer): void {
    const defaultThickness = 0.005; // default: 0.003
    this.selectedEffect = new OutlineEffect(renderer, {
      // snow
      defaultColor: [ 255 / 255, 250 / 255, 250 / 255 ],
      defaultThickness,
    });

    this.hoverEffect = new OutlineEffect(renderer, {
      // #b591c7
      defaultColor: [181 / 255,   145 / 255,   199 / 255],  // default: [0, 0, 0],
      defaultThickness,
    });
  }

  private setSelectedMaterial(mesh: Mesh): void {
    mesh.layers.enable(2);
  }

  private clearSelectedMaterial(mesh: Mesh): void {
    mesh.layers.disable(2);
  }

  private setHoverMaterial(mesh: Mesh): void {
    this.isHovering = true;
    mesh.layers.enable(1);
  }

  private clearHoverMaterial(mesh: Mesh): void {
    this.isHovering = false;
    mesh.layers.disable(1);
  }
}
