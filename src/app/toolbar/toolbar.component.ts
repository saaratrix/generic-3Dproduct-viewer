import { Component, OnDestroy, OnInit } from "@angular/core";
import { ProductConfiguratorService } from "../product-configurator.service";
import { Subscription } from "rxjs";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { ProductItem } from "../3D/models/ProductItem";


@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnDestroy {

  public hasReadInstructions: boolean = false;
  public selectedProduct: ProductItem | undefined;
  public hasSubItems: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public productConfiguratorService: ProductConfiguratorService,
  ) {
    const hasTutorialItem = localStorage && localStorage.getItem("tutorial");
    if (hasTutorialItem && hasTutorialItem === "1") {
      this.hasReadInstructions = true;
    }

    this.subscriptions.push(this.productConfiguratorService.selectedProduct_Changed.subscribe(product => {
      this.selectedProduct = product;
      this.hasSubItems = !!(product.subItems?.length > 0 && product.object3D);
    }));
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }

}
