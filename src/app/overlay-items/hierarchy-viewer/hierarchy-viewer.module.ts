import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchyViewerToolComponent } from './hierarchy-viewer-tool/hierarchy-viewer-tool.component';
import { HierarchyOverlayComponent } from './hierarchy-overlay/hierarchy-overlay.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HierarchyTreeComponent } from './hierarchy-tree/hierarchy-tree.component';
import { HierarchyTreeNodeComponent } from './hierarchy-tree-node/hierarchy-tree-node.component';

@NgModule({
  declarations: [
    HierarchyTreeNodeComponent,
    HierarchyOverlayComponent,
    HierarchyTreeComponent,
    HierarchyViewerToolComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
  ],
  exports: [
    HierarchyViewerToolComponent,
  ],
})
export class HierarchyViewerModule { }
