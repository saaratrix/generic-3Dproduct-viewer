import { ActiveProductItemEventType } from "./ActiveProductItemEventType";

export interface ActiveProductItemEvent {
  type: ActiveProductItemEventType;
  cancelEvent: (complete: boolean) => void;
}
