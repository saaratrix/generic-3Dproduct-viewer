import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { SubProductItem } from "../../3D/models/SubProductItem";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { ProductItem } from "../../3D/models/ProductItem";

@Component({
  selector: "app-toolbar-subitem-container",
  templateUrl: "./toolbar-subitem-container.component.html",
  styleUrls: ["./toolbar-subitem-container.component.scss"]
})
export class ToolbarSubitemContainerComponent implements OnInit, AfterViewInit {

  private productConfiguratorService: ProductConfiguratorService;

  @Input()
  public productItem: ProductItem;

  @ViewChild("containerElement")
  containerRef !: ElementRef;

  @ViewChild("subItemsElement")
  subItemsElement !: ElementRef;

  constructor(productConfiguratorService: ProductConfiguratorService) {
    this.productConfiguratorService = productConfiguratorService;
  }

  ngOnInit() {
  }

  // Need to wait until after viewInit or the subItemsElement's width is 0.
  ngAfterViewInit() {
    this.calculatePosition();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.calculatePosition();
  }

  /**
   * Calculate the position for the sub items element so it's centered on top of the selected product.
   */
  calculatePosition() {
    const subItemsElement = this.subItemsElement.nativeElement as HTMLElement;
    const subItemContainerWidth = subItemsElement.offsetWidth;

    const containerElement = this.containerRef.nativeElement as HTMLElement;
    const containerWidth = containerElement.offsetWidth;

    // If the subItemContainerWidth is larger than the container then don't manually place it.
    if (subItemContainerWidth > containerWidth) {
      subItemsElement.style.left = "";
      return;
    }

    const productElementRef = this.productConfiguratorService.selectedProductElementRef;

    const element = productElementRef.nativeElement as HTMLElement;
    const productRect: ClientRect = element.getBoundingClientRect();

    let positionX = (productRect.left + productRect.width * 0.5) - subItemContainerWidth * 0.5;

    // Calculate right side so we can check if it's outside containerWidth.
    // If it goes outside the right box it'd cause scrolling horizontally to happen and that's bad!
    const rightSide = positionX + subItemContainerWidth;

    if (rightSide > containerWidth) {
      positionX -= rightSide - containerWidth;
    }

    subItemsElement.style.left = positionX + "px";
  }

}
