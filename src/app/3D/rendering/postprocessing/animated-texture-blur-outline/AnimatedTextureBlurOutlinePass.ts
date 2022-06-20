import { FullScreenQuad, Pass } from "three/examples/jsm/postprocessing/Pass";
import {
  AdditiveBlending,
  Camera,
  Color,
  DoubleSide,
  MeshBasicMaterial,
  NoBlending,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import type { WebGLRenderTargetOptions } from "three/src/renderers/WebGLRenderTarget";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { createSeperableBlurMaterial } from "../CreateBlurMaterial";
import type { IUniform } from "three/src/renderers/shaders/UniformsLib";
import { ProductConfiguratorService } from "../../../../product-configurator.service";
import { SelectedProductHighlighter } from "../../../SelectedProductHighlighter";
import { AnimatedTextureBlurOutlineOutputMode } from "./AnimatedTextureBlurOutlineOutputMode";
import type { AnimatedTextureBlurOutlineOptions } from "./AnimatedTextureBlurOutlineOptions";
import type { ColorBlurOutlineTextures } from "./ColorBlurOutlineTextures";

// The blur shader code is adapted from three.js' OutlinePass:
// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/OutlinePass.js
export class AnimatedTextureBlurOutlinePass extends Pass {
  /**
   * The hover mask material that renders the hovered meshes into a single colour.
   */
  private readonly hoverMaskMaterial: MeshBasicMaterial;
  /**
   * The selected mask material that renders the selected meshes into a single colour.
   */
  private readonly selectedMaskMaterial: MeshBasicMaterial;

  /**
   * The hover & selected masks.
   */
  private readonly maskRenderTarget: WebGLRenderTarget;
  /**
   * This is used for the edge outline of the material.
   */
  private blurHorizontalRenderTarget!: WebGLRenderTarget;

  /**
   * This is used for the edge outline of the material.
   */
  private blurVerticalRenderTarget!: WebGLRenderTarget;

  /**
   * This is used for the glowing part of the outline.
   * It's half the render size as {@link blurHorizontalRenderTarget}.
   */
  private blurHorizontalHalfRenderTarget!: WebGLRenderTarget;

  /**
   * This is used for the glowing part of the outline.
   * It's half the render size as {@link blurVerticalRenderTarget}.
   */
  private blurVerticalHalfRenderTarget2!: WebGLRenderTarget;

  /**
   * The shader material that combines all render targets to generate the final outline.
   */
  private outlineMaterial: ShaderMaterial;

  private blurMaterial!: ShaderMaterial;
  private blurHalfMaterial!: ShaderMaterial;

  private readonly blurHorizontalDirection = new Vector2(1, 0);
  private readonly blurVerticalDirection = new Vector2(0, 1);

  /**
   * Full screen quad to render the post process effects onto.
   */
  private readonly fsQuad: FullScreenQuad;
  private readonly copyUniforms: Record<string, IUniform>;
  private readonly materialCopy: ShaderMaterial;

  /**
   * We down sample the blur materials to increase the effect of the blur.
   * @private
   */
  private readonly downsampleResolution: number = 2;

  private edgeThickness: number = 1;
  private edgeGlow: number = 2;
  private startU: number = 0;
  private tileCount: number = 1;
  private animateOutline: boolean = true;
  private interval: number = 60;
  private elapsed: number = 0;

  /**
   * We need a black colour so it doesn't interfere with the RGB channels of the outline masks.
   */
  private readonly maskClearColor: Color = new Color(0x000000);
  /**
   * The application's mask clear colour that we'll restore after the outline is done.
   */
  private tempOldClearColor: Color = new Color();

  private readonly hoverTexture: Texture;
  private readonly selectedTexture: Texture;

  constructor(
    private productConfiguratorService: ProductConfiguratorService,
    private selectedProductHighlighter: SelectedProductHighlighter,
    resolution: Vector2,
    private scene: Scene,
    private camera: Camera,
    options: AnimatedTextureBlurOutlineOptions = {},
  ) {
    super();

    // We use additive blending and depthWrite = false to sum the outlines together.
    // Otherwise, the outlines would happen where the meshes intersect instead of outlining each mesh individually.
    this.hoverMaskMaterial = new MeshBasicMaterial({
      color: 0xff0000,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    this.selectedMaskMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      side: DoubleSide,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    const renderTargetOptions: WebGLRenderTargetOptions = {
      format: RGBAFormat,
    };

    this.setOptions(options);

    this.maskRenderTarget = new WebGLRenderTarget(resolution.x, resolution.y, renderTargetOptions);
    this.maskRenderTarget.texture.name = "OutlinePass.mask";
    this.maskRenderTarget.texture.generateMipmaps = false;

    this.fsQuad = new FullScreenQuad();

    this.hoverTexture = new Texture();
    this.hoverTexture.wrapS = RepeatWrapping;

    this.selectedTexture = new Texture();
    this.selectedTexture.wrapS = RepeatWrapping;

    this.outlineMaterial = this.createOutlineMaterial(AnimatedTextureBlurOutlineOutputMode.Normal);
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

    this.productConfiguratorService.canvasResized.subscribe((size) => this.setSize(size.width, size.height));
  }

  setOptions(options: AnimatedTextureBlurOutlineOptions = {}): void {
    this.edgeThickness = options.edgeThickness ?? this.edgeThickness;
    this.edgeGlow = options.edgeGlow ?? this.edgeThickness;
    this.startU = options.startU ?? this.startU;
    this.tileCount = options.tileCount ?? this.tileCount;

    this.animateOutline = options.animateOutline ?? this.animateOutline;
    this.interval = options.animationInterval ?? this.interval;

    if (!this.outlineMaterial) {
      return;
    }

    // TODO: Add dynamic properties for edgeThickness, edgeGlow
    this.outlineMaterial.uniforms.tileCount.value = this.tileCount;
    if (!this.animateOutline) {
      this.elapsed = 0;
      this.outlineMaterial.uniforms.startU.value = this.startU;
    }
  }

  setSize(width: number, height: number): void {
    this.maskRenderTarget.setSize(width, height);

    let resX = Math.round(width / this.downsampleResolution);
    let resY = Math.round(height / this.downsampleResolution);

    this.blurHorizontalRenderTarget.setSize(resX, resY);
    this.blurMaterial.uniforms.texSize.value.set(resX, resY);

    resX = Math.round(resX / 2);
    resY = Math.round(resY / 2);

    this.blurHorizontalHalfRenderTarget.setSize(resX, resY);
    this.blurHalfMaterial.uniforms.texSize.value.set(resX, resY);
  }

  setColors(colors: ColorBlurOutlineTextures): void {
    if (colors.hover) {
      this.hoverTexture.image = colors.hover;
      this.hoverTexture.needsUpdate = true;
    }
    if (colors.selected) {
      this.selectedTexture.image = colors.selected;
      this.selectedTexture.needsUpdate = true;
    }
  }

  setOutputMode(mode: AnimatedTextureBlurOutlineOutputMode): void {
    this.outlineMaterial.dispose();
    this.outlineMaterial = this.createOutlineMaterial(mode);
  }

  private initBlurRenderTargetsAndMaterials(resolution: Vector2, renderTargetOptions: WebGLRenderTargetOptions): void {
    let resX = Math.round(resolution.x / this.downsampleResolution);
    let resY = Math.round(resolution.y / this.downsampleResolution);

    this.blurHorizontalRenderTarget = new WebGLRenderTarget(resX, resY, renderTargetOptions);
    this.blurHorizontalRenderTarget.texture.name = "OutlinePass.blur";
    this.blurHorizontalRenderTarget.texture.generateMipmaps = false;

    this.blurVerticalRenderTarget = new WebGLRenderTarget(resX, resY, renderTargetOptions);
    this.blurVerticalRenderTarget.texture.name = "OutlinePass.blur2";
    this.blurVerticalRenderTarget.texture.generateMipmaps = false;

    this.blurMaterial = createSeperableBlurMaterial(this.edgeThickness);
    this.blurMaterial.uniforms.texSize.value.set(resX, resY);
    this.blurMaterial.uniforms.kernelRadius.value = 1;

    resX = Math.round(resX / 2);
    resY = Math.round(resY / 2);

    this.blurHorizontalHalfRenderTarget = new WebGLRenderTarget(resX, resY, renderTargetOptions);
    this.blurHorizontalHalfRenderTarget.texture.name = "OutlinePass.blur.half";
    this.blurHorizontalHalfRenderTarget.texture.generateMipmaps = false;

    this.blurVerticalHalfRenderTarget2 = new WebGLRenderTarget(resX, resY, renderTargetOptions);
    this.blurVerticalHalfRenderTarget2.texture.name = "OutlinePass.blur.half2";
    this.blurVerticalHalfRenderTarget2.texture.generateMipmaps = false;

    this.blurHalfMaterial = createSeperableBlurMaterial(this.edgeGlow);
    this.blurHalfMaterial.uniforms.texSize.value.set(resX, resY);
    this.blurHalfMaterial.uniforms.kernelRadius.value = this.edgeGlow;
  }

  public render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean): void {
    this.elapsed = (this.elapsed + deltaTime) % this.interval;
    this.renderOutline(renderer, readBuffer);

    if (maskActive) {
      renderer.state.buffers.stencil.setTest( true );
    }

    if (this.renderToScreen) {
      this.fsQuad.material = this.materialCopy;
      this.copyUniforms.tDiffuse.value = readBuffer.texture;
      renderer.setRenderTarget( null );
      this.fsQuad.render( renderer );
    }
  }

  private renderOutline(renderer: WebGLRenderer, readBuffer: WebGLRenderTarget): void {
    if (!this.selectedProductHighlighter.isAnyProductHighlighted()) {
      return;
    }

    const oldAutoClear = renderer.autoClear;
    const oldClearAlpha = renderer.getClearAlpha();
    const oldClearColor = renderer.getClearColor(this.tempOldClearColor);
    renderer.setClearColor(this.maskClearColor, 0);
    // Since we're rendering multiple times to a render target we don't want to auto clear.
    renderer.autoClear = false;
    this.renderMaskTexture(renderer);
    this.renderBlurTexture(renderer);
    this.renderBlurHalfTexture(renderer);

    // This adds the outline material on top of the previous render.
    this.fsQuad.material = this.outlineMaterial;
    this.outlineMaterial.uniforms.maskTexture.value = this.maskRenderTarget.texture;
    this.outlineMaterial.uniforms.blurTexture.value = this.blurVerticalRenderTarget.texture;
    this.outlineMaterial.uniforms.blurHalfTexture.value = this.blurVerticalHalfRenderTarget2.texture;

    if (this.animateOutline) {
      const progress = this.elapsed / this.interval;
      this.outlineMaterial.uniforms.startU.value = this.startU + this.tileCount * progress;
    }

    renderer.setRenderTarget(readBuffer);
    this.fsQuad.render(renderer);

    renderer.autoClear = oldAutoClear;
    renderer.setClearColor(oldClearColor, oldClearAlpha);
  }

  /**
   * Render the mask texture which is two separate colours depending if the mesh is hovered or selected.
   */
  private renderMaskTexture(renderer: WebGLRenderer): void {
    renderer.setRenderTarget(this.maskRenderTarget);
    renderer.clear();

    this.scene.overrideMaterial = this.hoverMaskMaterial;
    this.camera.layers.set(1);
    renderer.render(this.scene, this.camera);

    this.scene.overrideMaterial = this.selectedMaskMaterial;
    this.camera.layers.set(2);
    renderer.render(this.scene, this.camera);

    this.camera.layers.set(0);
    this.scene.overrideMaterial = null;
  }

  private renderBlurTexture(renderer: WebGLRenderer): void {
    renderer.setRenderTarget(this.blurHorizontalRenderTarget);
    renderer.clear();

    this.fsQuad.material = this.blurMaterial;
    this.blurMaterial.uniforms.colorTexture.value = this.maskRenderTarget.texture;
    this.blurMaterial.uniforms.direction.value = this.blurHorizontalDirection;
    this.fsQuad.render(renderer);

    // Rendering a second time in a vertical direction fixes some issues with the lines for pointy meshes in a vertical direction.
    // For example otherwise the outline doesn't fully cover the mesh.
    renderer.setRenderTarget(this.blurVerticalRenderTarget);
    renderer.clear();
    this.blurMaterial.uniforms.colorTexture.value = this.blurHorizontalRenderTarget.texture;
    this.blurMaterial.uniforms.direction.value = this.blurVerticalDirection;
    this.fsQuad.render(renderer);
  }

  private renderBlurHalfTexture(renderer: WebGLRenderer): void {
    renderer.setRenderTarget(this.blurHorizontalHalfRenderTarget);
    renderer.clear();

    this.fsQuad.material = this.blurHalfMaterial;
    this.blurHalfMaterial.uniforms.colorTexture.value = this.maskRenderTarget.texture;
    this.blurHalfMaterial.uniforms.direction.value = this.blurHorizontalDirection;
    this.fsQuad.render(renderer);

    renderer.setRenderTarget(this.blurVerticalHalfRenderTarget2);
    renderer.clear();
    this.blurHalfMaterial.uniforms.colorTexture.value = this.blurHorizontalHalfRenderTarget.texture;
    this.blurHalfMaterial.uniforms.direction.value = this.blurVerticalDirection;
    this.fsQuad.render(renderer);
  }

  private createOutlineMaterial(outputMode: AnimatedTextureBlurOutlineOutputMode): ShaderMaterial {
    const fragmentShader = this.createOutlineFragmentShader(outputMode);

    return new ShaderMaterial({
      vertexShader:
        `varying vec2 vUv;
        varying vec3 worldPosition;
        void main() {
          vUv = uv;
          worldPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

      fragmentShader,
      uniforms: {
        maskTexture: { value: null },
        blurTexture: { value: null },
        blurHalfTexture: { value: null },
        hoverTexture: { value: this.hoverTexture },
        selectedTexture: { value: this.selectedTexture },
        startU: { value: this.startU },
        tileCount: { value: this.tileCount },
      },
      transparent: true,
    });
  }

  private createOutlineFragmentShader(outputMode: AnimatedTextureBlurOutlineOutputMode): string {
    let fragmentShader = `
    varying vec2 vUv;
    varying vec3 worldPosition;

    uniform sampler2D maskTexture;
    uniform sampler2D blurTexture;
    uniform sampler2D blurHalfTexture;

    uniform sampler2D hoverTexture;
    uniform sampler2D selectedTexture;

    uniform float startU;
    uniform float tileCount;

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

      vec2 clampedUv = vec2(worldPosition.xy * 0.5 + 0.5);
      // 1.5 would be u = 0.5 because the outline texture is looping.
      float u = startU + tileCount * clampedUv.x;
      vec2 uv = vec2(u, clampedUv.y);

      vec4 hoverColor = texture2D(hoverTexture, uv);
      vec4 selectedColor = texture2D(selectedTexture, uv);

      vec4 hover = getOutlineColor(maskColor.r, combinedBlur.r, vec3(hoverColor.xyz));
      vec4 selected = getOutlineColor(maskColor.g, combinedBlur.g, vec3(selectedColor.xyz));
    `;

    switch (outputMode) {
      case AnimatedTextureBlurOutlineOutputMode.Normal:
        fragmentShader += `
          gl_FragColor = vec4(hover.xyz + selected.xyz, max(hover.w, selected.w));
        }`;
        break;
      case AnimatedTextureBlurOutlineOutputMode.HoverTexture:
        fragmentShader += `
          gl_FragColor = vec4(hoverColor.xyz, 1.0);
        }`;
        break;
      case AnimatedTextureBlurOutlineOutputMode.SelectedTexture:
        fragmentShader += `
          gl_FragColor = vec4(selectedColor.xyz, 1.0);
        }`;
        break;
    }

    return fragmentShader;
  }
}
