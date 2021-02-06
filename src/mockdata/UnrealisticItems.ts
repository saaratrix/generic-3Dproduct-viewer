import { ProductItem } from "../app/3D/models/ProductItem/ProductItem";
import { getFlowerPotModel, getRoseModel, getWuffelsModel } from "./Models";
import { Euler, Vector3 } from "three";
import { SelectedOptionsType } from "../app/3D/models/SelectableMeshesOptions/SelectedOptionsType";

export function createFlowerPot(id: number): ProductItem {
  return {
    id,
    name: "flowerpot",
    thumbnail: "assets/models/thumbnail_pot.png",
    models: [ getFlowerPotModel() ],
    hasFloor: false,
    useGammaSpace: false,
    tooltip: "A very good looking flower pot.",
    subItems: [],
    selectableMeshesOptions: [{
      includedMeshes: ["Cylinder.002_Cylinder.006_M_flower"],
      options: {
        type: SelectedOptionsType.FreeColor,
      },
    }],

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

  return {
    id,
    name: "roses",
    thumbnail: "assets/models/thumbnail_rose.png",
    models: [ rose1, rose2, centerRose, rose4, rose5 ],
    hasFloor: false,
    useGammaSpace: false,
    tooltip: "A special gift a long time ago.",
    subItems: [],
    selectableMeshesOptions: [{
      options: {
        type: SelectedOptionsType.SpecificColors,
      },
    }],

    activeEvents: [],
  };
}

export function createWuffels(id: number): ProductItem {
  return {
    id,
    name: "Wuffels",
    thumbnail: "assets/models/thumbnail_wuffels.png",
    models: [ getWuffelsModel() ],
    hasFloor: true,
    useGammaSpace: false,
    tooltip: "Wuffels! Wuff!",
    subItems: [],
    selectableMeshesOptions: [],

    activeEvents: [],
  };
}


