import {
  DoubleSide,
  Group,
  Material,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Texture,
  TextureLoader,
  VertexColors
} from "three";
// import { MTLLoader } from "./3rd-party/MTLLoader";
import { MaterialCreator, MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { MaterialInfo } from "./models/MaterialInfo";

export class MeshLoader {

  /**
   * Loads an .obj mesh with either an mtl file or raw textures.
   * @param file The filename
   * @param materialInfo The material information such as path to mtl file, textures
   * @param onMeshLoaded When the mesh has loaded.
   */
  public loadMesh(file: string, materialInfo: MaterialInfo): Promise<Object3D> {
    const promise = new Promise<Object3D>(async (resolve, reject) => {
      const object: Object3D = await this.loadObj(file, materialInfo);
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
              if (materialInfo.renderBackface) {
                mesh.material.side = DoubleSide;
              }
            }
          });

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
        resolve(group);
      });
    });

    return promise;
  }
}
