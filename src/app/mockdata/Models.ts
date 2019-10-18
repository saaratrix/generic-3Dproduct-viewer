import { Model3D } from "../3D/models/Model3D";
import {
  flowerPotModelLoadInfo, ikeaChearModelLoadInfo, ikeaTableModelLoadInfo,
  roseModelLoadInfo,
  wayfairChairModelLoadInfo, wayfairTableModelLoadInfo,
  wuffelsModelLoadInfo
} from "./ModelsLoadInfo";

export const flowerPotModel: Model3D = {
  ...flowerPotModelLoadInfo,
};

export const roseModel: Model3D = {
  ...roseModelLoadInfo,
};

export const wuffelsModel: Model3D = {
 ...wuffelsModelLoadInfo,
};

export const wayfairChairModel: Model3D = {
  ...wayfairChairModelLoadInfo,
};

export const wayfairTableModel: Model3D = {
  ...wayfairTableModelLoadInfo,
};

export const ikeaChearModel: Model3D = {
  ...ikeaChearModelLoadInfo,
};

export const ikeaTableModel: Model3D = {
  ...ikeaTableModelLoadInfo,
};
