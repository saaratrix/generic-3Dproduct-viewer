import { ProductItem } from "../ProductItem";

export interface MaterialTextureSwapEventData {
  productItem: ProductItem;
  textureSlot: string;
  textureUrl: string;
}
