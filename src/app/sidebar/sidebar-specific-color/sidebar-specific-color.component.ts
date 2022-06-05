import { Component, Input, NgZone, OnInit } from "@angular/core";
import { Color, Mesh } from "three";
import { SelectableObject3DUserData } from "../../3D/models/selectable-meshes-options/SelectableObject3DUserData";
import { SelectedSpecificColorsValue } from "../../3D/models/selectable-meshes-options/SelectedSpecificColorsValue";
import { getMaterialsFromMesh, getMaterialsFromMeshes } from "../../3D/utility/MaterialUtility";
import { MaterialAnimationType } from "../../3D/material-animators/MaterialAnimationType";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { clearEvents } from "../../3D/utility/ProductItemUtility";
import { ActiveProductItemEventType } from "../../3D/models/product-item/ActiveProductItemEventType";

@Component({
  selector: "sidebar-specific-color",
  templateUrl: "./sidebar-specific-color.component.html",
  styleUrls: ["./sidebar-specific-color.component.scss"],
})
export class SidebarSpecificColorComponent implements OnInit {
  @Input() mesh!: Mesh;

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
    const userdata = this.mesh.userData as SelectableObject3DUserData;
    const values = userdata.selectableMeshesOption.value as SelectedSpecificColorsValue;

    if (values.colors) {
      this.values = values.colors;
    } else {
      this.values = [];
    }

    this.setCurrentColorValue();
    this.animationType = values.animationType;
  }

  private setCurrentColorValue(): void {
    const materials = getMaterialsFromMesh(this.mesh);
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

    const userData = this.mesh.userData as SelectableObject3DUserData;
    const meshes = [this.mesh];
    if (userData.siblings) {
      meshes.push(...userData.siblings);
    }

    const materials = getMaterialsFromMeshes(meshes);

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
