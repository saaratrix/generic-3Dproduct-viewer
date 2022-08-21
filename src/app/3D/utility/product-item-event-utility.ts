import type { ActiveProductItemEventType } from '../models/product-item/active-product-item-event-type';
import type { ProductItem } from '../models/product-item/product-item';

export function clearEvents(productItem: ProductItem, types: ActiveProductItemEventType[], completeEvent: boolean): void {
  for (let i = 0; i < productItem.activeEvents.length;) {
    const event = productItem.activeEvents[i];
    if (!types.includes(event.type)) {
      i++;
      continue;
    }

    event.cancelEvent(completeEvent);
    productItem.activeEvents.splice(i, 1);
  }
}
