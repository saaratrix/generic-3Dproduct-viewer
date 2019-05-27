import { Component, OnInit } from "@angular/core";
import { ProductConfigurationEvent, ProductConfiguratorService } from "../product-configurator.service";
import { LoadingProgressEventData } from "../3D/models/EventData/LoadingProgressEventData";
import { load } from "@angular/core/src/render3";

interface LoadingData {
  loaded: number;
  total: number;
}

@Component({
  selector: "app-loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  styleUrls: ["./loading-spinner.component.scss"]
})
export class LoadingSpinnerComponent implements OnInit {

  private productConfiguratorService: ProductConfiguratorService;
  /**
   * This is to map the array with a key to easily check if it exists or not.
   */
  private loadingsMap: { [key: number]: LoadingData } = {};
  /**
   * To easily iterate over the different loadings that can happen at once.
   */
  private loadings: LoadingData[] = [];
  // Default to 0%
  public progressText: string = "0%";

  constructor(productConfiguratorService: ProductConfiguratorService) {
    this.productConfiguratorService = productConfiguratorService;

    this.productConfiguratorService.getSubject(ProductConfigurationEvent.Loading_Progress)
      .subscribe((event: LoadingProgressEventData) => {

        let loadingData: LoadingData = this.loadingsMap[ event.id ];

        if (!loadingData) {
          loadingData = {
            loaded: event.loaded,
            total: event.total
          };

          this.loadingsMap[ event.id ] = loadingData;
          this.loadings.push(loadingData);
        }
        else {
          loadingData.loaded = event.loaded;
          loadingData.total = event.total;
        }

        let loaded = 0;
        let total = 0;
        for (const data of this.loadings) {
          loaded += data.loaded;
          total += data.total;
        }
        // Can't divide by 0.
        if (total === 0) {
          return;
        }

        // 0-2 decimals is fine but 0, 1, 2, 3 does look better than 1.23% and is precise enough.
        const progress = ((loaded / total) * 100).toFixed(0);
        this.progressText = `${progress}%`;
      });
  }

  ngOnInit() {
  }

}
