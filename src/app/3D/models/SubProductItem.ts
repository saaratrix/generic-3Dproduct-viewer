import { ProductConfigurationEvent } from "../../product-configurator.service";

export interface SubProductItem {
  image: string;
  tooltip: string;
  data?: any;
  eventType: ProductConfigurationEvent;
}
