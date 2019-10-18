import { SubProductItem } from "./SubProductItem";
import { Object3D } from "three";
import { Model3D } from "./Model";

export interface ProductItem {
  id: number;
  thumbnail: string;
  models: Model3D[];
  // If true, the camera can't look at the underside of the model.
  hasFloor: boolean;
  useGammaSpace: boolean;
  tooltip: string;
  subItems: SubProductItem[];
  selectedSubItem?: SubProductItem | number | null;
  // The root object3D
  object3D?: Object3D;
}
