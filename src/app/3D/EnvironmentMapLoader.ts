import { HalfFloatType, LinearEncoding, NearestFilter, WebGLRenderTarget } from "three";
import { EXRLoader } from "./3rd-party/EXRLoader";
import { EquirectangularToCubeGenerator } from "./3rd-party/EquirectangularToCubeGenerator";
import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator";
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker";
import { ProductConfigurator } from "./ProductConfigurator";
import { ProductConfigurationEvent } from "../product-configurator.service";
import { getOnProgressCallback } from "./getOnProgressCallback";

export class EnvironmentMapLoader {
  public environments: { [key: string]: Promise<WebGLRenderTarget> } = {};

  private productConfigurator: ProductConfigurator;

  constructor(productChanger: ProductConfigurator) {
    this.productConfigurator = productChanger;
  }

  public loadEnvironment(file: string): Promise<WebGLRenderTarget> {

    if (this.environments[file]) {
      return this.environments[file];
    }

    const promise: Promise<WebGLRenderTarget> = new Promise(async (resolve, reject) => {

      let exrBackground: any;
      let exrCubeRenderTarget: any;
      const renderer = this.productConfigurator.renderer;

      new EXRLoader().load( file, ( texture ) => {
        texture.minFilter = NearestFilter;
        // texture.magFilter = THREE.NearestFilter;
        texture.encoding = LinearEncoding;

        const cubemapGenerator = new EquirectangularToCubeGenerator( texture, { resolution: 512, type: HalfFloatType } );
        exrBackground = cubemapGenerator.renderTarget;
        const cubeMapTexture = cubemapGenerator.update( renderer );

        const pmremGenerator = new PMREMGenerator( cubeMapTexture );
        pmremGenerator.update( renderer );

        const pmremCubeUVPacker = new PMREMCubeUVPacker( pmremGenerator.cubeLods );
        pmremCubeUVPacker.update( renderer );

        exrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

        texture.dispose();
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();

        // this.productConfigurator.scene.background = exrBackground;
        resolve(exrCubeRenderTarget);
      }, getOnProgressCallback(this.productConfigurator.productConfigurationService));
    });

    this.environments[file] = promise;

    return promise;
  }
}
