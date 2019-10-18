import { ProductConfigurator } from "./ProductConfigurator";
import { ProductItem } from "./models/ProductItem";
import { MeshLoader } from "./MeshLoader";
import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { Box3, Object3D, Vector3 } from "three";
import { EnvironmentMapLoader } from "./EnvironmentMapLoader";
import { Model3D } from "./models/Model3D";
import { ModelLoadedEventData } from "./models/EventData/ModelLoadedEventData";

export class ProductChanger {
  private readonly productConfigurator: ProductConfigurator;
  private readonly productConfiguratorService: ProductConfiguratorService;

  private readonly environmentMapLoader: EnvironmentMapLoader;

  constructor(productConfigurator: ProductConfigurator) {
    this.productConfigurator = productConfigurator;
    this.productConfiguratorService = this.productConfigurator.productConfiguratorService;

    this.environmentMapLoader = new EnvironmentMapLoader(productConfigurator);

    this.productConfiguratorService.getSubject( ProductConfigurationEvent.Toolbar_ChangeProduct )
      .subscribe((product: ProductItem) => {
        this.changeProduct(product);
      });
  }

  public async changeProduct(product: ProductItem): Promise<void> {
    // No need to do anything if the product is the same!
    if (this.productConfiguratorService.selectedProduct === product) {
      return;
    }

    const oldProduct = this.productConfiguratorService.selectedProduct;
    if (oldProduct && oldProduct.object3D) {
      this.productConfigurator.scene.remove(oldProduct.object3D);
    }

    this.productConfiguratorService.selectedProduct = product;
    const meshLoader = new MeshLoader(this.productConfiguratorService, this.environmentMapLoader);

    let obj: Object3D = product.object3D;
    // TODO: Refactor the whole loading process.
    if (!obj) {
      this.productConfiguratorService.dispatch(ProductConfigurationEvent.Loading_Started);

      obj = new Object3D();
      const promises: Promise<ModelLoadedEventData>[] = [];

      for (const model of product.models) {
        promises.push(meshLoader.loadMesh(model));
      }

      const loadedModels: ModelLoadedEventData[] = await Promise.all(promises);

      for (const loadedModel of loadedModels) {
        this.setMeshTransform(loadedModel.object, loadedModel.model);
        obj.attach(loadedModel.object);
      }

      this.productConfiguratorService.dispatch(ProductConfigurationEvent.Loading_Finished);
      product.object3D = obj;
    }

    // For example if a user clicks 2 items while they are loading it would add both causing a visual bug!
    if (this.productConfiguratorService.selectedProduct !== product) {
      return;
    }

    this.productConfigurator.scene.add(obj);

    this.toggleGammeSpace( product.useGammaSpace );
    // Update camera position
    this.updateCameraPosition(obj, product.hasFloor);

    return;
  }

  /**
   * Make the center of the mesh be at origin - 0, 0, 0 then add the transform of the model.
   */
  public setMeshTransform(object: Object3D, transform: Model3D) {
    const box = new Box3().setFromObject(object);
    const center = box.getCenter(new Vector3());

    object.position.x = (object.position.x - center.x);
    object.position.y = (object.position.y - center.y);
    object.position.z = (object.position.z - center.z);

    if (transform.position) {
      object.position.add(transform.position);
    }
    if (transform.rotation) {

    }
    if (transform.scale) {
      object.scale.copy(transform.scale);
    }
  }

  /**
   *
   * @param object
   * @param hasFloor If the object has a floor. Meaning camera can't look from below.
   */
  public updateCameraPosition(object: Object3D, hasFloor: boolean) {
    const camera = this.productConfigurator.camera;
    const cameraControls = this.productConfigurator.cameraControls;

    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3()).length();

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
