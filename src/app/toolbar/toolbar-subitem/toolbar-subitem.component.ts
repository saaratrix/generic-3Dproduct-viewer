import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { SubProductItem } from "../../3D/models/ProductItem/SubProductItem";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { ProductItem } from "../../3D/models/ProductItem/ProductItem";

@Component({
  selector: "app-toolbar-subitem",
  templateUrl: "./toolbar-subitem.component.html",
  styleUrls: ["./toolbar-subitem.component.scss"]
})
export class ToolbarSubitemComponent implements OnInit {

  @Input() public item!: SubProductItem;
  @Input() public productItem!: ProductItem;

  private productConfiguratorService: ProductConfiguratorService;

  constructor(productConfiguratorService: ProductConfiguratorService) {
    this.productConfiguratorService = productConfiguratorService;
  }

  public ngOnInit(): void {
  }

  public clicked(): void {
    this.productItem.selectedSubItem = this.item;
    this.productConfiguratorService.dispatch(this.item.eventType, this.item.data);
  }
}
