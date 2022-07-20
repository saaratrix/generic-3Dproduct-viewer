import type { OnInit } from "@angular/core";
import { Component, Input } from "@angular/core";
import { Color } from "three";
import { throttle } from "../../utility/throttle-decorator";
import { getMaterialsFromObject, setMaterialParameters } from "../../3D/utility/MaterialUtility";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { clearEvents } from "../../3D/utility/ProductItemUtility";
import { ActiveProductItemEventType } from "../../3D/models/product-item/ActiveProductItemEventType";
import type { PolygonalObject3D } from "../../3D/3rd-party/three/polygonal-object-3D";

@Component({
  selector: "sidebar-free-color",
  templateUrl: "./sidebar-free-color.component.html",
  styleUrls: ["./sidebar-free-color.component.scss"],
})
export class SidebarFreeColorComponent implements OnInit {
  @Input() object!: PolygonalObject3D;

  initialColor: string = "";

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) { }

  ngOnInit(): void {
    const materials = getMaterialsFromObject(this.object);
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

    setMaterialParameters(this.object, {
      color: new Color(hexColor),
    });
  }
}
