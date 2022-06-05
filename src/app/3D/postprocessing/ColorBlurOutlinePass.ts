import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass";
import {
  AdditiveBlending,
  Camera,
  Color,
  DoubleSide,
  MeshBasicMaterial,
  NoBlending,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import type { WebGLRenderTargetOptions } from "three/src/renderers/WebGLRenderTarget";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { createSeperableBlurMaterial } from "./CreateBlurMaterial";
import type { IUniform } from "three/src/renderers/shaders/UniformsLib";

// The blur shader code is adapted from three.js' OutlinePass:
// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/OutlinePass.js
export class ColorBlurOutlinePass extends Pass {

  private readonly hoverMaterial: MeshBasicMaterial;
  private readonly selectedMaterial: MeshBasicMaterial;

  private readonly maskRenderTarget: WebGLRenderTarget;
  /**
   * This is the edge outline of the material.
   */
  private blurRenderTarget!: WebGLRenderTarget;
  /**
   * This is the glowing part of the outline.
   */
  private blurRenderHalfTarget!: WebGLRenderTarget;

  private readonly outlineMaterial: ShaderMaterial;

  private blurMaterial!: ShaderMaterial;
  private blurHalfMaterial!: ShaderMaterial;

  private blurHorizontalDirection = new Vector2(1, 0);
  private blurVerticalDirection = new Vector2(0, 1);

  private fsQuad: FullScreenQuad;
  private readonly copyUniforms: Record<string, IUniform>;
  private readonly materialCopy: ShaderMaterial;

  private downsampleResolution: number = 2;

  private readonly edgeThickness: number = 1;
  private readonly edgeGlow: number = 2;

  constructor(resolution: Vector2, private scene: Scene, private camera: Camera) {
    super();

    // We use additive blending and depthWrite = false to sum the outlines together.
    // Otherwise, the outlines would happen where the meshes intersect instead of outlining each mesh individually.
    this.hoverMaterial = new MeshBasicMaterial({
      color: 0xff0000,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    this.selectedMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    const renderTargetOptions: WebGLRenderTargetOptions = {
      format: RGBAFormat,
    };

    this.maskRenderTarget = new WebGLRenderTarget(resolution.x, resolution.y, renderTargetOptions);
    this.maskRenderTarget.texture.name = "OutlinePass.mask";
    this.maskRenderTarget.texture.generateMipmaps = false;

    this.fsQuad = new FullScreenQuad();

    this.outlineMaterial = this.createOutlineMaterial();
    this.initBlurRenderTargetsAndMaterials(resolution, renderTargetOptions);
    // copy material
    if (CopyShader === undefined) {
      console.error("THREE.OutlinePass relies on CopyShader");
    }

    this.copyUniforms = UniformsUtils.clone(CopyShader.uniforms);
    this.copyUniforms.opacity.value = 1.0;

    this.materialCopy = new ShaderMaterial({
      uniforms: this.copyUniforms,
      vertexShader: CopyShader.vertexShader,
      fragmentShader: CopyShader.fragmentShader,
      blending: NoBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });
  }

  private initBlurRenderTargetsAndMaterials(resolution: Vector2, renderTargetOptions: WebGLRenderTargetOptions): void {
    let resX = Math.round(resolution.x / this.downsampleResolution);
    let resY = Math.round(resolution.y / this.downsampleResolution);

    this.blurRenderTarget = new WebGLRenderTarget(resX, resY, renderTargetOptions);
    this.blurRenderTarget.texture.name = "OutlinePass.blur";
    this.blurRenderTarget.texture.generateMipmaps = false;

    this.blurMaterial = createSeperableBlurMaterial(this.edgeThickness);
    this.blurMaterial.uniforms.texSize.value.set(resX, resY);
    this.blurMaterial.uniforms.kernelRadius.value = 1;

    resX = Math.round(resX / 2);
    resY = Math.round(resY / 2);

    this.blurRenderHalfTarget = new WebGLRenderTarget(resX, resY, renderTargetOptions);
    this.blurRenderHalfTarget.texture.name = "OutlinePass.blur.half";
    this.blurRenderHalfTarget.texture.generateMipmaps = false;

    this.blurHalfMaterial = createSeperableBlurMaterial(this.edgeGlow);
    this.blurHalfMaterial.uniforms.texSize.value.set(resX, resY);
    this.blurHalfMaterial.uniforms.kernelRadius.value = this.edgeGlow;
  }

  public render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean): void {
    const oldAutoClear = renderer.autoClear;
    const oldClearAlpha = renderer.getClearAlpha();
    const oldClearColor = renderer.getClearColor(new Color());
    renderer.setClearColor(new Color(0x000000), 0);
    // Since we're rendering multiple times to a render target we don't want to auto clear.
    renderer.autoClear = false;
    this.renderMaskTexture(renderer);
    this.renderBlurTexture(renderer);
    this.renderBlurHalfTexture(renderer);

    // This adds the outline material on top of the previous render.
    this.fsQuad.material = this.outlineMaterial;
    this.outlineMaterial.uniforms.maskTexture.value = this.maskRenderTarget.texture;
    this.outlineMaterial.uniforms.blurTexture.value = this.blurRenderTarget.texture;
    this.outlineMaterial.uniforms.blurHalfTexture.value = this.blurRenderHalfTarget.texture;
    renderer.setRenderTarget(readBuffer);
    this.fsQuad.render(renderer);

    renderer.autoClear = oldAutoClear;
    renderer.setClearColor(oldClearColor, oldClearAlpha);

    if (this.renderToScreen) {
      this.fsQuad.material = this.materialCopy;
      this.copyUniforms.tDiffuse.value = readBuffer.texture;
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

    this.camera.layers.set(0);
    this.scene.overrideMaterial = null;
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

  private renderBlurHalfTexture(renderer: WebGLRenderer): void {
    renderer.setRenderTarget(this.blurRenderHalfTarget);
    renderer.clear();

    this.fsQuad.material = this.blurHalfMaterial;
    this.blurHalfMaterial.uniforms.colorTexture.value = this.maskRenderTarget.texture;
    this.blurHalfMaterial.uniforms.direction.value = this.blurHorizontalDirection;
    this.fsQuad.render(renderer);

    this.blurHalfMaterial.uniforms.colorTexture.value = this.blurRenderHalfTarget.texture;
    this.blurHalfMaterial.uniforms.direction.value = this.blurVerticalDirection;
    this.fsQuad.render(renderer);
  }

  private createOutlineMaterial(): ShaderMaterial {
    return new ShaderMaterial({
      vertexShader:
        `varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

      fragmentShader:
        `varying vec2 vUv;
        uniform sampler2D maskTexture;
				uniform sampler2D blurTexture;
				uniform sampler2D blurHalfTexture;

				vec4 getOutlineColor(float mask, float blur, vec3 outlineColor)
        {
          float blurOutline = clamp((blur - mask) * 2.5, 0.0, 1.0);
          return vec4(outlineColor.x * blurOutline, outlineColor.y * blurOutline, outlineColor.z * blurOutline, blurOutline);
        }

				void main() {
					vec4 maskColor = texture2D(maskTexture, vUv);
					vec4 blurColor = texture2D(blurTexture, vUv);
					vec4 blurHalfColor = texture2D(blurHalfTexture, vUv);

					vec3 combinedBlur = min(blurColor.xyz + blurHalfColor.xyz, vec3(1.0, 1.0, 1.0));

					vec4 hoverColor = getOutlineColor(maskColor.r, combinedBlur.r, vec3(0.0, 0.0, 1.0));
					vec4 selectedColor = getOutlineColor(maskColor.g, combinedBlur.g, vec3(0.0, 1.0, 0.0));
					vec4 finalColor = vec4(hoverColor.xyz + selectedColor.xyz, max(hoverColor.w, selectedColor.w));
					gl_FragColor = finalColor;
				}`,
      uniforms: {
        maskTexture: { value: null },
        blurTexture: { value: null },
        blurHalfTexture: { value: null },
      },
      transparent: true,
    });
  }
}
