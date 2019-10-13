import {
  DoubleSide,
  Group,
  Material,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
  TextureLoader,
  WebGLRenderTarget
} from "three";
import { MaterialCreator, MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { MaterialInfo } from "./models/MaterialInfo";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EnvironmentMapLoader } from "./EnvironmentMapLoader";
import { ProductConfiguratorService } from "../product-configurator.service";
import { getOnProgressCallback } from "./getOnProgressCallback";


export class MeshLoader {

  private readonly productConfiguratorService: ProductConfiguratorService;
  private readonly environmentLoader: EnvironmentMapLoader;

  constructor(productConfiguratorService: ProductConfiguratorService, environmentLoader: EnvironmentMapLoader) {
    this.productConfiguratorService = productConfiguratorService;
    this.environmentLoader = environmentLoader;
  }

  /**
   * Loads an .obj mesh with either an mtl file or raw textures.
   * @param file The filename
   * @param materialInfo The material information such as path to mtl file, textures
   * @param onMeshLoaded When the mesh has loaded.
   */
  public loadMesh(file: string, materialInfo: MaterialInfo): Promise<Object3D> {
    const promise = new Promise<Object3D>(async (resolve, reject) => {

      const fileParts: string[] = file.split(".");
      const fileExtension = fileParts[ fileParts.length - 1 ].toLowerCase();

      let object: Object3D = null;
      if (fileExtension === "obj") {
        object = await this.loadObj(file, materialInfo);
      }
      else if (fileExtension === "gltf") {
        object = await this.loadGlTF(file, materialInfo);
      }

      resolve(object);
    });
    return promise;
  }

  /**
   * Loads the material based on the MaterialInfo input.
   * @param object
   * @param materialInfo
   */
  public async loadMaterial(object: Object3D, materialInfo: any): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      if (materialInfo.mtl) {
        const mtlLoader = new MTLLoader();
        // Load the MTL file.
        mtlLoader.load(materialInfo.mtl, (materialCreator: MaterialCreator) => {

          // Load the materials
          materialCreator.preload();

          object.children.forEach((child) => {
            const mesh = child as Mesh;
            if (!mesh) {
              return;
            }

            const name: string = (mesh.material as Material).name;

            if (materialCreator.materials[ name ]) {
              mesh.material = materialCreator.materials[ name ];
            }
          });

          if (materialInfo.renderBackface) {
            this.trySetBackfaceRendering([ object ]);
          }

          resolve();
        });
      } else {
        const material = new MeshPhongMaterial({});

        const textureLoader = new TextureLoader();

        material.map = textureLoader.load(materialInfo.diffuseTexture);
        if (materialInfo.normalTexture) {
          material.normalMap = textureLoader.load(materialInfo.normalTexture);
        }

        object.children.forEach((child) => {
          const mesh = child as Mesh;
          if (!mesh) {
            return;
          }

          mesh.material = material;
        });

        if (materialInfo.renderBackface) {
          this.trySetBackfaceRendering([ object ]);
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
    const promise: Promise<Object3D> = new Promise(async (resolve, reject) => {
      const objLoader = new OBJLoader();
      // TODO: Add error handling.
      objLoader.load( file, async (group: Group) => {
        await this.loadMaterial(group, materialInfo);
        this.setReceiveShadows([ group ] );
        resolve(group);
      }, getOnProgressCallback(this.productConfiguratorService));
    });

    return promise;
  }

  private async loadGlTF(file: string, materialInfo: MaterialInfo): Promise<Object3D> {
    const promise: Promise<Object3D> = new Promise(async (resolve, reject) => {
      const loader = new GLTFLoader();

      const environmentMapUrl: string = "assets/models/pbr/Soft_4TubeBank_2BlackFlags.exr";

      const environmentPromise = this.environmentLoader.loadEnvironment(environmentMapUrl);
      // TODO: Add error handling.
      loader.load( file, async (gltfObject: GLTF) => {
        // Set the environment texture
        environmentPromise.then((texture: WebGLRenderTarget) => {
          this.setReceiveShadows(gltfObject.scene.children);
          this.trySetEnvironmentTexture(gltfObject.scene.children, texture);

          if (materialInfo.renderBackface) {
            this.trySetBackfaceRendering(gltfObject.scene.children);
          }

          resolve(gltfObject.scene.children[0]);
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

  private trySetEnvironmentTexture( children: Object3D[], texture: WebGLRenderTarget): void {
    for (const child of children) {
      const mesh = child as Mesh;
      if (mesh.material) {
        const material = mesh.material as MeshStandardMaterial;
        material.envMap = texture.texture;
        material.envMapIntensity = 0.33;
        material.needsUpdate = true;
      }

      if (child.children) {
        this.trySetEnvironmentTexture(child.children, texture);
      }
    }
  }

  private trySetBackfaceRendering(children: Object3D[]) {
    for (const child of children) {
      const mesh = child as Mesh;
      if (mesh.material) {
        (mesh.material as Material).side = DoubleSide;
      }

      if (child.children) {
        this.trySetBackfaceRendering(child.children);
      }
    }
  }
}
