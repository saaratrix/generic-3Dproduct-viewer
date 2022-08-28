import type { OnDestroy, OnInit, Type } from '@angular/core';
import { ChangeDetectorRef, Component, ComponentRef, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import type { AnimationEvent } from '@angular/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductConfiguratorService } from '../../shared/product-configurator.service';
import type { Subscription } from 'rxjs';
import type { PolygonalObject3D } from '../../3D/3rd-party/three/types/polygonal-object-3D';
import type { SidebarItem } from '../sidebar-item';
import type { SidebarPickingAction } from '../sidebar-picking-action';
import { sidebarItemTypes } from '../sidebar-item-types';
import type { InteractionUserdata } from '../../3D/interaction/interaction-userdata';

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
          const userData = object.userData as InteractionUserdata;
          this.activeObject3D = object;
          for (const action of userData.interactionActions) {
            this.addSidebarComponent(action as SidebarPickingAction);
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

  addSidebarComponent(options: SidebarPickingAction | undefined): void {
    const componentType = options?.sidebarComponent as Type<SidebarItem>;
    if (!sidebarItemTypes.has(componentType)) {
      return;
    }

    const createdComponent = this.viewContainerRef.createComponent(componentType);
    createdComponent.instance.object3D = this.activeObject3D!;
    createdComponent.instance.item = options!.item;

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
