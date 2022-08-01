import { Component, ComponentRef, OnDestroy, OnInit } from "@angular/core";
import { OverlayService } from "../../../overlay/overlay.service";
import { Subscription } from "rxjs";
import { HierarchyViewerOverlayComponent } from "../hierarchy-viewer-overlay/hierarchy-viewer-overlay.component";

@Component({
  selector: "hierarchy-viewer-tool",
  templateUrl: "./hierarchy-viewer-tool.component.html",
  styleUrls: ["./hierarchy-viewer-tool.component.scss"],
})
export class HierarchyViewerToolComponent implements OnInit, OnDestroy {

  private hierarchyComponentRef: ComponentRef<HierarchyViewerOverlayComponent> | undefined;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private viewerToolsService: OverlayService,
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.viewerToolsService.overlayAdded.subscribe(event => {
        if (!event.caller) {
          return;
        }

        this.hierarchyComponentRef = event.component as ComponentRef<HierarchyViewerOverlayComponent>;
      }),
    );
    this.subscriptions.add(
      this.viewerToolsService.overlayRemoved.subscribe(component => {
        if (component !== this.hierarchyComponentRef) {
          return;
        }

        this.hierarchyComponentRef = undefined;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleHierarchyViewer(): void {
    if (!this.hierarchyComponentRef) {
      this.viewerToolsService.addOverlay(this, HierarchyViewerOverlayComponent);
      return;
    }

    if (!this.hierarchyComponentRef.instance.isBeingRemoved()) {
      this.viewerToolsService.tryRemoveOverlay(this.hierarchyComponentRef, false);
    } else {
      this.hierarchyComponentRef.instance.cancelRemoveItem();
    }
  }
}
