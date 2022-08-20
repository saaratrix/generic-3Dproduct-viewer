import { Component, ComponentRef, OnDestroy, OnInit } from "@angular/core";
import { OverlayService } from "../../../overlay/overlay.service";
import { Subscription } from "rxjs";
import { HierarchyOverlayComponent } from "../hierarchy-overlay/hierarchy-overlay.component";

@Component({
  selector: "hierarchy-viewer-tool",
  templateUrl: "./hierarchy-viewer-tool.component.html",
  styleUrls: ["./hierarchy-viewer-tool.component.scss"],
})
export class HierarchyViewerToolComponent implements OnInit, OnDestroy {

  private hierarchyComponentRef: ComponentRef<HierarchyOverlayComponent> | undefined;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private overlayService: OverlayService,
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.overlayService.overlayAdded.subscribe(event => {
        if (event.caller !== this) {
          return;
        }

        this.hierarchyComponentRef = event.component as ComponentRef<HierarchyOverlayComponent>;
      }),
    );
    this.subscriptions.add(
      this.overlayService.overlayRemoved.subscribe(component => {
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
      this.overlayService.addOverlay(this, HierarchyOverlayComponent);
      return;
    }

    if (!this.hierarchyComponentRef.instance.isBeingRemoved()) {
      this.overlayService.tryRemoveOverlay(this.hierarchyComponentRef, false);
    } else {
      this.hierarchyComponentRef.instance.cancelRemoveItem();
    }
  }
}
