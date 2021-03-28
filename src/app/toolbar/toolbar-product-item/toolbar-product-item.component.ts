import { Component, ElementRef, Input, ViewChild, AfterViewInit } from "@angular/core";
import { ProductItem } from "../../3D/models/product-item/ProductItem";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { ProductConfigurationEvent } from "../../product-configurator-events";

@Component({
  selector: "app-toolbar-product-item",
  templateUrl: "./toolbar-product-item.component.html",
  styleUrls: ["./toolbar-product-item.component.scss"],
})
export class ToolbarProductItemComponent implements AfterViewInit {

  @Input() public item!: ProductItem;

  @ViewChild("containerElement") containerRef!: ElementRef<HTMLElement>;

  constructor(
    public productConfiguratorService: ProductConfiguratorService,
  ) { }

  public ngAfterViewInit(): void {
    this.productConfiguratorService.itemElements[this.item.name] = this.containerRef.nativeElement;
  }

  public changeProduct(): void {
    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Toolbar_ChangeProduct, this.item);
  }
}
