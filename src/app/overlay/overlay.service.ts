import { ComponentRef, Injectable, OnDestroy, Type, ViewContainerRef } from "@angular/core";
import { Subject } from "rxjs";
import type { OverlayItem } from "./overlay-item";

export interface ToolAddedEvent {
  caller: unknown;
  component: ComponentRef<OverlayItem>;
}

@Injectable({
  providedIn: "root",
})
export class OverlayService implements OnDestroy {
  private viewContainerRef: ViewContainerRef | undefined;

  private overlays: ComponentRef<OverlayItem>[] = [];

  overlayAdded: Subject<ToolAddedEvent> = new Subject<ToolAddedEvent>();
  overlayRemoved: Subject<ComponentRef<OverlayItem>> = new Subject<ComponentRef<OverlayItem>>();

  constructor() {}

  ngOnDestroy(): void {
    this.overlayAdded.unsubscribe();
    this.overlayRemoved.unsubscribe();
  }

  setViewContainerRef(ref: ViewContainerRef): void {
    this.viewContainerRef = ref;
  }

  addOverlay(caller: unknown, componentType: Type<OverlayItem>): void {
    const component = this.viewContainerRef!.createComponent<OverlayItem>(componentType);
    this.overlays.push(component);
    this.overlayAdded.next({
      caller,
      component,
    });
  }

  /**
   * Try and remove the overlay but not instantly as it might want to animate the state change.
   * @param overlay
   * @param force
   */
  tryRemoveOverlay(overlay: ComponentRef<OverlayItem>, force: boolean): void {
    const index = this.overlays.indexOf(overlay);
    if (index === -1) {
      return;
    }

    if (!force) {
      overlay.instance.removeItem().subscribe(() => {
        this.removeOverlay(overlay);
      });
    } else {
      this.removeOverlay(overlay);
    }
  }

  private removeOverlay(tool: ComponentRef<OverlayItem>): void {
    const index = this.overlays.indexOf(tool);
    if (index === -1) {
      return;
    }

    this.overlays.splice(index, 1);
    this.overlayRemoved.next(tool);
  }

  removeAllOverlays(): void {
    for (const tool of this.overlays) {
      this.removeOverlay(tool);
    }

    this.overlays = [];
  }
}
