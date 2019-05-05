import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import * as THREE from "three";

@Component({
  selector: "app-viewer-threejs",
  templateUrl: "./viewer-threejs.component.html",
  styleUrls: ["./viewer-threejs.component.scss"]
})
export class ViewerThreejsComponent implements OnInit {

  @ViewChild("canvas") canvasRef: ElementRef;

  @Output()
  public sceneInit: EventEmitter<THREE.WebGLRenderer> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
    const renderer = new THREE.WebGLRenderer({ canvas });
    this.sceneInit.emit(renderer);
  }
}
