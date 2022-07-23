import type { ActiveProductItemEventType } from "./active-product-item-event-type";
import type { CancelActiveEventCallback } from "./cancel-active-event-callback";

export interface ActiveProductItemEvent {
  type: ActiveProductItemEventType;
  cancelEvent: CancelActiveEventCallback;
}
