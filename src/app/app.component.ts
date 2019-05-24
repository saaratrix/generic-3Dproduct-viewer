import { Component } from "@angular/core";

import * as THREE from "three";

import { ProductConfigurator } from "./3D/ProductConfigurator";
import { ProductConfigurationEvent, ProductConfiguratorService } from "./product-configurator.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "product-configurator";

  public loadingsStarted: number = 0;
  public loadingsFinished: number = 0;

  constructor(private productConfiguratorService: ProductConfiguratorService) {
    this.productConfiguratorService.getSubject(ProductConfigurationEvent.Loading_Started)
      .subscribe(() => {
        this.loadingsStarted++;
      });
    this.productConfiguratorService.getSubject(ProductConfigurationEvent.Loading_Finished)
      .subscribe(() => {
        this.loadingsFinished++;
      });
  }

  public onSceneInit(renderer: THREE.WebGLRenderer) {
    const productConfigurator = new ProductConfigurator(renderer, this.productConfiguratorService);
  }
}
