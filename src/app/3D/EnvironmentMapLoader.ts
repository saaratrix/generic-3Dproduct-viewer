import { HalfFloatType, LinearEncoding, NearestFilter, WebGLRenderTarget } from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { EquirectangularToCubeGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator";
import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator";
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker";
import { ProductConfigurator } from "./ProductConfigurator";
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
        texture.encoding = LinearEncoding;

        const cubemapGenerator = new EquirectangularToCubeGenerator( texture, { resolution: 512, type: HalfFloatType } );
        // ignore ts error because the typings file doesn't declare render target.
        // @ts-ignore
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
      }, getOnProgressCallback(this.productConfigurator.productConfiguratorService));
    });

    this.environments[file] = promise;

    return promise;
  }
}
