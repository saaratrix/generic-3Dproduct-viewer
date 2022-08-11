import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import type { Object3D } from "three";
import { ProductConfiguratorService } from "../../../product-configurator.service";
import { isPolygonalObject3D } from "../../../3D/3rd-party/three/types/is-three-js-custom-type";
import { isSelectableObject3dUserData } from "../../../3D/models/selectable-object-3ds-options/is-selectable-object-3d-user-data";
import { SelectedOptionsType } from "../../../3D/models/selectable-object-3ds-options/selected-options-type";
import type { PolygonalObject3D } from "../../../3D/3rd-party/three/types/polygonal-object-3D";

@Component({
  selector: "hierarchy-tree-node",
  templateUrl: "./hierarchy-tree-node.component.html",
  styleUrls: ["./hierarchy-tree-node.component.scss"],
})
export class HierarchyTreeNodeComponent implements OnInit {
  @ViewChild("displayName", { static: true }) displayNameElement!: ElementRef<HTMLElement>;

  @Input() node!: Object3D;
  @Input() depth!: number;

  name!: string;
  marginLeft: string = "0";
  isHoverable!: boolean;
  isSelectable!: boolean;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) { }

  ngOnInit(): void {
    this.marginLeft = this.getMarginLeft();
    this.name = this.getName();
    this.isHoverable = this.isNodeHoverable();
    this.isSelectable = this.isNodeSelectable();
  }

  private getName(): string {
    return this.node.name || this.node.type;
  }

  private getMarginLeft(): string {
    if (this.depth === 0) {
      return "0";
    }

    const regex = /(\d+(?:\.\d+)?)(\s*[a-zA-Z]+)/i;
    const computedStyle = getComputedStyle(this.displayNameElement.nativeElement);
    const match = regex.exec(computedStyle.getPropertyValue("--margin-per-depth"));
    if (!match) {
      return "0";
    }
    const margin = parseFloat(match[1]);
    return `${margin * this.depth}${match[2]}`;
  }

  private isNodeHoverable(): boolean {
    return isPolygonalObject3D(this.node);
  }

  private isNodeSelectable(): boolean {
    if (!this.isHoverable) {
      return false;
    }

    if (!isSelectableObject3dUserData(this.node.userData) || this.node.userData.selectableObjectsOption.type === SelectedOptionsType.None) {
      return false;
    }

    return true;
  }

  setHoveredObject(): void {
    if (!this.isHoverable) {
      return;
    }

    this.productConfiguratorService.object3DPointerEnter.next(this.node as PolygonalObject3D);
  }

  unsetHoveredObject(): void {
    if (!this.isHoverable) {
      return;
    }

    this.productConfiguratorService.object3DPointerLeave.next(this.node as PolygonalObject3D);
  }

  selectObject(): void {
    if (!this.isSelectable) {
      return;
    }

    this.productConfiguratorService.object3DSelected.next(this.node as PolygonalObject3D);
  }
}
