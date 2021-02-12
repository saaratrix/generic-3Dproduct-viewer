import { ProductConfiguratorService } from "../product-configurator.service";
import { Intersection, Mesh, Object3D, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { Subscription } from "rxjs";
import { SelectableObject3DUserData } from "./models/SelectableMeshesOptions/SelectableObject3DUserData";
import { SelectableMeshesOption } from "./models/SelectableMeshesOptions/SelectableMeshesOption";
import { ProductItem } from "./models/ProductItem/ProductItem";

export class SelectedProductMeshIntersector {
  private raycaster: Raycaster = new Raycaster();
  private intersectableObjects: Mesh[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private camera: PerspectiveCamera,
    private productConfiguratorService: ProductConfiguratorService,
  ) {
    this.subscriptions.push(
      this.productConfiguratorService.selectedProduct_Changed.subscribe(productItem => {
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
    for (const object of intersectableObjects) {
      const userData = object.userData as SelectableObject3DUserData;
      userData.siblings = intersectableObjects.filter(o => o !== object);
    }

    // Finally add the intersectableObjects found but skip potential duplicates
    for (const object of intersectableObjects) {
      if (this.intersectableObjects.indexOf(object) === -1) {
        this.intersectableObjects.push(object);
      }
    }
  }
}
