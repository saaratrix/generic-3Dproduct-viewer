import type { OnInit } from "@angular/core";
import { Component, Input } from "@angular/core";
import type { Mesh } from "three";
import { Color } from "three";
import { throttle } from "../../utility/throttle-decorator";
import { getMaterialsFromMesh, setMaterialParameters } from "../../3D/utility/MaterialUtility";
import type { ProductConfiguratorService } from "../../product-configurator.service";
import { clearEvents } from "../../3D/utility/ProductItemUtility";
import { ActiveProductItemEventType } from "../../3D/models/product-item/ActiveProductItemEventType";

@Component({
  selector: "sidebar-free-color",
  templateUrl: "./sidebar-free-color.component.html",
  styleUrls: ["./sidebar-free-color.component.scss"],
})
export class SidebarFreeColorComponent implements OnInit {
  @Input() mesh!: Mesh;

  initialColor: string = "";

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) { }

  ngOnInit(): void {
    const materials = getMaterialsFromMesh(this.mesh);
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
