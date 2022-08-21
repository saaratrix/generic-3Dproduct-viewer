import type { ProductConfiguratorService } from '../../product-configurator.service';
import type { Subscription } from 'rxjs';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import type { Camera, Scene, WebGLRenderer } from 'three';
import { Vector2 } from 'three';
import { AnimatedTextureBlurOutlinePass } from './postprocessing/animated-texture-blur-outline/animated-texture-blur-outline-pass';
import type { ProductItem } from '../models/product-item/product-item';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import type { SelectedProductHighlighter } from '../selected-product-highlighter';
import { generateLinearGradientTexture } from './postprocessing/animated-texture-blur-outline/outline-texture-generators/generate-linear-gradient-texture';

/**
 * Combines the effects used for post processing.
 */
export class EffectComposerHandler {
  private composer!: EffectComposer;
  private outlinePass: AnimatedTextureBlurOutlinePass;
  private gammaCorrectionPass: ShaderPass;

  private subscription: Subscription;

  constructor(
    productConfiguratorService: ProductConfiguratorService,
    selectedProductHighlighter: SelectedProductHighlighter,
    renderer: WebGLRenderer,
    scene: Scene,
    camera: Camera,
  ) {
    this.subscription = productConfiguratorService.selectedProductChanged.subscribe(product => this.onSelectedProductChanged(product));

    this.composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);

    const tileCount = 5;
    this.outlinePass = new AnimatedTextureBlurOutlinePass(productConfiguratorService, selectedProductHighlighter, renderer.getSize(new Vector2(0, 0)), scene, camera, {
      tileCount,
      animateOutline: true,
    });

    this.generateOutlineTextures(tileCount);

    this.composer.addPass(renderPass);
    this.composer.addPass(this.gammaCorrectionPass);
    this.composer.addPass(this.outlinePass);
  }

  dispose(): void {
    this.subscription.unsubscribe();
  }

  private onSelectedProductChanged(product: ProductItem): void {
    this.gammaCorrectionPass.enabled = product.useGammaSpace;
  }

  render(): void {
    this.composer.render();
  }

  setSize(width: number, height: number): void {
    this.composer.setSize(width, height);
  }

  private generateOutlineTextures(tileCount: number): void {
    let dimensions = Math.min(Math.max(window.innerWidth, 256) / tileCount, 1024);
    // Nearest power of 2
    // Source: https://stackoverflow.com/a/42799104/2437350
    dimensions = 1 << 31 - Math.clz32(dimensions);
    this.outlinePass.setColors({ selected: generateLinearGradientTexture({
      width: dimensions,
      height: dimensions,
      // Keeping the steps the same between the two textures so it pops less when you select.
      steps: [
        { offset: 0, color: '#a7a5a5' },
        { offset: 0.1, color: '#a7a5a5' },
        { offset: 0.4, color: 'snow' },
        { offset: 0.6, color: 'snow' },
        { offset: 0.9, color: '#a7a5a5' },
        { offset: 1, color: '#a7a5a5' },
      ],
      angle: Math.PI / 2,
    }) });
    this.outlinePass.setColors({ hover: generateLinearGradientTexture({
      width: dimensions,
      height: dimensions,
      steps: [
        { offset: 0, color: 'hsl(283,29%,40%)' },
        { offset: 0.1, color: 'hsl(283,29%,40%)' },
        { offset: 0.4, color: 'hsl(283,29%,65%)' },
        { offset: 0.6, color: 'hsl(283,29%,65%)' },
        { offset: 0.9, color: 'hsl(283,29%,40%)' },
        { offset: 1, color: 'hsl(283,29%,40%)' },
      ],
      angle: Math.PI / 2,
    }) });
  }
}
