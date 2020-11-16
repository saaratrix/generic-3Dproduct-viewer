import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Subscription } from "rxjs";
import { Color, DoubleSide, Mesh, MeshStandardMaterial } from "three";

export class SelectedProductHighlighter {

  private subscriptions: Subscription[] = [];

  private hoverMaterial: MeshStandardMaterial;


  constructor(private productConfiguratorService: ProductConfiguratorService) {
    // TODO: Add an outline effect instead of change colour as that would probably look much better.
    this.hoverMaterial = new MeshStandardMaterial({
      color: Color.NAMES["purple"],
      side: DoubleSide,
    });

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

  setHoverMaterial(mesh: Mesh) {
    if (mesh.material !== this.hoverMaterial) {
      mesh.userData.originalMaterial = mesh.material;
    }
    if (Array.isArray(mesh.material)) {
      mesh.material = new Array<MeshStandardMaterial>(mesh.material.length);
      for (let i = 0; i < mesh.material.length; i++) {
        mesh.material[i] = this.hoverMaterial;
      }
    } else {
      mesh.material = this.hoverMaterial;
    }
  }

  clearHoverMaterial(mesh: Mesh) {
    mesh.material = mesh.userData.originalMaterial;
  }
}
