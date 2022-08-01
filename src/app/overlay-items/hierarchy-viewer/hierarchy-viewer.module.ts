import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HierarchyViewerToolComponent } from "./hierarchy-viewer-tool/hierarchy-viewer-tool.component";
import { HierarchyViewerOverlayComponent } from "./hierarchy-viewer-overlay/hierarchy-viewer-overlay.component";

@NgModule({
  declarations: [
    HierarchyViewerToolComponent,
    HierarchyViewerOverlayComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    HierarchyViewerToolComponent,
  ],
})
export class HierarchyViewerModule { }
