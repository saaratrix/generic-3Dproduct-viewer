import { ProductConfigurator } from "./ProductConfigurator";
import { ProductItem } from "./models/ProductItem";
import { MeshLoader } from "./MeshLoader";
import { ProductConfigurationEvent, ProductConfiguratorService } from "../product-configurator.service";
import { Box3, Object3D, Vector3 } from "three";
import { EnvironmentMapLoader } from "./EnvironmentMapLoader";

export class ProductChanger {
  private productConfigurator: ProductConfigurator;
  private productConfigurationService: ProductConfiguratorService;

  private environmentMapLoader: EnvironmentMapLoader;

  constructor(productConfigurator: ProductConfigurator) {
    this.productConfigurator = productConfigurator;
    this.productConfigurationService = this.productConfigurator.productConfigurationService;

    this.environmentMapLoader = new EnvironmentMapLoader(productConfigurator);

    this.productConfigurationService.getSubject( ProductConfigurationEvent.Toolbar_ChangeProduct )
      .subscribe((product: ProductItem) => {
        this.changeProduct(product);
      });
  }

  public async changeProduct(product: ProductItem): Promise<void> {
    // No need to do anything if the product is the same!
    if (this.productConfigurationService.selectedProduct === product) {
      return;
    }

    const oldProduct = this.productConfigurationService.selectedProduct;
    if (oldProduct && oldProduct.object3D) {
      this.productConfigurator.scene.remove(oldProduct.object3D);
    }


    this.productConfigurationService.selectedProduct = product;
    const meshLoader = new MeshLoader(this.environmentMapLoader);

    let isNewObject = false;
    let obj: Object3D = product.object3D;
    if (!obj) {
      this.productConfigurationService.dispatch(ProductConfigurationEvent.Loading_Started);
      obj = await meshLoader.loadMesh(product.filename, product.materialInfo);
      this.productConfigurationService.dispatch(ProductConfigurationEvent.Loading_Finished);
      product.object3D = obj;
      isNewObject = true;
    }

    // For example if a user clicks 2 items while they are loading it would add both causing a visual bug!
    if (this.productConfigurationService.selectedProduct !== product) {
      return;
    }

    this.productConfigurator.scene.add(obj);

    this.toggleGammeSpace( product.useGammaSpace );
    // Update camera position
    this.updateCameraPosition(obj, isNewObject, product.hasFloor);

    return;
  }

  /**
   *
   * @param object
   * @param updateCenterPosition Updating the center position only needs to be done once.
   */
  public updateCameraPosition(object: Object3D, updateCenterPosition: boolean, hasFloor: boolean) {
    const camera = this.productConfigurator.camera;
    const cameraControls = this.productConfigurator.cameraControls;

    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3()).length();

    if (updateCenterPosition) {
      const center = box.getCenter(new Vector3());

      object.position.x = (object.position.x - center.x);
      object.position.y = (object.position.y - center.y);
      object.position.z = (object.position.z - center.z);
    }

    camera.near = size / 100;
    camera.far = size * 100;
    camera.updateProjectionMatrix();

    // Force the camera to be at certain distance.
    cameraControls.maxDistance = size * 1.15;
    cameraControls.minDistance = size * 1.15;

    cameraControls.update();

    cameraControls.maxDistance = size * 1.5;
    cameraControls.minDistance = size * 0.75;

    cameraControls.maxPolarAngle = hasFloor ?  Math.PI * 0.5 : Math.PI;

    cameraControls.update();
  }

  /**
   * Toggle between gamma space.
   * Also changes the intensity of the lights because the light intensity is different between the spaces.
   * @param value
   */
  public toggleGammeSpace(value): void {
    if (this.productConfigurator.renderer.gammaOutput === value) {
      return;
    }

    this.productConfigurator.renderer.gammaOutput = value;
    // light.intensity * factor
    // default is gamma -> non-gamma space
    let factor = this.productConfigurator.lightIntensityFactor;
    // Changing from non-gamma -> gamma
    if (value) {
      factor = 1 / this.productConfigurator.lightIntensityFactor;
    }

    for (const light of this.productConfigurator.lights) {
      light.intensity *= factor;
    }
  }
}
