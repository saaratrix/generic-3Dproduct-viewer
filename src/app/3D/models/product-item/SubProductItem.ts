import { ProductConfigurationEvent } from "../../../product-configurator-events";
import { MaterialTextureSwapEventData } from "../event-data/MaterialTextureSwapEventData";

export interface SubProductItem {
  id: number;
  image: string;
  tooltip: string;
  data?: MaterialTextureSwapEventData;
  eventType: ProductConfigurationEvent;
}
