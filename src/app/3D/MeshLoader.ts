import { DoubleSide, Group, Material, Mesh, MeshPhongMaterial, Object3D, Texture, TextureLoader } from "three";
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
  public async loadMesh(file: string, materialInfo: MaterialInfo, onMeshLoaded?: () => void): Promise<Object3D> {
    const promise = new Promise<Object3D>((resolve, reject) => {
      const objLoader = new OBJLoader();
      // TODO: Add error handling.
      objLoader.load( file, (group: Group) => {
        if (onMeshLoaded) { onMeshLoaded(); }

        if (materialInfo.mtl) {
          const mtlLoader = new MTLLoader();
          // Load the MTL file.
          mtlLoader.load(materialInfo.mtl, (materialCreator: MaterialCreator) => {

            // Load the materials
            materialCreator.preload();

            group.children.forEach((child) => {
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

            resolve(group);
          });
        } else {
          const material = new MeshPhongMaterial({});

          const textureLoader = new TextureLoader();

          material.map = textureLoader.load(materialInfo.diffuseTexture);
          material.normalMap = textureLoader.load(materialInfo.normalTexture);

          group.children.forEach((child) => {
            const mesh = child as Mesh;
            if (!mesh) {
              return;
            }

            mesh.material = material;
          });

          resolve(group);
        }
      });
    });
    return promise;
  }

  public async loadMaterial(object: Object3D, materialInfo: any): Promise<void> {
    return null;
  }
}
