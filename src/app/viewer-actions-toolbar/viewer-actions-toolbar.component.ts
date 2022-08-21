import { Component, OnDestroy, OnInit } from '@angular/core';
import { OverlayService } from '../overlay/overlay.service';

@Component({
  selector: 'viewer-actions-toolbar',
  templateUrl: './viewer-actions-toolbar.component.html',
  styleUrls: ['./viewer-actions-toolbar.component.scss'],
})
export class ViewerActionsToolbarComponent implements OnInit, OnDestroy {
  constructor(
    private overlayService: OverlayService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.overlayService.removeAllOverlays();
  }
}
