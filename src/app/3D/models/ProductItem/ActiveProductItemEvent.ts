import { ActiveProductItemEventType } from "./ActiveProductItemEventType";
import { CancelActiveEventCallback } from "./CancelActiveEventCallback";

export interface ActiveProductItemEvent {
  type: ActiveProductItemEventType;
  cancelEvent: CancelActiveEventCallback;
}
