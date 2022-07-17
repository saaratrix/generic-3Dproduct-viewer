import type { ProductConfiguratorService } from "../product-configurator.service";
import type { Intersection, Mesh, PerspectiveCamera, Vector2 } from "three";
import { Raycaster } from "three";
import type { Subscription } from "rxjs";
import type { SelectableObject3DUserData } from "./models/selectable-meshes-options/SelectableObject3DUserData";
import type { SelectableMeshesOption } from "./models/selectable-meshes-options/SelectableMeshesOption";
import type { ProductItem } from "./models/product-item/ProductItem";

export class SelectedProductMeshIntersector {
  private raycaster: Raycaster = new Raycaster();
  private intersectableObjects: Mesh[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private camera: PerspectiveCamera,
    private productConfiguratorService: ProductConfiguratorService,
  ) {
    this.subscriptions.push(
      this.productConfiguratorService.selectedProductChanged.subscribe(productItem => {
        if (productItem.selectableMeshIntersections) {
          this.intersectableObjects = productItem.selectableMeshIntersections;
          return;
        }

        this.intersectableObjects = [];
        if (!productItem.object3D || !Array.isArray(productItem.selectableMeshesOptions)) {
          return;
        }

        for (const option of productItem.selectableMeshesOptions) {
          this.parseSelectableMeshesOption(productItem, option);
        }

        productItem.selectableMeshIntersections = this.intersectableObjects;
      }),
    );
  }

  public dispose(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public getIntersections(pointerPosition: Vector2): Intersection[] {
    this.raycaster.far = this.camera.far;
    this.raycaster.setFromCamera(pointerPosition, this.camera);
    return this.raycaster.intersectObjects(this.intersectableObjects, false);
  }

  private parseSelectableMeshesOption(productItem: ProductItem, option: SelectableMeshesOption): void {
    const intersectableObjects: Mesh[] = [];

    // TODO: Maybe change the logic so we parse over the meshes once and inside the traverse we iterate over the options.
    productItem.object3D!.traverse(object => {
      const mesh = object as Mesh;
      // Exclude all non-mesh objects
      if (!mesh.isMesh) {
        return;
      }

      // Check if the mesh is excluded
      if (Array.isArray(option.excludeMeshes) && option.excludeMeshes.includes(mesh.name)) {
        return;
      }

      // Check if the mesh is included.
      if (Array.isArray(option.includedMeshes) && !option.includedMeshes.includes(mesh.name)) {
        return;
      }
      const userData = mesh.userData as SelectableObject3DUserData;
      userData.selectableMeshesOption = option.options;
      intersectableObjects.push(mesh);
    });

    // Iterate over all objects to set the siblings.
    // If two different SelectableMeshesOption targets the same mesh the last one would win.
    if (!option.noSiblings) {
      for (const object of intersectableObjects) {
        const userData = object.userData as SelectableObject3DUserData;
        userData.siblings = intersectableObjects.filter(o => o !== object);
      }
    }

    // Finally add the intersectableObjects found but skip potential duplicates
    for (const object of intersectableObjects) {
      if (this.intersectableObjects.indexOf(object) === -1) {
        this.intersectableObjects.push(object);
      }
    }
  }
}
