import { Component, OnInit } from "@angular/core";
import type { OverlayItem } from "../../../overlay/overlay-item";
import { Subject } from "rxjs";
import { animate, AnimationEvent, group, query, stagger, state, style, transition, trigger } from "@angular/animations";
import { OverlayService } from "../../../overlay/overlay.service";

const animationDuration = 150;

@Component({
  selector: "hierarchy-overlay",
  templateUrl: "./hierarchy-overlay.component.html",
  styleUrls: ["./hierarchy-overlay.component.scss"],
  animations: [
    trigger("openClosed", [
      state("open", style({ opacity: "1" })),
      state("closed", style({ opacity: "0" })),
      transition("open => closed", [animate(`${animationDuration}ms`)]),
      transition("closed => open", [animate(`${animationDuration}ms`)]),
    ]),
  ],
})
export class HierarchyOverlayComponent implements OnInit, OverlayItem {
  isOpened: boolean = false;

  private pendingRemoval: Subject<void> | undefined;
  private pendingRemovalTimeoutId: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private overlayService: OverlayService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isOpened = true;
    });
  }

  isBeingRemoved(): boolean {
    return !!this.pendingRemoval;
  }

  close(): void {
    const item = this.overlayService.getOverlayItem(this);
    if (item) {
      this.overlayService.tryRemoveOverlay(item, false);
    }
  }

  removeItem(): Subject<void> {
    if (this.pendingRemoval) {
      return this.pendingRemoval;
    }

    this.isOpened = false;
    this.pendingRemoval = new Subject<void>();

    this.pendingRemovalTimeoutId = setTimeout(() => {
      this.pendingRemoval!.next();
      this.pendingRemoval!.complete();
    }, animationDuration);

    return this.pendingRemoval;
  }

  cancelRemoveItem(): void {
    if (!this.pendingRemoval) {
      return;
    }

    this.isOpened = true;
    this.pendingRemoval.unsubscribe();
    clearTimeout(this.pendingRemovalTimeoutId);
    this.pendingRemoval = undefined;
    this.pendingRemovalTimeoutId = undefined;
  }

  public openClosedStart(event: AnimationEvent): void {
    const cssClass = event.fromState === "closed" ? "opening" : "closing";
    (event.element as HTMLElement).classList.add(cssClass);
  }

  public openClosedDone(event: AnimationEvent): void {
    const cssClass = event.fromState === "closed" ? "opening" : "closing";
    (event.element as HTMLElement).classList.remove(cssClass);
  }
}
