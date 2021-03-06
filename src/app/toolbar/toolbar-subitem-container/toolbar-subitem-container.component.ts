import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { SubProductItem } from "../../3D/models/ProductItem/SubProductItem";
import { ProductConfiguratorService } from "../../product-configurator.service";
import { ProductItem } from "../../3D/models/ProductItem/ProductItem";
import { throttle } from "../../utility/throttle-decorator";

@Component({
  selector: "app-toolbar-subitem-container",
  templateUrl: "./toolbar-subitem-container.component.html",
  styleUrls: ["./toolbar-subitem-container.component.scss"]
})
export class ToolbarSubitemContainerComponent implements OnChanges, AfterViewInit {
  @ViewChild("containerElement") containerRef!: ElementRef<HTMLElement>;
  @ViewChild("subItemsElement") subItemsElement!: ElementRef<HTMLElement>;

  @Input() public productItem!: ProductItem;

  private isViewInitialized = false;
  private productItemElement: HTMLElement | undefined;

  constructor(
    private productConfiguratorService: ProductConfiguratorService
  ) {
    this.productConfiguratorService = productConfiguratorService;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isViewInitialized && changes.productItem) {
      this.productItemElement = this.productConfiguratorService.getSelectedProductElement(this.productItem);
      this.calculatePosition();
    }
  }

  public ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.productItemElement = this.productConfiguratorService.getSelectedProductElement(this.productItem);
    this.calculatePosition();
  }

  @HostListener("window:resize", [])
  @throttle(1000 / 60)
  onResize(): void {
    this.calculatePosition();
  }

  /**
   * Calculate the position for the sub items element so it's centered on top of the selected product.
   */
  calculatePosition(): void {
    if (!this.productItemElement) {
      return;
    }

    const subItemsElement = this.subItemsElement.nativeElement;
    const subItemContainerWidth = subItemsElement.offsetWidth;

    const containerElement = this.containerRef.nativeElement;
    const containerWidth = containerElement.offsetWidth;

    // If the subItemContainerWidth is larger than the container then don't manually place it.
    if (subItemContainerWidth > containerWidth) {
      subItemsElement.style.left = "";
      return;
    }

    const productRect: ClientRect = this.productItemElement.getBoundingClientRect();

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
