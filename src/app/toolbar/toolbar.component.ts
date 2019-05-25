import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ProductConfiguratorService } from "../product-configurator.service";


@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {

  constructor(public productConfiguratorService: ProductConfiguratorService) {
    const hasTutorialItem = localStorage && localStorage.getItem("tutorial");
    if (hasTutorialItem && hasTutorialItem === "1") {
      this.hasReadInstructions = true;
    }
  }

  // Could read from localStorage to only show it once.
  public hasReadInstructions = false;

  ngOnInit() {
    // On window resize reposition.
  }

}
