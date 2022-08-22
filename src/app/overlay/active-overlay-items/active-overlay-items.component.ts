import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'active-overlay-items',
  templateUrl: './active-overlay-items.component.html',
  styleUrls: ['./active-overlay-items.component.scss'],
})
export class ActiveOverlayItemsComponent implements OnInit {
  @ViewChild('activeOverlayItems', { static: false }) overlayItemsElementRef!: ElementRef<HTMLElement>;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    this.overlayService.setViewContainerRef(this.viewContainerRef);

    this.subscriptions.add(
      this.overlayService.overlayAdded.subscribe(event => {
        this.overlayItemsElementRef.nativeElement.appendChild(event.component.location.nativeElement);
      }),
    );

    this.subscriptions.add(
      this.overlayService.overlayRemoved.subscribe(overlay => {
        overlay.destroy();
        this.overlayItemsElementRef.nativeElement.removeChild(overlay.location.nativeElement);
      }),
    );
  }
}
