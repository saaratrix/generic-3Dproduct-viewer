import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { SubProductItem } from "../../3D/models/SubProductItem";

@Component({
  selector: "app-toolbar-subitem-container",
  templateUrl: "./toolbar-subitem-container.component.html",
  styleUrls: ["./toolbar-subitem-container.component.scss"]
})
export class ToolbarSubitemContainerComponent implements OnInit {

  @Input()
  public subItems: SubProductItem[] = [];

  @ViewChild("containerElement")
  containerRef: ElementRef;

  constructor() { }

  ngOnInit() {
  }

}
