import type { ElementRef, AfterViewInit } from '@angular/core';
import { Component, Input, ViewChild } from '@angular/core';
import type { ProductItem } from '../../3D/models/product-item/product-item';
import { ProductConfiguratorService } from '../../shared/product-configurator.service';

@Component({
  selector: 'app-toolbar-product-item',
  templateUrl: './toolbar-product-item.component.html',
  styleUrls: ['./toolbar-product-item.component.scss'],
})
export class ToolbarProductItemComponent implements AfterViewInit {

  @Input() public item!: ProductItem;

  @ViewChild('containerElement') containerRef!: ElementRef<HTMLElement>;

  constructor(
    public productConfiguratorService: ProductConfiguratorService,
  ) { }

  public ngAfterViewInit(): void {
    this.productConfiguratorService.itemElements[this.item.name] = this.containerRef.nativeElement;
  }

  public changeProduct(): void {
    this.productConfiguratorService.toolbarChangeProduct.next(this.item);
  }
}
