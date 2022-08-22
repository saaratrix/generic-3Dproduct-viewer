import type { ProductItem } from '../app/3D/models/product-item/product-item';
import { getFlowerPotModel, getRoseModel, getWuffelsModel } from './models';
import { Euler, Vector3 } from 'three';
import { MaterialAnimationType } from '../app/3D/material-animators/material-animation-type';
import type { MaterialEditingSpecificTexturesModel } from '../app/sidebar-items/material-editing/material-editing-specific-texture/material-editing-specific-textures.model';
import { MaterialEditingSpecificTextureComponent } from '../app/sidebar-items/material-editing/material-editing-specific-texture/material-editing-specific-texture.component';
import { MaterialEditingFreeColorComponent } from '../app/sidebar-items/material-editing/material-editing-free-color/material-editing-free-color.component';
import { MaterialEditingSpecificColorComponent } from '../app/sidebar-items/material-editing/material-editing-specific-color/material-editing-specific-color.component';

export function createFlowerPot(id: number): ProductItem {
  return {
    id,
    name: 'flowerpot',
    thumbnail: 'assets/models/thumbnail_pot.png',
    models: [getFlowerPotModel()],
    hasFloor: false,
    useGammaSpace: false,
    tooltip: 'A very good looking flower pot.',
    subItems: [],
    selectableObject3DsOptions: [
      {
        includedObjects: ['Cylinder.002_Cylinder.006_M_flower'],
        options: {
          type: MaterialEditingFreeColorComponent,
        },
      }, {
        includedObjects: ['Cylinder.002_Cylinder.006_M_pot'],
        options: {
          type: MaterialEditingSpecificColorComponent,
          item: {
            animationType: MaterialAnimationType.Linear,
            // ffc0cb = CSS Color 'pink'
            colors: ['#ff7f00', '#badbad', '#ffc0cb'],
          },
        },
      },
    ],

    activeEvents: [],
  };
}

export function createRose(id: number): ProductItem {
  const rose1 = getRoseModel();
  const rose2 = getRoseModel();
  const centerRose = getRoseModel();
  const rose4 = getRoseModel();
  const rose5 = getRoseModel();

  rose1.position = new Vector3(1, 0, 0);
  rose1.rotation = new Euler(0, 0, -0.2);
  rose2.position = new Vector3(-1, 0, 0);
  rose2.rotation = new Euler(0, 0, 0.2);

  rose4.position = new Vector3(0, 0, 1);
  rose4.rotation = new Euler(0.2, 0, 0);
  rose5.position = new Vector3(0, 0, -1);
  rose5.rotation = new Euler(-0.2, 0, 0);

  const selectedOptionsValue: MaterialEditingSpecificTexturesModel = {
    animationType: MaterialAnimationType.FromTopToBottom,
    textures: [
      {
        url: 'assets/models/rose.png',
        thumbnail: 'assets/models/thumbnail_rose.png',
      }, {
        url: 'assets/models/rose_pink.png',
        thumbnail: 'assets/models/rose_pink.png',
      },
    ],
  };

  return {
    id,
    name: 'roses',
    thumbnail: 'assets/models/thumbnail_rose.png',
    models: [rose1, rose2, centerRose, rose4, rose5],
    hasFloor: false,
    useGammaSpace: false,
    tooltip: 'A special gift a long time ago.',
    subItems: [],
    selectableObject3DsOptions: [{
      noRelatedObjects: true,
      options: {
        type: MaterialEditingSpecificTextureComponent,
        item: selectedOptionsValue,
      },
    }],

    activeEvents: [],
  };
}

export function createWuffels(id: number): ProductItem {
  return {
    id,
    name: 'Wuffels',
    thumbnail: 'assets/models/thumbnail_wuffels.png',
    models: [getWuffelsModel()],
    hasFloor: true,
    useGammaSpace: false,
    tooltip: 'Wuffels! Wuff!',
    subItems: [],
    selectableObject3DsOptions: [],

    activeEvents: [],
  };
}
