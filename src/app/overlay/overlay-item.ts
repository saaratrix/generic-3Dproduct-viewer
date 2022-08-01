import type { Subject } from "rxjs";

export interface OverlayItem {
  removeItem(): Subject<void>;
}
