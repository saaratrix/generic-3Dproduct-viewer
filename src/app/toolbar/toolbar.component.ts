import type { OnDestroy, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { ProductConfiguratorService } from "../product-configurator.service";
import type { Subscription } from "rxjs";
import type { ProductItem } from "../3D/models/product-item/product-item";


@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent implements OnInit, OnDestroy {

  public hasReadInstructions: boolean = false;
  public selectedProduct: ProductItem | undefined;
  public hasSubItems: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public productConfiguratorService: ProductConfiguratorService,
  ) { }

  public ngOnInit(): void {
    const hasTutorialItem = localStorage?.getItem("tutorial");
    if (hasTutorialItem && hasTutorialItem === "1") {
      this.hasReadInstructions = true;
    }

    this.subscriptions.push(
      this.productConfiguratorService.selectedProductChanged.subscribe(product => {
        this.selectedProduct = product;
        this.hasSubItems = !!(product.subItems?.length > 0 && product.object3D);
      }),
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }

}
