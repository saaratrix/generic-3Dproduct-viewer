import { ProductItem } from "../3D/models/ProductItem";
import { flowerPotModel, roseModel, wuffelsModel } from "./Models";

export function createFlowerPot(id: number): ProductItem {
  return {
    id,
    thumbnail: "assets/models/thumbnail_pot.png",
    models: [ flowerPotModel ],
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
    models: [ roseModel ],
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
    models: [ wuffelsModel ],
    hasFloor: true,
    useGammaSpace: false,
    tooltip: "",
    subItems: [],
  };
}


