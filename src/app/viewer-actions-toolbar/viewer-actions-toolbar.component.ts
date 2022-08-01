import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { OverlayService } from "../overlay/overlay.service";
import { Subscription } from "rxjs";

@Component({
  selector: "viewer-tools-toolbar",
  templateUrl: "./viewer-actions-toolbar.component.html",
  styleUrls: ["./viewer-actions-toolbar.component.scss"],
})
export class ViewerActionsToolbarComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private viewerToolsService: OverlayService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.viewerToolsService.removeAllOverlays();
  }
}
