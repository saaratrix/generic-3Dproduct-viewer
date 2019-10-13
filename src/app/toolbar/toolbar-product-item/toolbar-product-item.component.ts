import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ProductItem } from "../../3D/models/ProductItem";
import { ProductConfigurationEvent, ProductConfiguratorService } from "../../product-configurator.service";


@Component({
  selector: "app-toolbar-product-item",
  templateUrl: "./toolbar-product-item.component.html",
  styleUrls: ["./toolbar-product-item.component.scss"]
})
export class ToolbarProductItemComponent implements OnInit {

  @Input()
  public item: ProductItem;

  @ViewChild("containerElement", {static: false})
  containerRef !: ElementRef;

  constructor(public productConfiguratorService: ProductConfiguratorService) {
  }

  ngOnInit() {
  }

  changeProduct() {
    this.productConfiguratorService.selectedProductElementRef = this.containerRef;
    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Toolbar_ChangeProduct, this.item);
  }
}
