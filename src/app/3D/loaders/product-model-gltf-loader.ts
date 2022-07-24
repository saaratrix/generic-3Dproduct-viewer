import type { MaterialInfo } from "../models/material-info";
import type { ProductModelFiletypeLoader } from "./product-model-filetype-loader";
import { Group, Object3D, WebGLRenderTarget } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { getOnProgressCallback } from "../get-on-progress-callback";
import type { EnvironmentMapLoader } from "./environment-map-loader";
import type { ProductModelLoader } from "./product-model-loader";
import type { ProductConfiguratorService } from "../../product-configurator.service";

export class ProductModelGltfLoader implements ProductModelFiletypeLoader {
  constructor(
    private readonly productModelLoader: ProductModelLoader,
    private readonly productConfiguratorService: ProductConfiguratorService,
    private readonly environmentLoader: EnvironmentMapLoader,
  ) {}

  load(file: string, materialInfo: MaterialInfo): Promise<Object3D> {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      const environmentMapUrl: string = "assets/models/pbr/Soft_4TubeBank_2BlackFlags.exr";
      const environmentPromise = this.environmentLoader.loadEnvironment(environmentMapUrl);

      loader.load(file, async (gltfObject: GLTF) => {
        // Set the environment texture
        environmentPromise.then((texture: WebGLRenderTarget) => {
          const rootObject = new Group();
          for (const scene of gltfObject.scenes) {
            rootObject.add(...scene.children);
          }

          this.productModelLoader.setReceiveShadows(rootObject.children);
          this.productModelLoader.trySetEnvironmentTexture(rootObject.children, texture);

          if (materialInfo.renderBackface) {
            this.productModelLoader.trySetBackfaceRendering(rootObject.children);
          }

          resolve(rootObject);
        });
      }, getOnProgressCallback(this.productConfiguratorService));
    });
  }
}
