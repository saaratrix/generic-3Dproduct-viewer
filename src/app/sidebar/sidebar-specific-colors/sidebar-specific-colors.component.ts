import { Component, Input, OnInit } from "@angular/core";
import { Color, Mesh } from "three";
import { SelectableObject3DUserData } from "../../3D/models/SelectableMeshesOptions/SelectableObject3DUserData";
import { SelectedSpecificColorsValue } from "../../3D/models/SelectableMeshesOptions/SelectedSpecificColorsValue";
import { getMaterials } from "../../3D/utility/MaterialUtility";

@Component({
  selector: "sidebar-specific-colors",
  templateUrl: "./sidebar-specific-colors.component.html",
  styleUrls: ["./sidebar-specific-colors.component.scss"],
})
export class SidebarSpecificColorsComponent implements OnInit {
  @Input() mesh!: Mesh;

  isColorValues: boolean = true;
  currentValue: string = "";
  values: string[] = [];

  constructor() { }

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
  }

  private setCurrentColorValue(): void {
    const materials = getMaterials(this.mesh);
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

}
