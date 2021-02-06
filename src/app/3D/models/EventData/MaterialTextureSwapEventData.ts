import { ProductItem } from "../ProductItem/ProductItem";

export interface MaterialTextureSwapEventData {
  productItem: ProductItem;
  textureSlot: string;
  textureUrl: string;
}
