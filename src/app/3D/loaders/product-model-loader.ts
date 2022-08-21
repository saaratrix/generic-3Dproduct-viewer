import type { Material, MeshStandardMaterial, Object3D, WebGLRenderTarget } from 'three';
import { DoubleSide } from 'three';
import type { EnvironmentMapLoader } from './environment-map-loader';
import type { ProductConfiguratorService } from '../../product-configurator.service';
import type { Model3D } from '../models/model-3D';
import type { ModelLoadedEventData } from '../models/event-data/model-loaded-event-data';
import { isPolygonalObject3D } from '../3rd-party/three/types/is-three-js-custom-type';
import { ProductModelFiletypeLoader } from './product-model-filetype-loader';
import { ProductModelGltfLoader } from './product-model-gltf-loader';
import { ProductModelObjLoader } from './product-model-obj-loader';

export class ProductModelLoader {
  constructor(
    private readonly productConfiguratorService: ProductConfiguratorService,
    private readonly environmentLoader: EnvironmentMapLoader,
  ) {}

  /**
   * Loads model differently based on file extension.
   */
  public loadModel(model: Model3D): Promise<ModelLoadedEventData> {
    const promise = new Promise<ModelLoadedEventData>((resolve) => {
      const modelLoader = this.getModelLoader(model);

      const promise = modelLoader?.load(model.filename, model.materialInfo) ?? Promise.resolve(undefined);
      promise.then((object) => {
        resolve({
          object,
          model,
        });
      });
    });
    return promise;
  }

  private getModelLoader(model: Model3D): ProductModelFiletypeLoader | undefined {
    const fileParts: string[] = model.filename.split('.');
    const fileExtension = fileParts[fileParts.length - 1].toLowerCase();

    switch (fileExtension) {
      case 'obj':
        return new ProductModelObjLoader(this, this.productConfiguratorService);
      case 'gltf':
        return new ProductModelGltfLoader(this, this.productConfiguratorService, this.environmentLoader);
      default:
        return undefined;
    }
  }

  public setReceiveShadows(children: Object3D[]): void {
    for (const child of children) {
      child.receiveShadow = true;
      child.castShadow = true;

      if (child.children) {
        this.setReceiveShadows(child.children);
      }
    }
  }

  public trySetEnvironmentTexture(children: Object3D[], texture: WebGLRenderTarget): void {
    for (const child of children) {
      if (isPolygonalObject3D(child)) {
        const material = child.material as MeshStandardMaterial;
        material.envMap = texture.texture;
        material.envMapIntensity = 0.0625;
        material.needsUpdate = true;
      }

      if (child.children) {
        this.trySetEnvironmentTexture(child.children, texture);
      }
    }
  }

  public trySetBackfaceRendering(children: Object3D[]): void {
    for (const child of children) {
      if (isPolygonalObject3D(child)) {
        (child.material as Material).side = DoubleSide;
      }

      if (child.children) {
        this.trySetBackfaceRendering(child.children);
      }
    }
  }
}
