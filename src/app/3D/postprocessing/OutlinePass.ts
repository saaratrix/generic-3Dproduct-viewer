import { Pass } from "three/examples/jsm/postprocessing/Pass";
import {
  Camera, DoubleSide,
  MeshBasicMaterial, NoBlending,
  RGBAFormat,
  Scene, ShaderMaterial, UniformsUtils,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget
} from "three";
import { WebGLRenderTargetOptions } from "three/src/renderers/WebGLRenderTarget";
import FullScreenQuad = Pass.FullScreenQuad;
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { createSeperableBlurMaterial } from "./CreateBlurMaterial";

export class OutlinePass extends Pass {

  private hoverMaterial: MeshBasicMaterial;
  private selectedMaterial: MeshBasicMaterial;

  private maskRenderTarget: WebGLRenderTarget;
  private blurRenderTarget: WebGLRenderTarget;

  private outlineMaterial: ShaderMaterial;

  private blurMaterial: ShaderMaterial;
  private blurHorizontalDirection = new Vector2(1, 0);
  private blurVerticalDirection = new Vector2(0, 1);

  private fsQuad: FullScreenQuad;
  private copyUniforms: any;
  private materialCopy: ShaderMaterial;

  constructor(resolution: Vector2, private scene: Scene, private camera: Camera) {
    super();

    this.hoverMaterial = new MeshBasicMaterial({
      color: 0xff0000,
      side: DoubleSide,
    });
    this.selectedMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      side: DoubleSide,
    });

    const renderTargetOptions: WebGLRenderTargetOptions = {
      format: RGBAFormat
    };

    this.maskRenderTarget = new WebGLRenderTarget(resolution.x, resolution.y, renderTargetOptions);
    this.maskRenderTarget.texture.name = "OutlinePass.mask";
    this.maskRenderTarget.texture.generateMipmaps = false;
    this.blurRenderTarget = new WebGLRenderTarget(resolution.x, resolution.y, renderTargetOptions);
    this.blurRenderTarget.texture.name = "OutlinePass.blur";
    this.blurRenderTarget.texture.generateMipmaps = false;

    this.fsQuad = new Pass.FullScreenQuad();

    this.outlineMaterial = this.createOutlineMaterial();
    this.blurMaterial = createSeperableBlurMaterial(4);
    this.blurMaterial.uniforms.texSize.value.set(resolution.x, resolution.y);
    this.blurMaterial.uniforms.kernelRadius.value = 4;

    // copy material
    if ( CopyShader === undefined ) {
      console.error("THREE.OutlinePass relies on CopyShader");
    }

    const copyShader = CopyShader;

    this.copyUniforms = UniformsUtils.clone( copyShader.uniforms );
    this.copyUniforms["opacity"].value = 1.0;

    this.materialCopy = new ShaderMaterial( {
      uniforms: this.copyUniforms,
      vertexShader: copyShader.vertexShader,
      fragmentShader: copyShader.fragmentShader,
      blending: NoBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true
    } );
  }

  public render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean): void {

    const oldAutoClear = renderer.autoClear;
    // Since we're rendering multiple times to a render target we don't want to auto clear.
    renderer.autoClear = false;
    this.renderMaskTexture(renderer);
    this.renderBlurTexture(renderer);

    this.scene.overrideMaterial = null;
    renderer.setRenderTarget(readBuffer);
    this.fsQuad.material = this.outlineMaterial;
    this.outlineMaterial.uniforms.maskTexture.value = this.maskRenderTarget.texture;
    this.outlineMaterial.uniforms.blurTexture.value = this.blurRenderTarget.texture;
    this.fsQuad.render(renderer);

    renderer.autoClear = oldAutoClear;

    if ( this.renderToScreen ) {
      this.fsQuad.material = this.materialCopy;
      this.copyUniforms["tDiffuse"].value = readBuffer.texture;
      renderer.setRenderTarget( null );
      this.fsQuad.render( renderer );
    }
  }

  /**
   * Render the mask texture which is two separate colours depending if the mesh is hovered or selected.
   */
  private renderMaskTexture(renderer: WebGLRenderer): void {
    renderer.setRenderTarget(this.maskRenderTarget);
    renderer.clear();

    this.scene.overrideMaterial = this.hoverMaterial;
    this.camera.layers.set(1);
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = this.selectedMaterial;
    this.camera.layers.set(2);
    renderer.render(this.scene, this.camera);
  }

  private renderBlurTexture(renderer: WebGLRenderer): void {
    renderer.setRenderTarget(this.blurRenderTarget);
    renderer.clear();

    this.fsQuad.material = this.blurMaterial;
    this.blurMaterial.uniforms.colorTexture.value = this.maskRenderTarget.texture;
    this.blurMaterial.uniforms.direction.value = this.blurHorizontalDirection;
    this.fsQuad.render(renderer);

    this.blurMaterial.uniforms.colorTexture.value = this.blurRenderTarget.texture;
    this.blurMaterial.uniforms.direction.value = this.blurVerticalDirection;
    this.fsQuad.render(renderer);
  }

  private createOutlineMaterial(): ShaderMaterial {
    const material = new ShaderMaterial({
      vertexShader:
        "varying vec2 vUv;\n\
        void main() {\n\
          vUv = uv;\n\
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
        }",

      fragmentShader:
        "varying vec2 vUv;\
        uniform sampler2D maskTexture;\
				uniform sampler2D blurTexture;\
				\
				vec4 getOutlineColor(float mask, float blur, vec3 outlineColor)\
        {\
          float blurOutline = clamp((blur - mask) * 2.5, 0.0, 1.0);\
          return vec4(outlineColor.x * blurOutline, outlineColor.y * blurOutline, outlineColor.z * blurOutline, blurOutline);\
        }\
				\
				void main() {\
					vec4 maskColor = texture2D(maskTexture, vUv);\
					vec4 blurColor = texture2D(blurTexture, vUv);\
					vec4 hoverColor = getOutlineColor(maskColor.r, blurColor.r, vec3(1.0, 1.0, 1.0));\
					vec4 finalColor = vec4(blurColor.xyz - maskColor.xyz, 1.0);\
					gl_FragColor = finalColor;\
				}",
      uniforms: {
        maskTexture: { value: null, },
        blurTexture: { value: null, },
      },
      transparent: true,
    });

    return material;
  }
}
