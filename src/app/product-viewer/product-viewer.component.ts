import { Component, NgZone, OnInit } from "@angular/core";
import { ProductConfiguratorService } from "../product-configurator.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductConfigurationEvent } from "../product-configurator-events";
import * as THREE from "three";
import { ProductConfigurator } from "../3D/ProductConfigurator";

@Component({
  selector: "app-product-viewer",
  templateUrl: "./product-viewer.component.html",
  styleUrls: ["./product-viewer.component.scss"]
})
export class ProductViewerComponent implements OnInit {
  public loadingsStarted: number = 0;
  public loadingsFinished: number = 0;

  constructor(private productConfiguratorService: ProductConfiguratorService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private zone: NgZone) {

    this.productConfiguratorService.getSubject(ProductConfigurationEvent.Loading_Started)
      .subscribe(() => {
        this.loadingsStarted++;
      });

    this.productConfiguratorService.getSubject(ProductConfigurationEvent.Loading_Finished)
      .subscribe(() => {
        this.loadingsFinished++;

        if (this.loadingsFinished === this.loadingsStarted) {
          // Reset the loading states so you can show 0 / 2 models loaded etc.
          // Instead of 6 / 7 if you've loaded them at 4 different times.
          this.loadingsStarted = 0;
          this.loadingsFinished = 0;
        }
      });
  }

  public ngOnInit(): void {
  }

  public onSceneInit(renderer: THREE.WebGLRenderer) {
    let productConfigurator: ProductConfigurator;
    this.zone.runOutsideAngular(() => {
      productConfigurator = new ProductConfigurator(renderer, this.productConfiguratorService, this.activatedRoute, this.router);
    });
    // Need a set timeout or it is stuck on loading 0% on page load.
    setTimeout(() => {
      productConfigurator.loadInitialItem();
    }, 1);
  }

}
