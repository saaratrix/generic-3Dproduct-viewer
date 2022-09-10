import type { ProductItem } from '../../3D/models/product-item/product-item';

export interface ProductLoadingFinishedEvent {
  product: ProductItem;
  isSelectedProduct: boolean;
}
