import type { OnDestroy, OnInit } from "@angular/core";
import { ChangeDetectorRef, NgZone } from "@angular/core";
import { Component } from "@angular/core";
import type { AnimationEvent } from "@angular/animations";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ProductConfiguratorService } from "../product-configurator.service";
import type { Subscription } from "rxjs";
import { SelectedOptionsType } from "../3D/models/selectable-object-3ds-options/selected-options-type";
import type { SelectableObject3DUserData } from "../3D/models/selectable-object-3ds-options/selectable-object-3D-user-data";
import type { PolygonalObject3D } from "../3D/3rd-party/three/types/polygonal-object-3D";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  animations: [
    trigger("openClosed", [
      state("open", style({
        right: "0",
      })),
      state("closed", style({
        right: "var(--sidebar-closed-right)",
      })),
      transition("open <=> closed", [
        animate("0.15s"),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public SelectedOptionsType = SelectedOptionsType;
  public isOpened: boolean = false;
  public isContentVisible: boolean = this.isOpened;
  public type: SelectedOptionsType = SelectedOptionsType.None;
  public activeObject3D: PolygonalObject3D | undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
  ) { }

  ngOnInit(): void {
    // TODO: Performance Improvement - Currently it triggers 2 animations which triggers detectChanges so I think we ideally should have Object3DSelectedNew, Object3DSelectedChanged so we don't have to trigger both states.
    this.subscriptions.push(
      this.productConfiguratorService.object3DDeselected.subscribe(() => {
        this.zone.run(() => {
          this.isOpened = false;
          this.activeObject3D = undefined;
          this.type = SelectedOptionsType.None;
        });
      }),
      this.productConfiguratorService.object3DSelected.subscribe(object => {
        this.zone.run(() => {
          this.isOpened = true;
          const userData = object.userData as SelectableObject3DUserData;
          this.activeObject3D = object;
          this.type = userData.selectableObjectsOption.type;
        });
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public openClosedStart(event: AnimationEvent): void {
    if (event.fromState === "closed") {
      // setTimeout to avoid ExpressionChanged error.
      setTimeout(() => {
        this.isContentVisible = true;
      }, 1);
    }
  }

  public openClosedDone(event: AnimationEvent): void {
    if (event.toState === "closed") {
      setTimeout(() => {
        this.isContentVisible = false;
      }, 1);
    }
  }
}
