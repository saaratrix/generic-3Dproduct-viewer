import { NgZone, OnInit } from "@angular/core";
import { Component, Input } from "@angular/core";
import { Color } from "three";
import type { SelectableObject3DUserData } from "../../3D/models/selectable-object-3ds-options/SelectableObject3DUserData";
import type { SelectedSpecificColorsValue } from "../../3D/models/selectable-object-3ds-options/SelectedSpecificColorsValue";
import { getMaterialsFromObject, getMaterialsFromObjects } from "../../3D/utility/MaterialUtility";
import { MaterialAnimationType } from "../../3D/material-animators/MaterialAnimationType";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { clearEvents } from "../../3D/utility/ProductItemUtility";
import { ActiveProductItemEventType } from "../../3D/models/product-item/ActiveProductItemEventType";
import type { PolygonalObject3D } from "../../3D/3rd-party/three/polygonal-object-3D";

@Component({
  selector: "sidebar-specific-color",
  templateUrl: "./sidebar-specific-color.component.html",
  styleUrls: ["./sidebar-specific-color.component.scss"],
})
export class SidebarSpecificColorComponent implements OnInit {
  @Input() object!: PolygonalObject3D;

  currentValue: string = "";
  // The color or texture values.
  // Color values are in hex form #badbad
  // Texture values are the texture urls.
  values: string[] = [];

  private animationType: MaterialAnimationType = MaterialAnimationType.None;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    const userdata = this.object.userData as SelectableObject3DUserData;
    const values = userdata.selectableObjectsOption.value as SelectedSpecificColorsValue;

    if (values.colors) {
      this.values = values.colors;
    } else {
      this.values = [];
    }

    this.setCurrentColorValue();
    this.animationType = values.animationType;
  }

  private setCurrentColorValue(): void {
    const materials = getMaterialsFromObject(this.object);
    this.currentValue = "";
    for (const material of materials) {
      const color = material["color"] as Color;
      if (color) {
        this.currentValue = `#${color.getHexString()}`;
        break;
      }
    }
  }

  /**
   * Color value in hexadecimal form.
   * @param value
   */
  public changeCurrentColor(value: string): void {
    if (value === this.currentValue) {
      return;
    }
    clearEvents(this.productConfiguratorService.selectedProduct!, [ActiveProductItemEventType.ColorChange], true);

    const userData = this.object.userData as SelectableObject3DUserData;
    const objects = [this.object];
    if (userData.related) {
      objects.push(...userData.related);
    }

    const materials = getMaterialsFromObjects(objects);

    this.currentValue = value;
    // Run this outside angular or it'll do angular things calls before & after each animation frame.
    this.ngZone.runOutsideAngular(() => {
      this.productConfiguratorService.materialColorSwap.next({
        animationType: this.animationType,
        materials,
        targetColor: new Color(value),
        productItem: this.productConfiguratorService.selectedProduct!,
      });
    });
  }
}
