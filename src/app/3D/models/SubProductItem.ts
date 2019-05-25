import { ProductConfigurationEvent } from "../../product-configurator.service";

export interface SubProductItem {
  id: number;
  image: string;
  tooltip: string;
  data?: any;
  eventType: ProductConfigurationEvent;
}
