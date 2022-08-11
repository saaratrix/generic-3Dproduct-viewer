import { Component, OnDestroy, OnInit } from "@angular/core";
import { ProductConfiguratorService } from "../../../product-configurator.service";
import { Subscription } from "rxjs";
import type { ProductItem } from "../../../3D/models/product-item/product-item";
import type { Object3D } from "three";

@Component({
  selector: "hierarchy-tree",
  templateUrl: "./hierarchy-tree.component.html",
  styleUrls: ["./hierarchy-tree.component.scss"],
})
export class HierarchyTreeComponent implements OnInit, OnDestroy {
  rootNode: Object3D | undefined;

  private subscriptions: Subscription = new Subscription();


  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) { }

  ngOnInit(): void {
    this.productConfiguratorService.selectedProductChanged.subscribe((product) => {
      this.setupTree(product);
    });

    if (this.productConfiguratorService.selectedProduct) {
      this.setupTree(this.productConfiguratorService.selectedProduct);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setupTree(product: ProductItem): void {
    this.rootNode = product.object3D;
  }
}
