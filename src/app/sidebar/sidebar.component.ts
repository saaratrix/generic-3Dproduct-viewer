import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { animate, AnimationEvent, state, style, transition, trigger } from "@angular/animations";
import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Subscription } from "rxjs";
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
      ])
    ]),
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public isOpened: boolean = false;
  public isContentVisible: boolean = this.isOpened;

  private subscriptions: Subscription[] = [];

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
  ) { }

  ngOnInit(): void {
    // TODO: Improve this logic, currently it triggers 2 animations which triggers detectChanges so I think we ideally should have Mesh_SelectedNew, Mesh_SelectedChanged so we don't have to trigger both states.
    this.subscriptions.push(
      this.productConfiguratorService.getSubject<Mesh>(ProductConfigurationEvent.Mesh_Deselected).subscribe((mesh) => {
        this.zone.run(() => {
          this.isOpened = false;
        });
      }),
      this.productConfiguratorService.getSubject<Mesh>(ProductConfigurationEvent.Mesh_Selected).subscribe((mesh) => {
        this.zone.run(() => {
          this.isOpened = true;
        });
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public openClosedStart(event: AnimationEvent) {
    if (event.fromState === "closed") {
      // setTimeout to avoid ExpressionChanged error.
      setTimeout(() => {
        this.isContentVisible = true;
      }, 1);
    }
  }

  public openClosedDone(event: AnimationEvent) {
    if (event.toState === "closed") {
      setTimeout(() => {
        this.isContentVisible = false;
      }, 1);
    }
  }
}
