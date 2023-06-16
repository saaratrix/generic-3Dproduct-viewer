import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectorRef, Component, ComponentRef, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import type { AnimationEvent } from '@angular/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductConfiguratorService } from '../../shared/product-configurator.service';
import type { Subscription } from 'rxjs';
import type { PolygonalObject3D } from '../../3D/3rd-party/three/types/polygonal-object-3D';
import type { SidebarItem } from '../sidebar-item';
import { sidebarItemTypes } from '../sidebar-item-types';
import type { PickingUserdata } from '../../3D/picking/picking-userdata';
import type { PickingAction } from '../../3D/picking/picking-action';
import { isSidebarPickingAction } from '../sidebar-picking-action';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('openClosed', [
      state('open', style({
        right: '0',
      })),
      state('closed', style({
        right: 'var(--sidebar-closed-right)',
      })),
      transition('open <=> closed', [
        animate('0.15s'),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('componentsElement', { static: true }) componentsElementRef!: ElementRef<HTMLElement>;

  public isOpened: boolean = false;
  public isContentVisible: boolean = this.isOpened;

  createdComponents: ComponentRef<SidebarItem>[] = [];

  public activeObject3D: PolygonalObject3D | undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    // TODO: Performance Improvement - Currently it triggers 2 animations which triggers detectChanges so I think we ideally should have Object3DSelectedNew, Object3DSelectedChanged so we don't have to trigger both states.
    this.subscriptions.push(
      this.productConfiguratorService.object3DDeselected.subscribe(() => {
        this.zone.run(() => {
          this.clearComponents();
          this.isOpened = false;
          this.activeObject3D = undefined;
        });
      }),
      this.productConfiguratorService.object3DSelected.subscribe(object => {
        this.zone.run(() => {
          this.clearComponents();
          this.isOpened = true;
          const userData = object.userData as PickingUserdata;
          this.activeObject3D = object;
          for (const action of userData.pickingActions) {
            this.addSidebarComponent(action);
          }
        });
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  clearComponents(): void {
    for (const createdComponent of this.createdComponents) {
      createdComponent.destroy();
      this.componentsElementRef.nativeElement.removeChild(createdComponent.location.nativeElement);
    }

    this.createdComponents.splice(0, this.createdComponents.length);
  }

  addSidebarComponent(action: PickingAction): void {
    if (!isSidebarPickingAction(action)) {
      return;
    }

    if (!sidebarItemTypes.has(action.sidebarComponent)) {
      return;
    }

    const createdComponent = this.viewContainerRef.createComponent(action.sidebarComponent);
    createdComponent.instance.object3D = this.activeObject3D!;
    createdComponent.instance.item = action.item;

    this.createdComponents.push(createdComponent);
    this.componentsElementRef.nativeElement.appendChild(createdComponent.location.nativeElement as HTMLElement);
  }

  public openClosedStart(event: AnimationEvent): void {
    if (event.fromState === 'closed') {
      // setTimeout to avoid ExpressionChanged error.
      setTimeout(() => {
        this.isContentVisible = true;
      }, 1);
    }
  }

  public openClosedDone(event: AnimationEvent): void {
    if (event.toState === 'closed') {
      setTimeout(() => {
        this.isContentVisible = false;
      }, 1);
    }
  }
}
