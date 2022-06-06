import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { animate, AnimationEvent, state, style, transition, trigger } from "@angular/animations";
import { ProductConfiguratorService } from "../product-configurator.service";
import { Subscription } from "rxjs";
import { SelectedOptionsType } from "../3D/models/selectable-meshes-options/SelectedOptionsType";
import { SelectableObject3DUserData } from "../3D/models/selectable-meshes-options/SelectableObject3DUserData";
import { Mesh } from "three";

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
  public activeMesh: Mesh | undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
  ) { }

  ngOnInit(): void {
    // TODO: Performance Improvement - Currently it triggers 2 animations which triggers detectChanges so I think we ideally should have Mesh_SelectedNew, Mesh_SelectedChanged so we don't have to trigger both states.
    this.subscriptions.push(
      this.productConfiguratorService.meshDeselected.subscribe(() => {
        this.zone.run(() => {
          this.isOpened = false;
          this.activeMesh = undefined;
          this.type = SelectedOptionsType.None;
        });
      }),
      this.productConfiguratorService.meshSelected.subscribe(mesh => {
        this.zone.run(() => {
          this.isOpened = true;
          const userData = mesh.userData as SelectableObject3DUserData;
          this.activeMesh = mesh;
          this.type = userData.selectableMeshesOption.type;
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
