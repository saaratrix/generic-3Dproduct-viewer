import { ProductItem } from "../app/3D/models/ProductItem";
import { getFlowerPotModel, getRoseModel, getWuffelsModel } from "./Models";

export function createFlowerPot(id: number): ProductItem {
  return {
    id,
    thumbnail: "assets/models/thumbnail_pot.png",
    models: [ getFlowerPotModel() ],
    hasFloor: false,
    useGammaSpace: false,
    tooltip: "",
    subItems: [],
  };
}

export function createRose(id: number): ProductItem {
  return {
    id,
    thumbnail: "assets/models/thumbnail_rose.png",
    models: [ getRoseModel() ],
    hasFloor: false,
    useGammaSpace: false,
    tooltip: "",
    subItems: [],
  };
}

export function createWuffels(id: number): ProductItem {
  return {
    id,
    thumbnail: "assets/models/thumbnail_wuffels.png",
    models: [ getWuffelsModel() ],
    hasFloor: true,
    useGammaSpace: false,
    tooltip: "",
    subItems: [],
  };
}


