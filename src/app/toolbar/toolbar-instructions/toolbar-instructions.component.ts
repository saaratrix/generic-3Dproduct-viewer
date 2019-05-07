import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { animate, group, query, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-toolbar-instructions",
  templateUrl: "./toolbar-instructions.component.html",
  styleUrls: ["./toolbar-instructions.component.scss"],
  animations: [
    trigger("close", [
      transition("open => closed", [
        group([
          query(":self", animate("0.5s", style({ width: "0" }))),
          query("p", animate("0.4s", style({ opacity: "0" }))),
        ])
      ]),
    ]),
  ],
})
export class ToolbarInstructionsComponent implements OnInit {
  public isOpen = true;
  public isTextVisible = true;

  @Output()
  public closed: EventEmitter<void>;

  constructor() {
    this.closed = new EventEmitter();
  }

  ngOnInit() {
  }

  public closeInstructions() {
    this.isOpen = false;

    setTimeout(() => {
      this.isTextVisible = false;
    }, 400);

    setTimeout(() => {
      this.closed.emit();
    }, 500);
  }

}
