import { MaterialInfo } from "./MaterialInfo";
import { SubProductItem } from "./SubProductItem";
import { Object3D } from "three";

export interface ProductItem {
  id: number;
  thumbnail: string;
  filename: string;
  materialInfo: MaterialInfo;
  // If true, the camera can't look at the underside of the model.
  hasFloor: boolean;
  useGammaSpace: boolean;
  tooltip: string;
  subItems: SubProductItem[];
  selectedSubItem?: SubProductItem;

  object3D?: Object3D;
}
