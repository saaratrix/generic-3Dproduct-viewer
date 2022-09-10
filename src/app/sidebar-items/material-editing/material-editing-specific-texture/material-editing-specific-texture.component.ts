import { NgZone, OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { Texture } from 'three';
import type { SpecificTextureModel } from './specific-texture.model';
import { MaterialAnimationType } from '../../../3D/material-animators/material-animation-type';
import { ProductConfiguratorService } from '../../../shared/product-configurator.service';
import { getMaterialsFromObject, getMaterialsFromObjects } from '../../../3D/utility/material-utility';
import type { MaterialEditingSpecificTexturesModel } from './material-editing-specific-textures.model';
import type { PolygonalObject3D } from '../../../3D/3rd-party/three/types/polygonal-object-3D';
import type { SidebarItem } from '../../../sidebar/sidebar-item';
import { getRelatedObjects } from '../../../3D/interaction/get-related-objects';

@Component({
  selector: 'material-editing-specific-texture',
  templateUrl: './material-editing-specific-texture.component.html',
  styleUrls: ['./material-editing-specific-texture.component.scss'],
})
export class MaterialEditingSpecificTextureComponent implements OnInit, SidebarItem<MaterialEditingSpecificTexturesModel> {
  @Input() object3D!: PolygonalObject3D;
  item!: MaterialEditingSpecificTexturesModel;

  currentValue: string = '';
  // Texture values are the texture urls.
  values: SpecificTextureModel[] = [];

  private animationType: MaterialAnimationType = MaterialAnimationType.None;
  public loadingValues: Record<string, boolean> = {};

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    if (this.item.textures) {
      this.values = this.item.textures;
    } else {
      this.values = [];
    }

    this.setCurrentTextureValue();
    this.animationType = this.item.animationType;
  }

  private setCurrentTextureValue(): void {
    const materials = getMaterialsFromObject(this.object3D);
    let imageSrc: string = '';
    this.currentValue = '';
    if (this.values.length === 0) {
      return;
    }

    for (const material of materials) {
      const texture = material['map'] as Texture;
      if (texture) {
        imageSrc = texture.image.src ?? '';
        break;
      }
    }

    if (!imageSrc) {
      return;
    }

    for (const texture of this.values) {
      // imageSrc could be localhost:4200/asset/url.png
      // texture.url could be asset/url.png
      if (imageSrc.includes(texture.url) || imageSrc.includes(texture.thumbnail)) {
        this.currentValue = texture.url;
        break;
      }
    }
  }

  public changeCurrentTexture(value: string): void {
    if (value === this.currentValue) {
      return;
    }

    this.currentValue = value;
    this.loadingValues[value] = true;

    const objects = [this.object3D, ...getRelatedObjects(this.object3D, 'material-editing-texture')];

    const materials = getMaterialsFromObjects(objects);
    const onLoaded = (): void => {
      this.ngZone.run(() => {
        delete this.loadingValues[value];
      });
    };

    this.ngZone.runOutsideAngular(() => {
      this.productConfiguratorService.materialTextureSwap.next({
        addGlobalLoadingEvent: false,
        animationType: this.animationType,
        materials,
        onLoaded,
        // We know selectedProduct exists as we are using the sidebar!
        productItem: this.productConfiguratorService.selectedProduct!,
        textureSlot: 'map',
        textureUrl: value,
      });
    });
  }
}

