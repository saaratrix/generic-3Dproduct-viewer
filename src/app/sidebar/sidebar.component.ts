import { Component, OnInit } from "@angular/core";
import { animate, AnimationEvent, state, style, transition, trigger } from "@angular/animations";

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
        animate("0.5s"),
      ])
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  public isOpened: boolean = false;
  public isContentVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
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
