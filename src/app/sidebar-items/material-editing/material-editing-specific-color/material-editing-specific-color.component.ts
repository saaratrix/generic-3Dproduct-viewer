import { NgZone, OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Color } from 'three';
import type { MaterialEditingSpecificColorsModel } from './material-editing-specific-colors.model';
import { getMaterialsFromObject, getMaterialsFromObjects } from '../../../3D/utility/material-utility';
import { MaterialAnimationType } from '../../../3D/material-animators/material-animation-type';
import { ProductConfiguratorService } from '../../../shared/product-configurator.service';
import { clearEvents } from '../../../3D/utility/product-item-event-utility';
import { ActiveProductItemEventType } from '../../../3D/models/product-item/active-product-item-event-type';
import type { PolygonalObject3D } from '../../../3D/3rd-party/three/types/polygonal-object-3D';
import type { SidebarItem } from '../../../sidebar/sidebar-item';
import type { HexColor } from '../../../shared/models/hex-color';
import { getRelatedObjects } from '../../../3D/picking/get-related-objects';

@Component({
  selector: 'material-editing-specific-color',
  templateUrl: './material-editing-specific-color.component.html',
  styleUrls: ['./material-editing-specific-color.component.scss'],
})
export class MaterialEditingSpecificColorComponent implements OnInit, SidebarItem<MaterialEditingSpecificColorsModel> {
  @Input() object3D!: PolygonalObject3D;
  @Input() item!: MaterialEditingSpecificColorsModel;

  currentValue: string = '';
  // The color or texture values.
  // Color values are in hex form #badbad
  // Texture values are the texture urls.
  values: HexColor[] = [];

  private animationType: MaterialAnimationType = MaterialAnimationType.None;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.values = this.item.colors ? this.item.colors : [];

    this.setCurrentColorValue();
    this.animationType = this.item.animationType;
  }

  private setCurrentColorValue(): void {
    const materials = getMaterialsFromObject(this.object3D);
    this.currentValue = '';
    for (const material of materials) {
      if ('color' in material) {
        const color = material['color'] as Color;
        this.currentValue = `#${color.getHexString()}`;
        break;
      }
    }
  }

  /**
   * Color value in hexadecimal form.
   */
  public changeCurrentColor(value: string): void {
    if (value === this.currentValue) {
      return;
    }
    clearEvents(this.productConfiguratorService.selectedProduct!, [ActiveProductItemEventType.ColorChange], true);

    const objects = [this.object3D, ...getRelatedObjects(this.object3D, 'material-editing-specific')];
    const materials = getMaterialsFromObjects(objects);

    this.currentValue = value;
    // Run this outside angular, or it'll do angular things calls before & after each animation frame.
    this.ngZone.runOutsideAngular(() => {
      this.productConfiguratorService.materialColorSwap.next({
        animationType: this.animationType,
        materials,
        targetColor: new Color(value),
        productItem: this.productConfiguratorService.selectedProduct!,
      });
    });
  }
}
