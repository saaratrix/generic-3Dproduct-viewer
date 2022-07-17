import type { Model3D } from "../app/3D/models/Model3D";
import {
  flowerPotModelLoadInfo, ikeaChearModelLoadInfo, ikeaTableModelLoadInfo,
  roseModelLoadInfo,
  wayfairChairModelLoadInfo, wayfairTableModelLoadInfo,
  wuffelsModelLoadInfo,
} from "./ModelsLoadInfo";

export const getFlowerPotModel: () => Model3D = () => {
  return { ...flowerPotModelLoadInfo };
};

export const getRoseModel: () => Model3D = () => {
  return { ...roseModelLoadInfo };
};

export const getWuffelsModel: () => Model3D = () => {
  return { ...wuffelsModelLoadInfo };
};

export const getWayfairChairModel: () => Model3D = () => {
  return { ...wayfairChairModelLoadInfo };
};

export const getWayfairTableModel: () => Model3D = () => {
  return { ...wayfairTableModelLoadInfo };
};

export const getIkeaChearModel: () => Model3D = () => {
  return { ...ikeaChearModelLoadInfo };
};

export const getIkeaTableModel: () => Model3D = () => {
  return { ...ikeaTableModelLoadInfo };
};
