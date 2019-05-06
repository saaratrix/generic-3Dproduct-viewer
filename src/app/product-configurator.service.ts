import { Injectable,  } from "@angular/core";
import { Subject } from "rxjs";
import { ProductItem } from "./3D/models/ProductItem";

export enum ProductConfigurationEvent {
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

  public toolbarChangeProductSubject: Subject<any> = new Subject();
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
    });
    this.items.push({
      id: id++,
      thumbnail: "assets/models/thumbnail_wuffels.png",
      filename: "assets/models/wuffels.obj",
      materialInfo: {
        diffuseTexture: "assets/models/wuffels.png",
        renderBackface: false
      },
      hasFloor: true,
    });

    this.subjects = {};
    this.subjects[ ProductConfigurationEvent.Toolbar_ChangeProduct ] = this.toolbarChangeProductSubject;
  }

  public dispatch(type: ProductConfigurationEvent, data?: any ) {
    if (!this.subjects[type]) {
      return;
    }

    this.subjects[type].next(data);
  }
}
