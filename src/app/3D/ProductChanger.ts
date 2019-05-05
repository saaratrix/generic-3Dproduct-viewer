import ProductConfigurator from "./ProductConfigurator";
import { ProductItem } from "./models/ProductItem";
import { MeshLoader } from "./MeshLoader";
import { ProductConfiguratorService } from "../product-configurator.service";
import { Box3, Object3D, Vector3 } from "three";

export class ProductChanger {
  private productConfigurator: ProductConfigurator;
  private productConfigurationService: ProductConfiguratorService;

  private lastCreatedMesh: Object3D;

  constructor(productConfigurator: ProductConfigurator) {
    this.productConfigurator = productConfigurator;
    this.productConfigurationService = this.productConfigurator.productConfigurationService;

    this.productConfigurationService.toolbarChangeProductSubject.subscribe((product: ProductItem) => {
      this.changeProduct(product);
    });
  }

  public async changeProduct(product: ProductItem): Promise<void> {
    // No need to do anything if the product is the same!
    if (this.productConfigurationService.selectedProduct === product) {
      return;
    }

    this.productConfigurationService.selectedProduct = product;
    const meshLoader = new MeshLoader();

    const obj: Object3D = await meshLoader.loadMesh(product.filename, product.materialInfo, () => {
      if (this.lastCreatedMesh) {
        this.productConfigurator.scene.remove(this.lastCreatedMesh);
      }
    });
    this.productConfigurator.scene.add(obj);
    this.lastCreatedMesh = obj;

    // Update camera position
    this.updateCameraPosition(obj);

    return;
  }

  public updateCameraPosition(object: Object3D) {
    const camera = this.productConfigurator.camera;
    const cameraControls = this.productConfigurator.cameraControls;

    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());

    object.position.x += (object.position.x - center.x);
    object.position.y += (object.position.y - center.y);
    object.position.z += (object.position.z - center.z);
    camera.near = size / 100;
    camera.far = size * 100;
    camera.updateProjectionMatrix();

    // Force the camera to be at certain distance.
    cameraControls.maxDistance = size * 1.15;
    cameraControls.minDistance = size * 1.15;

    cameraControls.update();

    cameraControls.maxDistance = size * 1.5;
    cameraControls.minDistance = size * 0.75;

    cameraControls.update();

  }
}
