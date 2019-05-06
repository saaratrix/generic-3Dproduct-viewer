import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-toolbar-instructions",
  templateUrl: "./toolbar-instructions.component.html",
  styleUrls: ["./toolbar-instructions.component.scss"]
})
export class ToolbarInstructionsComponent implements OnInit {

  @Output()
  public closed: EventEmitter<void>;

  constructor() {
    this.closed = new EventEmitter();
  }

  ngOnInit() {
  }

  public closeInstructions() {
    this.closed.emit();
  }

}
