import type { OnDestroy, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { ProductConfiguratorService } from "../product-configurator.service";
import type { Subscription } from "rxjs";

interface LoadingData {
  loaded: number;
  total: number;
}

@Component({
  selector: "app-loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  styleUrls: ["./loading-spinner.component.scss"],
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  /**
   * This is to map the array with a key to easily check if it exists or not.
   */
  private loadingsMap: Record<number, LoadingData> = {};
  /**
   * To easily iterate over the different loadings that can happen at once.
   */
  private loadings: LoadingData[] = [];
  // Default to 0%
  public progressText: string = "0%";

  private progressSubscription: Subscription | undefined;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) {}

  public ngOnInit(): void {
    this.progressSubscription = this.productConfiguratorService.loadingProgress.subscribe(event => {
      let loadingData: LoadingData = this.loadingsMap[event.id];

      if (!loadingData) {
        loadingData = {
          loaded: event.loaded,
          total: event.total,
        };

        this.loadingsMap[event.id] = loadingData;
        this.loadings.push(loadingData);
      } else {
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

  public ngOnDestroy(): void {
    this.progressSubscription?.unsubscribe();
    this.progressSubscription = undefined;
  }
}
