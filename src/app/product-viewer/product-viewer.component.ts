import { ElementRef, NgZone } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ProductConfiguratorService } from '../shared/product-configurator.service';
import { ActivatedRoute, Router } from '@angular/router';
import type * as THREE from 'three';
import { ProductConfigurator } from '../3D/product-configurator';
import { loadMockData } from '../../mockdata/load-mock-data';

@Component({
  selector: 'app-product-viewer',
  templateUrl: './product-viewer.component.html',
  styleUrls: ['./product-viewer.component.scss'],
})
export class ProductViewerComponent {
  @ViewChild('canvasContainer', { static: true }) containerElement!: ElementRef<HTMLDivElement>;

  public loadingsStarted: number = 0;
  public loadingsFinished: number = 0;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
  ) {
    loadMockData(productConfiguratorService);

    this.productConfiguratorService.loadingStarted.subscribe(() => {
      this.loadingsStarted++;
    });

    this.productConfiguratorService.loadingFinished.subscribe(() => {
      this.loadingsFinished++;

      if (this.loadingsFinished === this.loadingsStarted) {
        // Reset the loading states so you can show 0 / 2 models loaded etc.
        // Instead of 6 / 7 if you've loaded them at 4 different times.
        this.loadingsStarted = 0;
        this.loadingsFinished = 0;
      }
    });
  }

  public onSceneInit(renderer: THREE.WebGLRenderer): void {
    let productConfigurator: ProductConfigurator;
    this.zone.runOutsideAngular(() => {
      productConfigurator = new ProductConfigurator(renderer, this.containerElement.nativeElement, this.productConfiguratorService, this.activatedRoute, this.router);
    });
    // Need a set timeout, or it is stuck on loading 0% on page load.
    setTimeout(() => {
      productConfigurator.loadInitialItem();
    }, 1);
  }
}
