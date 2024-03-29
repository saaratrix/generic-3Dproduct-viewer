import type { MaterialInfo } from '../app/3D/models/material-info';

export interface Model3DLoadInfo {
  path: string;
  materialInfo: MaterialInfo;
}

export const flowerPotModelLoadInfo: Model3DLoadInfo = {
  path: 'assets/models/flowerpot.obj',
  materialInfo: {
    mtl: 'assets/models/flowerpot.mtl',
    renderBackface: true,
  },
};

export const roseModelLoadInfo: Model3DLoadInfo = {
  path: 'assets/models/rose.obj',
  materialInfo: {
    diffuseTexture: 'assets/models/rose.png',
    normalTexture: 'assets/models/rosenormal.png',
    renderBackface: false,
  },
};

export const wuffelsModelLoadInfo: Model3DLoadInfo = {
  path: 'assets/models/wuffels.obj',
  materialInfo: {
    diffuseTexture: 'assets/models/wuffels.png',
    renderBackface: false,
  },
};

export const wayfairChairModelLoadInfo: Model3DLoadInfo = {
  path: 'assets/models/pbr/Waifair_chair.gltf',
  materialInfo: {
    renderBackface: false,
  },
};

export const wayfairTableModelLoadInfo: Model3DLoadInfo = {
  path: 'assets/models/pbr/Waifair_table.gltf',
  materialInfo: {
    renderBackface: false,
  },
};

export const ikeaChearModelLoadInfo: Model3DLoadInfo = {
  path: 'assets/models/pbr/IKEA_chear.gltf',
  materialInfo: {
    renderBackface: false,
  },
};

export const ikeaTableModelLoadInfo: Model3DLoadInfo = {
  path: 'assets/models/pbr/IKEA_table.gltf',
  materialInfo: {
    renderBackface: false,
  },
};
