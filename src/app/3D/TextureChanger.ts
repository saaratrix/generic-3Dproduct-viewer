/**
 * Changes a texture from One to another over time.
 */
import { CanvasTexture, Material, Mesh, Object3D, Texture, TextureLoader } from "three";
import { ProductConfigurationEvent, ProductConfiguratorService } from "../product-configurator.service";
import { MaterialTextureSwapEventData } from "./models/EventData/MaterialTextureSwapEventData";
import { getOnProgressCallback } from "./getOnProgressCallback";

const __showDebugCanvas: boolean = false;

export class TextureChanger {
  private productConfiguratorService: ProductConfiguratorService;

  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  public isChanging: boolean = false;

  constructor(productConfiguratorService: ProductConfiguratorService) {
    this.productConfiguratorService = productConfiguratorService;

    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");

    productConfiguratorService.getSubject( ProductConfigurationEvent.Material_TextureSwap )
      .subscribe((event: MaterialTextureSwapEventData) => {
        this.swapTexture(event);
      });
  }

  /**
   * Swap a texture from a -> b over time.
   * @param event
   */
  public swapTexture(event: MaterialTextureSwapEventData) {

    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Loading_Started);

    // Load the new texture
    new TextureLoader().load(event.textureUrl, (texture: Texture) => {
      this.productConfiguratorService.dispatch(ProductConfigurationEvent.Loading_Finished);
      this.animateTextureSwap(event.productItem.object3D, event.textureSlot, texture, 500);
    }, getOnProgressCallback(this.productConfiguratorService));
  }

  /**
   * Animate the change from texture a to texture b.
   * @param rootObject
   * @param slot
   * @param newTexture
   * @param duration
   */
  public animateTextureSwap(rootObject: Object3D, slot: string, newTexture: Texture, duration: number) {
    // TODO: Improve swapping handle logic, for example if a new swap event fires then finish the existing one.
    if (this.isChanging) {
      return;
    }

    const start: number = Date.now();

    const tmpTexture = new CanvasTexture(this.canvas);
    const materials: Material[] = [];
    let originalImage: HTMLImageElement;

    rootObject.traverse((object: Object3D) => {
      const mesh = object as Mesh;
      const material: Material = mesh.material as Material;
      if (material && material[slot]) {
        if (!originalImage) {
          originalImage = material[slot].image;
          // Need to have same flipY as the original texture or bad things will happen!
          const flipY = material[slot].flipY;
          tmpTexture.flipY = flipY;
          newTexture.flipY = flipY;

          material[slot] = tmpTexture;
          if (materials.indexOf(material) === -1) {
            materials.push(material);
          }
        }
      }
    });

    if (!originalImage) {
      console.log("animateTextureSwap(): Did not find originalTexture");
      return;
    }

    this.isChanging = true;

    const bImage: HTMLImageElement = newTexture.image;

    const width = originalImage.naturalWidth;
    const height = originalImage.naturalHeight;

    this.canvas.width = width;
    this.canvas.height = height;

    this.context.clearRect(0, 0, width, height);
    this.context.drawImage(originalImage, 0, 0);

    let debugCanvasElement: HTMLCanvasElement = null;
    let debugCanvasContext: CanvasRenderingContext2D = null;
    if (__showDebugCanvas) {
      debugCanvasElement = document.getElementById("debugCanvas") as HTMLCanvasElement;
      if (!debugCanvasElement) {
        debugCanvasElement = document.createElement("canvas");
        debugCanvasElement.id = "debugCanvas";
        document.body.appendChild(debugCanvasElement);
        debugCanvasElement.classList.add("debug-canvas");
      }

      debugCanvasElement.width = this.canvas.width;
      debugCanvasElement.height = this.canvas.height;
      debugCanvasContext = debugCanvasElement.getContext("2d");
      debugCanvasContext.drawImage(this.canvas, 0, 0);
    }


    const frameCallback = () => {
      // Get progress from 0 -> 1 and make sure progress isn't larger than 1.
      const progress = Math.min((Date.now() - start)  / duration, 1 );

      if (progress < 1) {
        // Do the texture update
        this.context.clearRect(0, 0, width, height);
        this.context.drawImage(originalImage, 0, 0);
        //
        this.context.save();
        this.context.beginPath();
        this.context.rect(0, 0, progress * width, progress * height);
        this.context.clip();

        this.context.drawImage(bImage, 0, 0, width, height);
        this.context.restore();

        if (__showDebugCanvas) {
          debugCanvasContext.drawImage(this.canvas, 0, 0);
        }

        tmpTexture.needsUpdate = true;

        requestAnimationFrame(frameCallback);
      } else {
        // Set the final texture as the canvas
        for (const material of materials) {
          material[slot] = newTexture;
        }

        if (__showDebugCanvas) {
          debugCanvasContext.drawImage(bImage, 0, 0);
        }

        this.canvas.width = 1;
        this.canvas.height = 1;
        this.context.clearRect(0, 0, 1, 1);
        tmpTexture.dispose();
        this.isChanging = false;
      }
    };

    requestAnimationFrame(frameCallback);
  }

}
