import { Component } from "@angular/core";

import * as THREE from "three";

import { ProductConfigurator } from "./3D/ProductConfigurator";
import { ProductConfiguratorService } from "./product-configurator.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "product-configurator";

  constructor(private productConfiguratorService: ProductConfiguratorService) {
  }

  public onSceneInit(renderer: THREE.WebGLRenderer) {
    const productConfigurator = new ProductConfigurator(renderer, this.productConfiguratorService);
  }
}
