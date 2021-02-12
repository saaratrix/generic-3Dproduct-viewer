import { ProductItem } from "../ProductItem/ProductItem";
import { MaterialAnimationType } from "../../MaterialAnimators/MaterialAnimationType";
import { Color, Material, Object3D } from "three";

export interface MaterialColorSwapEventData {
  animationType: MaterialAnimationType;
  productItem: ProductItem;
  targetColor: Color;
  // If rootObject exists then search through all the materials to find startColor.
  // If startColor isn't found then throw error for now!
  rootObject?: Object3D;
  // The materials to change from currentColor -> targetColor.
  materials?: Material[];
}
