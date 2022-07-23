import type { Material, MeshStandardMaterial, Object3D, WebGLRenderTarget } from "three";
import { DoubleSide, Group, MeshPhongMaterial, TextureLoader } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import type { MaterialInfo } from "./models/material-info";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import type { EnvironmentMapLoader } from "./environment-map-loader";
import type { ProductConfiguratorService } from "../product-configurator.service";
import { getOnProgressCallback } from "./get-on-progress-callback";
import type { Model3D } from "./models/model-3D";
import type { ModelLoadedEventData } from "./models/event-data/model-loaded-event-data";
import { isPolygonalObject3D } from "./3rd-party/three/types/is-three-js-custom-type";

export class ProductModelLoader {

  private readonly productConfiguratorService: ProductConfiguratorService;
  private readonly environmentLoader: EnvironmentMapLoader;

  constructor(productConfiguratorService: ProductConfiguratorService, environmentLoader: EnvironmentMapLoader) {
    this.productConfiguratorService = productConfiguratorService;
    this.environmentLoader = environmentLoader;
  }

  /**
   * Loads model differently based on file extension.
   */
  public loadModel(model: Model3D): Promise<ModelLoadedEventData> {
    const promise = new Promise<ModelLoadedEventData>((resolve) => {

      const fileParts: string[] = model.filename.split(".");
      const fileExtension = fileParts[fileParts.length - 1].toLowerCase();

      let promise: Promise<Object3D | undefined> | undefined;
      if (fileExtension === "obj") {
        promise = this.loadObj(model.filename, model.materialInfo);
      } else if (fileExtension === "gltf") {
        promise = this.loadGlTF(model.filename, model.materialInfo);
      } else {
        promise = Promise.resolve(undefined);
      }

      promise.then((object) => {
        resolve({
          object,
          model,
        });
      });
    });
    return promise;
  }

  /**
   * Loads the material based on the MaterialInfo input.
   */
  public async loadMaterial(object: Group, materialInfo: MaterialInfo): Promise<void> {
    const promise = new Promise<void>((resolve) => {
      if (materialInfo.mtl) {
        const mtlLoader = new MTLLoader();
        // Load the MTL file.
        mtlLoader.load(materialInfo.mtl, (materialCreator: MTLLoader.MaterialCreator) => {
          // Load the materials
          materialCreator.preload();

          object.traverse((o) => {
            if (!isPolygonalObject3D(o)) {
              return;
            }

            const name: string = (o.material as Material).name;

            if (materialCreator.materials[name]) {
              o.material = materialCreator.materials[name];
            }
          });

          if (materialInfo.renderBackface) {
            this.trySetBackfaceRendering([object]);
          }

          resolve();
        });
      } else {
        const material = new MeshPhongMaterial({});

        const textureLoader = new TextureLoader();

        if (materialInfo.diffuseTexture) {
          material.map = textureLoader.load(materialInfo.diffuseTexture);
        }
        if (materialInfo.normalTexture) {
          material.normalMap = textureLoader.load(materialInfo.normalTexture);
        }

        object.children.forEach((child) => {
          if (!isPolygonalObject3D(child)) {
            return;
          }

          child.material = material;
        });

        if (materialInfo.renderBackface) {
          this.trySetBackfaceRendering([object]);
        }

        resolve();
      }
    });

    return promise;
  }

  /**
   * Loads an OBJ file and the sets the material.
   * @param file
   * @param materialInfo
   */
  private async loadObj(file: string, materialInfo: MaterialInfo): Promise<Object3D> {
    const promise: Promise<Object3D> = new Promise((resolve) => {
      const objLoader = new OBJLoader();
      // TODO: Add error handling.
      objLoader.load(file, async (group: Group) => {
        await this.loadMaterial(group, materialInfo);
        this.setReceiveShadows([group]);
        resolve(group);
      }, getOnProgressCallback(this.productConfiguratorService));
    });

    return promise;
  }

  private async loadGlTF(file: string, materialInfo: MaterialInfo): Promise<Object3D> {
    const promise: Promise<Object3D> = new Promise((resolve) => {
      const loader = new GLTFLoader();

      const environmentMapUrl: string = "assets/models/pbr/Soft_4TubeBank_2BlackFlags.exr";

      const environmentPromise = this.environmentLoader.loadEnvironment(environmentMapUrl);
      // TODO: Add error handling.
      loader.load(file, async (gltfObject: GLTF) => {
        // Set the environment texture
        environmentPromise.then((texture: WebGLRenderTarget) => {
          const rootObject = new Group();
          for (const scene of gltfObject.scenes) {
            rootObject.add(...scene.children);
          }

          this.setReceiveShadows(rootObject.children);
          this.trySetEnvironmentTexture(rootObject.children, texture);

          if (materialInfo.renderBackface) {
            this.trySetBackfaceRendering(rootObject.children);
          }

          resolve(rootObject);
        });
      }, getOnProgressCallback(this.productConfiguratorService));
    });

    return promise;
  }

  private setReceiveShadows(children: Object3D[]): void {
    for (const child of children) {
      child.receiveShadow = true;
      child.castShadow = true;

      if (child.children) {
        this.setReceiveShadows(child.children);
      }
    }
  }

  private trySetEnvironmentTexture(children: Object3D[], texture: WebGLRenderTarget): void {
    for (const child of children) {
      if (!isPolygonalObject3D(child)) {
        continue;
      }

      const material = child.material as MeshStandardMaterial;
      material.envMap = texture.texture;
      material.envMapIntensity = 0.0625;
      material.needsUpdate = true;

      if (child.children) {
        this.trySetEnvironmentTexture(child.children, texture);
      }
    }
  }

  private trySetBackfaceRendering(children: Object3D[]): void {
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
