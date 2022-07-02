import type { ProductConfiguratorService } from "../../product-configurator.service";
import type { Subscription } from "rxjs";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { Camera, Scene, Vector2, WebGLRenderer } from "three";
import { AnimatedTextureBlurOutlinePass } from "./postprocessing/animated-texture-blur-outline/AnimatedTextureBlurOutlinePass";
import type { ProductItem } from "../models/product-item/ProductItem";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { SelectedProductHighlighter } from "../SelectedProductHighlighter";
import { generateSingleColorTexture } from "./postprocessing/animated-texture-blur-outline/outline-texture-generators/generate-single-color-texture";
import { generateRainbowRadialTexture } from "./postprocessing/animated-texture-blur-outline/outline-texture-generators/generate-rainbow-radial-texture";
import { intervalAnimation, IntervalAnimationHandle } from "./postprocessing/animated-texture-blur-outline/animations/interval-animation";

export class EffectComposerHandler {
  private composer!: EffectComposer;
  private outlinePass: AnimatedTextureBlurOutlinePass;
  private gammaCorrectionPass: ShaderPass;

  private animationHandle: IntervalAnimationHandle;

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

    this.outlinePass = new AnimatedTextureBlurOutlinePass(productConfiguratorService, selectedProductHighlighter, renderer.getSize(new Vector2(0, 0)), scene, camera, {
      tileCount: 3,
      animateOutline: false,
    });

    this.outlinePass.setColors({ hover: generateRainbowRadialTexture(0) });
    this.outlinePass.setColors({ selected: generateSingleColorTexture("snow") });

    this.animationHandle = intervalAnimation({
      duration: 20 * 1000,
      onUpdate: (delta, current) => {
        this.outlinePass.setColors({ hover: generateRainbowRadialTexture(current) });
      },
    });
    this.animationHandle.start();

    this.composer.addPass(renderPass);
    this.composer.addPass(this.gammaCorrectionPass);
    this.composer.addPass(this.outlinePass);
  }

  dispose(): void {
    this.subscription.unsubscribe();
    this.animationHandle.stop();
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
}
