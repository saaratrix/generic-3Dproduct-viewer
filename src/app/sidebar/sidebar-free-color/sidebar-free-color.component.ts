import { Component, Input, OnInit } from "@angular/core";
import { Color, Mesh } from "three";
import { throttle } from "../../utility/throttle-decorator";
import { isMeshPhongMaterial, isMeshStandardMaterial } from "../../3D/utility/MaterialUtility";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { clearEvents } from "../../3D/utility/ProductItemUtility";
import { ActiveProductItemEventType } from "../../3D/models/ProductItem/ActiveProductItemEventType";

@Component({
  selector: "sidebar-free-color",
  templateUrl: "./sidebar-free-color.component.html",
  styleUrls: ["./sidebar-free-color.component.scss"]
})
export class SidebarFreeColorComponent implements OnInit {
  @Input() mesh!: Mesh;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) { }

  ngOnInit(): void {
  }

  @throttle(100)
  public colorChanged(event: Event): void {
    // Example: #ffffff
    const hexColor = (<HTMLInputElement> event.target).value;
    clearEvents(this.productConfiguratorService.selectedProduct!, [ActiveProductItemEventType.ColorChange], true);

    const materials = Array.isArray(this.mesh.material) ? this.mesh.material : [this.mesh.material];
    for (const material of materials) {
      if (isMeshStandardMaterial(material) || isMeshPhongMaterial(material)) {
        material.color = new Color(hexColor);
      }
    }
  }
}
