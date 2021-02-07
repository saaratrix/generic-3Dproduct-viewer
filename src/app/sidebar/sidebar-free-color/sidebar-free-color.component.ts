import { Component, Input, OnInit } from "@angular/core";
import { Color, Mesh } from "three";
import { throttle } from "../../utility/throttle-decorator";
import {
  getMaterials,
  setMaterialParameters
} from "../../3D/utility/MaterialUtility";
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

  initialColor: string = "";

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) { }

  ngOnInit(): void {
    const materials = getMaterials(this.mesh);
    for (const material of materials) {
      const color = material["color"] as Color;
      if (color) {
        this.initialColor = `#${color.getHexString()}`;
        break;
      }
    }
  }

  @throttle(100)
  public colorChanged(event: Event): void {
    // Example: #ffffff
    const hexColor = (<HTMLInputElement> event.target).value;
    clearEvents(this.productConfiguratorService.selectedProduct!, [ActiveProductItemEventType.ColorChange], true);

    setMaterialParameters(this.mesh, {
      color: new Color(hexColor),
    });
  }
}
