import { Component, OnInit } from "@angular/core";
import { ProductConfiguratorService } from "../product-configurator.service";


@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {

  constructor(private productConfiguratorService: ProductConfiguratorService) {
  }

  ngOnInit() {
  }

}
