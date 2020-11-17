import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Subscription } from "rxjs";
import {
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect";


export class SelectedProductHighlighter {

  private subscriptions: Subscription[] = [];

  private isHovering: boolean = false;
  public outlineEffect!: OutlineEffect;

  constructor(renderer: WebGLRenderer, private productConfiguratorService: ProductConfiguratorService) {
    this.createOutlineEffect(renderer);
    this.subscriptions.push(
      this.productConfiguratorService.getSubject<Mesh>(ProductConfigurationEvent.Mesh_PointerEnter).subscribe((mesh) => {
        this.setHoverMaterial(mesh);
      }),
      this.productConfiguratorService.getSubject<Mesh>(ProductConfigurationEvent.Mesh_PointerLeave).subscribe((mesh) => {
        this.clearHoverMaterial(mesh);
      }),
    );
  }

  dispose(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public renderOutline(scene: Scene, camera: PerspectiveCamera) {
    if (!this.isHovering) {
      return;
    }

    camera.layers.set(1);
    this.outlineEffect.renderOutline(scene, camera);
    camera.layers.set(0);
  }

  private createOutlineEffect(renderer: WebGLRenderer): void {
    this.outlineEffect = new OutlineEffect(renderer, {
      // #b591c7
      defaultColor: [181 / 255,   145 / 255,   199 / 255],  // default: [0, 0, 0],
      defaultThickness: 0.005,                              // default: 0.003
    });
  }

  private setHoverMaterial(mesh: Mesh) {
    this.isHovering = true;
    mesh.layers.enable(1);
  }

  private clearHoverMaterial(mesh: Mesh) {
    this.isHovering = false;
    mesh.layers.disable(1);
  }
}
