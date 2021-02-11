import { Component, Input, NgZone, OnInit } from "@angular/core";
import { Color, Mesh } from "three";
import { SelectableObject3DUserData } from "../../3D/models/SelectableMeshesOptions/SelectableObject3DUserData";
import { SelectedSpecificColorsValue } from "../../3D/models/SelectableMeshesOptions/SelectedSpecificColorsValue";
import { getMaterialsFromMesh, getMaterialsFromMeshes } from "../../3D/utility/MaterialUtility";
import { MaterialAnimationType } from "../../3D/MaterialAnimators/MaterialAnimationType";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { ProductConfigurationEvent } from "../../product-configurator-events";
import { MaterialColorSwapEventData } from "../../3D/models/EventData/MaterialColorSwapEventData";

@Component({
  selector: "sidebar-specific-colors",
  templateUrl: "./sidebar-specific-colors.component.html",
  styleUrls: ["./sidebar-specific-colors.component.scss"],
})
export class SidebarSpecificColorsComponent implements OnInit {
  @Input() mesh!: Mesh;

  isColorValues: boolean = true;
  currentValue: string = "";
  // The color or texture values.
  // Color values are in hex form #badbad
  // Texture values are the texture urls.
  values: string[] = [];

  private animationType: MaterialAnimationType = MaterialAnimationType.None;

  constructor(
    private productConfigurationService: ProductConfiguratorService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    const userdata = this.mesh.userData as SelectableObject3DUserData;
    const values = userdata.selectableMeshesOption.value as SelectedSpecificColorsValue;

    if (values.colors) {
      this.isColorValues = true;
      this.values = values.colors;
      this.setCurrentColorValue();
    } else if (values.textures) {
      this.isColorValues = false;
      this.values = values.textures;
      this.setCurrentTextureValue();
    } else {
      this.values = [];
    }

    this.animationType = values.animationType;
  }

  private setCurrentColorValue(): void {
    const materials = getMaterialsFromMesh(this.mesh);
    for (const material of materials) {
      const color = material["color"] as Color;
      if (color) {
        this.currentValue = `#${color.getHexString()}`;
        break;
      }
    }
  }

  private setCurrentTextureValue(): void {

  }

  /**
   * Color value in hexadecimal form.
   * @param value
   */
  public changeCurrentColor(value: string): void {
    if (value === this.currentValue) {
      return;
    }

    const userData = this.mesh.userData as SelectableObject3DUserData;
    const meshes = [this.mesh];
    if (userData.siblings) {
      meshes.push(...userData.siblings);
    }

    const materials = getMaterialsFromMeshes(meshes);

    this.currentValue = value;
    // Run this outside angular or it'll do angular things calls before & after each animation frame.
    this.ngZone.runOutsideAngular(() => {
      this.productConfigurationService.dispatch<MaterialColorSwapEventData>(ProductConfigurationEvent.Material_ColorSwap, {
        animationType: this.animationType,
        materials,
        targetColor: new Color(value),
        productItem: this.productConfigurationService.selectedProduct!,
      });
    });
  }

  public changeCurrentTexture(value: string): void {

  }
}
