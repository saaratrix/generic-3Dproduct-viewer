import { Injectable,  } from "@angular/core";
import { Subject } from "rxjs";
import { ProductItem } from "./3D/models/ProductItem";

export enum ProductConfigurationEvent {
  Loading_Started,
  Loading_Finished,
  Toolbar_ChangeProduct
}

@Injectable({
  providedIn: "root"
})
export class ProductConfiguratorService {
  /**
   * The product items that you can choose between.
   */
  public items: ProductItem[] = [];
  public selectedProduct: ProductItem = null;

  public loadingStartedSubject: Subject<any> = new Subject<any>();
  public loadingFinishedSubject: Subject<any> = new Subject<any>();
  public toolbarChangeProductSubject: Subject<any> = new Subject<any>();

  /**
   * The RxJs Subject objects.
   */
  private readonly subjects: { [s: number]: Subject<any> };

  constructor() {
    let id = 0;

    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_pot.png",
      filename: "assets/models/flowerpot.obj",
      materialInfo: {
        mtl: "assets/models/flowerpot.mtl",
        renderBackface: true
      },
      hasFloor: false,
      useGammaSpace: false,
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_rose.png",
      filename: "assets/models/rose.obj",
      materialInfo: {
        diffuseTexture: "assets/models/rose.png",
        normalTexture: "assets/models/rosenormal.png",
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: false,
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_wuffels.png",
      filename: "assets/models/wuffels.obj",
      materialInfo: {
        diffuseTexture: "assets/models/wuffels.png",
        renderBackface: false,
      },
      hasFloor: true,
      useGammaSpace: false,
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/pbr/thumbnail_wayfair_table.png",
      filename: "assets/models/pbr/Waifair_table.gltf",
      materialInfo: {
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: true,
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/pbr/thumbnail_wayfair_chair.png",
      filename: "assets/models/pbr/Waifair_chair.gltf",
      materialInfo: {
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: true,
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/pbr/thumbnail_ikea_chair.png",
      filename: "assets/models/pbr/IKEA_chear.gltf",
      materialInfo: {
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: true,
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/pbr/thumbnail_ikea_table.png",
      filename: "assets/models/pbr/IKEA_table.gltf",
      materialInfo: {
        renderBackface: false
      },
      hasFloor: false,
      useGammaSpace: true,
    });

    this.subjects = {};
    this.subjects[ ProductConfigurationEvent.Loading_Started ] = this.loadingStartedSubject;
    this.subjects[ ProductConfigurationEvent.Loading_Finished ] = this.loadingFinishedSubject;
    this.subjects[ ProductConfigurationEvent.Toolbar_ChangeProduct ] = this.toolbarChangeProductSubject;
  }

  public dispatch(type: ProductConfigurationEvent, data?: any ) {
    if (!this.subjects[type]) {
      return;
    }

    this.subjects[type].next(data);
  }
}
