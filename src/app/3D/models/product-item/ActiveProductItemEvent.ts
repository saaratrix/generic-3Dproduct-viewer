import type { ActiveProductItemEventType } from "./ActiveProductItemEventType";
import type { CancelActiveEventCallback } from "./CancelActiveEventCallback";

export interface ActiveProductItemEvent {
  type: ActiveProductItemEventType;
  cancelEvent: CancelActiveEventCallback;
}
