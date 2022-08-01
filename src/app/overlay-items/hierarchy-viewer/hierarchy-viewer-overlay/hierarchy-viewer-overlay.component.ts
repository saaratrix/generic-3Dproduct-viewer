import { Component, OnInit } from "@angular/core";
import type { OverlayItem } from "../../../overlay/overlay-item";
import { Subject } from "rxjs";

@Component({
  selector: "hierarchy-viewer-overlay",
  templateUrl: "./hierarchy-viewer-overlay.component.html",
  styleUrls: ["./hierarchy-viewer-overlay.component.scss"],
})
export class HierarchyViewerOverlayComponent implements OnInit, OverlayItem {

  private pendingRemoval: Subject<void> | undefined;
  private pendingRemovalTimeoutId: ReturnType<typeof setTimeout> | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  isBeingRemoved(): boolean {
    return !!this.pendingRemoval;
  }

  removeItem(): Subject<void> {
    if (this.pendingRemoval) {
      return this.pendingRemoval;
    }

    this.pendingRemoval = new Subject<void>();

    this.pendingRemovalTimeoutId = setTimeout(() => {
      this.pendingRemoval!.next();
      this.pendingRemoval!.complete();
    }, 1000);

    return this.pendingRemoval;
  }

  cancelRemoveItem(): void {
    if (!this.pendingRemoval) {
      return;
    }

    this.pendingRemoval.unsubscribe();
    clearTimeout(this.pendingRemovalTimeoutId);
    this.pendingRemoval = undefined;
    this.pendingRemovalTimeoutId = undefined;
  }
}
