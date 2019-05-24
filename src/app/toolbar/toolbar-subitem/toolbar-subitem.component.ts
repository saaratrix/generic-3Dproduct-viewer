import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { SubProductItem } from "../../3D/models/SubProductItem";
import { ProductConfiguratorService } from "../../product-configurator.service";

@Component({
  selector: "app-toolbar-subitem",
  templateUrl: "./toolbar-subitem.component.html",
  styleUrls: ["./toolbar-subitem.component.scss"]
})
export class ToolbarSubitemComponent implements OnInit {

  private productConfiguratorService: ProductConfiguratorService;

  @Input()
  public item: SubProductItem;

  @Input()
  public parentElementRef: ElementRef;

  constructor(productConfiguratorService: ProductConfiguratorService) {
    this.productConfiguratorService = productConfiguratorService;
  }

  ngOnInit() {
  }

  public clicked(): void {
    this.productConfiguratorService.dispatch(this.item.eventType, this.item.data);
  }

}
