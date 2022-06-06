import { ProductItem } from "../product-item/ProductItem";
import { MaterialAnimationType } from "../../material-animators/MaterialAnimationType";
import { Material } from "three";

export interface MaterialTextureSwapEventData {
  // If we should show the global loading spinner while loading the texture.
  addGlobalLoadingEvent: boolean;
  animationType: MaterialAnimationType;
  // If left undefined it'll use the productItem.object3D.
  materials?: Material[];
  onLoaded?: () => void;
  productItem: ProductItem;
  textureSlot: "map";
  textureUrl: string;
}
