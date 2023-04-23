import type { ProductItem } from '../app/3D/models/product-item/product-item';
import { getFlowerPotModel, getRoseModel, getWuffelsModel } from './models';
import { Euler, Vector3 } from 'three';
import { MaterialAnimationType } from '../app/3D/material-animators/material-animation-type';
import type { MaterialEditingSpecificTexturesModel } from '../app/sidebar-items/material-editing/material-editing-specific-texture/material-editing-specific-textures.model';
import { MaterialEditingSpecificTextureComponent } from '../app/sidebar-items/material-editing/material-editing-specific-texture/material-editing-specific-texture.component';
import { MaterialEditingFreeColorComponent } from '../app/sidebar-items/material-editing/material-editing-free-color/material-editing-free-color.component';
import { MaterialEditingSpecificColorComponent } from '../app/sidebar-items/material-editing/material-editing-specific-color/material-editing-specific-color.component';
import type { MaterialEditingAction } from '../app/sidebar-items/material-editing/material-editing-action';
import type { MaterialEditingSpecificColorsModel } from '../app/sidebar-items/material-editing/material-editing-specific-color/material-editing-specific-colors.model';

export function createFlowerPot(): ProductItem {
  const freeColorAction: MaterialEditingAction = {
    type: 'material-editing-free',
    sidebarComponent: MaterialEditingFreeColorComponent,
  };

  const specificColorAction: MaterialEditingAction<MaterialEditingSpecificColorsModel> = {
    type: 'material-editing-specific',
    sidebarComponent: MaterialEditingSpecificColorComponent,
    item: {
      animationType: MaterialAnimationType.Linear,
      // ffc0cb = CSS Color 'pink'
      colors: ['#ff7f00', '#badbad', '#ffc0cb'],
    },
  };

  return {
    id: 'flowerpot',
    thumbnail: 'assets/models/thumbnail_pot.png',
    models: [getFlowerPotModel()],
    hasFloor: false,
    useGammaSpace: false,
    tooltip: 'A very good looking flower pot.',
    subItems: [],
    pickingSetupItems: [
      {
        included: ['Cylinder.002_Cylinder.006_M_flower'],
        actions: [freeColorAction],
      }, {
        included: ['Cylinder.002_Cylinder.006_M_pot'],
        actions: [specificColorAction],
      },
    ],

    activeEvents: [],
  };
}

export function createRose(): ProductItem {
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

  const action: MaterialEditingAction<MaterialEditingSpecificTexturesModel> = {
    type: 'material-editing-texture',
    sidebarComponent: MaterialEditingSpecificTextureComponent,
    item: selectedOptionsValue,
  };

  return {
    id: 'roses',
    thumbnail: 'assets/models/thumbnail_rose.png',
    models: [rose1, rose2, centerRose, rose4, rose5],
    hasFloor: false,
    useGammaSpace: false,
    tooltip: 'A bouquet of roses.',
    subItems: [],
    pickingSetupItems: [{
      actions: [action],
    }],
    activeEvents: [],
  };
}

export function createWuffels(): ProductItem {
  return {
    id: 'Wuffels',
    thumbnail: 'assets/models/thumbnail_wuffels.png',
    models: [getWuffelsModel()],
    hasFloor: true,
    useGammaSpace: false,
    tooltip: 'Wuffels! Wuff!',
    subItems: [],
    pickingSetupItems: [],

    activeEvents: [],
  };
}
