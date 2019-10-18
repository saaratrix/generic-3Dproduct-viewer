import { Model3D } from "../3D/models/Model";

export const flowerPotModel: Model3D = {
  filename: "assets/models/flowerpot.obj",
  materialInfo: {
    mtl: "assets/models/flowerpot.mtl",
    renderBackface: true
  },
};

export const roseModel: Model3D = {
  filename: "assets/models/rose.obj",
  materialInfo: {
    diffuseTexture: "assets/models/rose.png",
    normalTexture: "assets/models/rosenormal.png",
    renderBackface: false
  },
};

export const wuffelsModel: Model3D = {
 filename: "assets/models/wuffels.obj",
  materialInfo: {
    diffuseTexture: "assets/models/wuffels.png",
    renderBackface: false,
  },
};

export const wayfairChairModel: Model3D = {
  filename: "assets/models/pbr/Waifair_table.gltf",
  materialInfo: {
    renderBackface: false
  },
};

export const wayfairTableModel: Model3D = {
  filename: "assets/models/pbr/Waifair_chair.gltf",
  materialInfo: {
    renderBackface: false
  },
};

export const ikeaChearModel: Model3D = {
  filename: "assets/models/pbr/IKEA_chear.gltf",
  materialInfo: {
    renderBackface: false
  },
};

export const ikeaTableModel: Model3D = {
  filename: "assets/models/pbr/IKEA_table.gltf",
  materialInfo: {
    renderBackface: false
  },
};
