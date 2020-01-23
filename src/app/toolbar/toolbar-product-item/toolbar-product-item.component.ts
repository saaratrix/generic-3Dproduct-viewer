import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ProductItem } from "../../3D/models/ProductItem";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { ProductConfigurationEvent } from "../../product-configurator-events";

@Component({
  selector: "app-toolbar-product-item",
  templateUrl: "./toolbar-product-item.component.html",
  styleUrls: ["./toolbar-product-item.component.scss"]
})
export class ToolbarProductItemComponent implements OnInit {

  @Input()
  public item: ProductItem;

  @ViewChild("containerElement")
  containerRef !: ElementRef;

  constructor(public productConfiguratorService: ProductConfiguratorService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // We need to only do this for the selectedProduct.
    // Otherwise the last product would be the selectedProductELementRef.
    // It's only an issue if the start item has subproducts, otherwise it'd fix itself in the changeProduct() method.
    // TODO: Improve this flow by passing this component's element to the sub items somehow? So selectedProductElementRef is obsolete.
    if (this.productConfiguratorService.selectedProduct === this.item) {
      this.productConfiguratorService.selectedProductElementRef = this.containerRef;
    }
  }

  changeProduct() {
    this.productConfiguratorService.selectedProductElementRef = this.containerRef;
    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Toolbar_ChangeProduct, this.item);
  }
}
