import type { ProductConfiguratorService } from "../../product-configurator.service";
import type { Subscription } from "rxjs";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { Camera, Color, Scene, Vector2, WebGLRenderer } from "three";
import { ColorBlurOutlinePass } from "./postprocessing/ColorBlurOutlinePass";
import type { ProductItem } from "../models/product-item/ProductItem";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import { SelectedProductHighlighter } from "../SelectedProductHighlighter";

export class EffectComposerHandler {
  private composer!: EffectComposer;
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

    const hoverColor = new Color(181 / 255, 145 / 255, 199 / 255);
    const selectedColor = new Color(255 / 255, 250 / 255, 250 / 255);
    const outlinePass = new ColorBlurOutlinePass(productConfiguratorService, selectedProductHighlighter, renderer.getSize(new Vector2(0, 0)), scene, camera, hoverColor, selectedColor);

    this.composer.addPass(renderPass);
    this.composer.addPass(this.gammaCorrectionPass);
    this.composer.addPass(outlinePass);
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
}
