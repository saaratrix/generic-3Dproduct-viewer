import { Component, Input, NgZone, OnInit } from "@angular/core";
import { Mesh, Texture } from "three";
import { SelectedSpecificTexture } from "../../3D/models/selectable-meshes-options/SelectedSpecificTexture";
import { MaterialAnimationType } from "../../3D/material-animators/MaterialAnimationType";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { SelectableObject3DUserData } from "../../3D/models/selectable-meshes-options/SelectableObject3DUserData";
import { getMaterialsFromMesh, getMaterialsFromMeshes } from "../../3D/utility/MaterialUtility";
import { ProductConfigurationEvent } from "../../product-configurator-events";
import { MaterialTextureSwapEventData } from "../../3D/models/event-data/MaterialTextureSwapEventData";
import { SelectedSpecificTexturesValue } from "../../3D/models/selectable-meshes-options/SelectedSpecificTexturesValue";

@Component({
  selector: "sidebar-specific-texture",
  templateUrl: "./sidebar-specific-texture.component.html",
  styleUrls: ["./sidebar-specific-texture.component.scss"]
})
export class SidebarSpecificTextureComponent implements OnInit {
  @Input() mesh!: Mesh;

  currentValue: string = "";
  // Texture values are the texture urls.
  values: SelectedSpecificTexture[] = [];

  private animationType: MaterialAnimationType = MaterialAnimationType.None;
  public loadingValues: Record<string, boolean> = {};

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    const userdata = this.mesh.userData as SelectableObject3DUserData;
    const values = userdata.selectableMeshesOption.value as SelectedSpecificTexturesValue;

    if (values.textures) {
      this.values = values.textures;
    } else {
      this.values = [];
    }

    this.setCurrentTextureValue();
    this.animationType = values.animationType;
  }

  private setCurrentTextureValue(): void {
    const materials = getMaterialsFromMesh(this.mesh);
    let imageSrc: string = "";
    this.currentValue = "";
    if (this.values.length === 0) {
      return;
    }

    for (const material of materials) {
      const texture = material["map"] as Texture;
      if (texture) {
        imageSrc = texture.image.src ?? "";
        break;
      }
    }

    if (!imageSrc) {
      return;
    }

    for (const texture of this.values) {
      // imageSrc could be localhost:4200/asset/url.png
      // texture.url could be asset/url.png
      if (imageSrc.includes(texture.url) || imageSrc.includes(texture.thumbnail)) {
        this.currentValue = texture.url;
        break;
      }
    }
  }

  public changeCurrentTexture(value: string): void {
    if (value === this.currentValue) {
      return;
    }

    this.currentValue = value;
    this.loadingValues[value] = true;

    const userData = this.mesh.userData as SelectableObject3DUserData;
    const meshes = [this.mesh];
    if (userData.siblings) {
      meshes.push(...userData.siblings);
    }

    const materials = getMaterialsFromMeshes(meshes);
    const onLoaded = (): void => {
      this.ngZone.run(() => {
        delete this.loadingValues[value];
      });
    };

    this.ngZone.runOutsideAngular(() => {
      this.productConfiguratorService.dispatch<MaterialTextureSwapEventData>(ProductConfigurationEvent.Material_TextureSwap, {
        addGlobalLoadingEvent: false,
        animationType: this.animationType,
        materials,
        onLoaded,
        productItem: this.productConfiguratorService.selectedProduct!,
        textureSlot: "map",
        textureUrl: value,
      });
    });
  }

}
