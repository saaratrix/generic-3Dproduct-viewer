import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { animate, query, style, transition, trigger } from "@angular/animations";

const textDuration = 250;
const widthDuration = 500;

@Component({
  selector: "app-toolbar-instructions",
  templateUrl: "./toolbar-instructions.component.html",
  styleUrls: ["./toolbar-instructions.component.scss"],
  animations: [
    trigger("close", [
      transition("open => closed", [
        query("p", animate(textDuration + "ms", style({ opacity: "0" }))),
        query(":self", animate(widthDuration + "ms", style({ width: "0" }))),
      ]),
    ]),
  ],
})
export class ToolbarInstructionsComponent implements OnInit {
  public isOpen = true;
  public isTextVisible = true;

  @ViewChild("instructionContainer")
  instructionContainerRef !: ElementRef;

  @Output()
  public closed: EventEmitter<void>;

  constructor() {
    this.closed = new EventEmitter();
  }

  ngOnInit() {
    // Automatically close the instructions if user haven't closed them after a certain time.
    setTimeout(() => {
      if (this.isOpen) {
        this.closeInstructions();
      }
    }, 10000);
  }

  /**
   * If a user clicks the X button they have read the text and we'll set a localStorage variable to make it persistent.
   */
  public closeInstructionsButton() {
    // Don't show the tutorial again!
    if (localStorage) {
      localStorage.setItem("tutorial", "1");
    }

    this.closeInstructions();
  }

  public closeInstructions() {
    this.isOpen = false;

    const element = this.instructionContainerRef.nativeElement as HTMLElement;
    const height = element.offsetHeight;
    // Explicitly set the height so it doesn't shrink etc when the text disappears.
    element.style.height = height + "px";

    // This removes the element with *ngIf.
    setTimeout(() => {
      this.isTextVisible = false;
    }, textDuration);

    setTimeout(() => {
      this.closed.emit();
    }, (textDuration + widthDuration) - 16);
  }

}
