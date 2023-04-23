import type { ProductConfigurator } from './product-configurator';
import type { ProductItem } from './models/product-item/product-item';
import { ProductModelLoader } from './loaders/product-model-loader';
import type { ProductConfiguratorService } from '../shared/product-configurator.service';
import { Box3, Object3D, Vector3 } from 'three';
import { EnvironmentMapLoader } from './loaders/environment-map-loader';
import type { Model3D } from './models/model-3D';
import type { ModelLoadedEventData } from './models/event-data/model-loaded-event-data';
import type { SubProductItem } from './models/product-item/sub-product-item';

export class ProductChanger {
  private readonly productConfiguratorService: ProductConfiguratorService;

  private readonly environmentMapLoader: EnvironmentMapLoader;

  constructor(private readonly productConfigurator: ProductConfigurator) {
    this.productConfigurator = productConfigurator;
    this.productConfiguratorService = this.productConfigurator.productConfiguratorService;

    this.environmentMapLoader = new EnvironmentMapLoader(productConfigurator);

    this.productConfiguratorService.toolbarChangeProduct.subscribe(product => this.changeProduct(product));
  }

  /**
   * Change the visible product to the input product.
   */
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


    let obj: Object3D | undefined = product.object3D;
    if (!obj) {
      obj = await this.loadProduct(product);
    }

    // For example if a user clicks 2 items while they are loading it would add both causing a visual bug!
    if (this.productConfiguratorService.selectedProduct !== product) {
      return;
    }

    this.productConfigurator.scene.add(obj);
    // Update camera position
    this.updateCameraPosition(obj, product.hasFloor);

    const urlParts = ['model', product.id];
    if (product.selectedSubItem) {
      const selectedSubItem = product.selectedSubItem as SubProductItem;
      urlParts.push(selectedSubItem.id.toString());
    }

    this.productConfiguratorService.selectedProductChanged.next(this.productConfiguratorService.selectedProduct);
    this.productConfigurator.router.navigate(urlParts).then();
  }

  private async loadProduct(product: ProductItem): Promise<Object3D> {
    const modelLoader = new ProductModelLoader(this.productConfiguratorService, this.environmentMapLoader);
    this.productConfiguratorService.loadingStarted.next();

    const object = new Object3D();
    const promises: Promise<ModelLoadedEventData>[] = [];

    for (const model of product.models) {
      promises.push(modelLoader.loadModel(model));
    }

    const loadedModels: ModelLoadedEventData[] = await Promise.all(promises);

    for (const loadedModel of loadedModels) {
      if (!loadedModel.object) {
        continue;
      }

      this.setObject3DTransform(loadedModel.object, loadedModel.model);
      object.attach(loadedModel.object);
    }
    // Finally set the whole object at origin.
    this.setObjectAtOrigin(object);

    this.productConfiguratorService.loadingFinished.next();
    product.object3D = object;

    this.productConfiguratorService.productLoadingFinished.next({
      product,
      isSelectedProduct: this.productConfiguratorService.selectedProduct === product,
    });

    return object;
  }

  /**
   * Set position, rotation and scale for the object.
   */
  public setObject3DTransform(object: Object3D, model: Model3D): void {
    if (model.position) {
      object.position.add(model.position);
    }
    if (model.rotation) {
      object.rotation.copy(model.rotation);
    }
    if (model.scale) {
      object.scale.copy(model.scale);
    }
  }

  /**
   * Position the object at 0, 0, 0
   */
  public setObjectAtOrigin(object: Object3D): void {
    const box = new Box3().setFromObject(object);
    const center = box.getCenter(new Vector3());

    object.position.x = (object.position.x - center.x);
    object.position.y = (object.position.y - center.y);
    object.position.z = (object.position.z - center.z);
  }

  /**
   *
   * @param object
   * @param hasFloor If the object has a floor. Meaning camera can't look from below.
   */
  public updateCameraPosition(object: Object3D, hasFloor: boolean): void {
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
    cameraControls.minDistance = size * 0.55;

    cameraControls.maxPolarAngle = hasFloor ? Math.PI * 0.5 : Math.PI;

    cameraControls.update();
  }
}
