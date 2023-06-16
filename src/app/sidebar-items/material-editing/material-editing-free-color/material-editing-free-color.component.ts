import type { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Color } from 'three';
import { throttle } from '../../../utility/throttle-decorator';
import { getMaterialsFromObject, setMaterialParameters } from '../../../3D/utility/material-utility';
import { ProductConfiguratorService } from '../../../shared/product-configurator.service';
import { clearEvents } from '../../../3D/utility/product-item-event-utility';
import { ActiveProductItemEventType } from '../../../3D/models/product-item/active-product-item-event-type';
import type { PolygonalObject3D } from '../../../3D/3rd-party/three/types/polygonal-object-3D';
import type { HexColor } from '../../../shared/models/hex-color';
import type { SidebarItem } from '../../../sidebar/sidebar-item';
import { getRelatedObjects } from '../../../3D/picking/get-related-objects';

@Component({
  selector: 'material-editing-free-color',
  templateUrl: './material-editing-free-color.component.html',
  styleUrls: ['./material-editing-free-color.component.scss'],
})
export class MaterialEditingFreeColorComponent implements OnInit, SidebarItem {
  @Input() object3D!: PolygonalObject3D;

  initialColor: HexColor | '' = '';

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) { }

  ngOnInit(): void {
    const materials = getMaterialsFromObject(this.object3D);
    for (const material of materials) {
      if ('color' in material) {
        const color = material['color'] as Color;
        this.initialColor = `#${color.getHexString()}`;
        break;
      }
    }
  }

  @throttle(100)
  public colorChanged(event: Event): void {
    const hexColor = (<HTMLInputElement> event.target).value as HexColor;
    clearEvents(this.productConfiguratorService.selectedProduct!, [ActiveProductItemEventType.ColorChange], true);

    const objects = [this.object3D, ...getRelatedObjects(this.object3D, 'material-editing-free')];

    for (const object of objects) {
      setMaterialParameters(object, {
        color: new Color(hexColor),
      });
    }
  }
}
