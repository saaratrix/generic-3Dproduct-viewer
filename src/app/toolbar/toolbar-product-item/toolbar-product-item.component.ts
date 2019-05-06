import { Component, Input, OnInit } from "@angular/core";
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

  constructor(private productConfiguratorService: ProductConfiguratorService) {
  }

  ngOnInit() {
  }

  changeProduct() {
    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Toolbar_ChangeProduct, this.item);
  }
}
