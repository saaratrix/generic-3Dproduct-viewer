import type { ProductModelFiletypeLoader } from "./product-model-filetype-loader";
import type { ProductModelLoader } from "./product-model-loader";
import type { ProductConfiguratorService } from "../../product-configurator.service";
import { Group, Material, MeshPhongMaterial, Object3D, TextureLoader } from "three";
import type { MaterialInfo } from "../models/material-info";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { isPolygonalObject3D } from "../3rd-party/three/types/is-three-js-custom-type";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { getOnProgressCallback } from "../get-on-progress-callback";

export class ProductModelObjLoader implements ProductModelFiletypeLoader {
  constructor(
    private readonly productModelLoader: ProductModelLoader,
    private readonly productConfiguratorService: ProductConfiguratorService,
  ) {}

  /**
   * Loads an OBJ file and the sets the material.
   * @param file
   * @param materialInfo
   */
  load(file: string, materialInfo: MaterialInfo): Promise<Object3D> {
    return new Promise((resolve) => {
      const objLoader = new OBJLoader();
      // TODO: Add error handling.
      objLoader.load(file, async (group: Group) => {
        await this.loadMaterial(group, materialInfo);
        this.productModelLoader.setReceiveShadows([group]);
        resolve(group);
      }, getOnProgressCallback(this.productConfiguratorService));
    });
  }

  /**
   * Loads the material based on the MaterialInfo input.
   */
  private async loadMaterial(group: Group, materialInfo: MaterialInfo): Promise<void> {
    // return new Promise<void>((resolve) => {
    if (materialInfo.mtl) {
      return this.loadMaterialMtl(group, materialInfo);
    }

    return this.loadMaterialTextures(group, materialInfo);
  }

  /**
   * Load and set up the materials from a mtl file.
   */
  private loadMaterialMtl(group: Group, materialInfo: MaterialInfo): Promise<void> {
    return new Promise(resolve => {
      const mtlLoader = new MTLLoader();
      // Load the MTL file.
      mtlLoader.load(materialInfo.mtl!, (materialCreator: MTLLoader.MaterialCreator) => {
        // Load the materials
        materialCreator.preload();

        group.traverse((o) => {
          if (!isPolygonalObject3D(o)) {
            return;
          }

          const name: string = (o.material as Material).name;

          if (materialCreator.materials[name]) {
            o.material = materialCreator.materials[name];
          }
        });

        if (materialInfo.renderBackface) {
          this.productModelLoader.trySetBackfaceRendering([group]);
        }
        resolve();
      });
    });
  }

  /**
   * Create a material and load textures and then set that material for all objects.
   */
  private loadMaterialTextures(group: Group, materialInfo: MaterialInfo): Promise<void> {
    const material = new MeshPhongMaterial({});
    const textureLoader = new TextureLoader();

    if (materialInfo.diffuseTexture) {
      material.map = textureLoader.load(materialInfo.diffuseTexture);
    }
    if (materialInfo.normalTexture) {
      material.normalMap = textureLoader.load(materialInfo.normalTexture);
    }

    group.children.forEach((child) => {
      if (!isPolygonalObject3D(child)) {
        return;
      }

      child.material = material;
    });

    if (materialInfo.renderBackface) {
      this.productModelLoader.trySetBackfaceRendering([group]);
    }

    return Promise.resolve();
  }
}
