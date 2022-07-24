import { Component, Input } from "@angular/core";
import type { SubProductItem } from "../../3D/models/product-item/sub-product-item";
import { ProductConfiguratorService } from "../../product-configurator.service";
import type { ProductItem } from "../../3D/models/product-item/product-item";

@Component({
  selector: "app-toolbar-subitem",
  templateUrl: "./toolbar-subitem.component.html",
  styleUrls: ["./toolbar-subitem.component.scss"],
})
export class ToolbarSubitemComponent {

  @Input() public item!: SubProductItem;
  @Input() public productItem!: ProductItem;

  private productConfiguratorService: ProductConfiguratorService;

  constructor(productConfiguratorService: ProductConfiguratorService) {
    this.productConfiguratorService = productConfiguratorService;
  }

  public clicked(): void {
    this.productItem.selectedSubItem = this.item;
    this.productConfiguratorService.dispatch(this.item.eventType, this.item.data);
  }
}
