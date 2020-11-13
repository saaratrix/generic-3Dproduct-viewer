/**
 * Changes a texture from One to another over time.
 */
import { CanvasTexture, Material, Mesh, Object3D, Texture, TextureLoader } from "three";
import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";
import { MaterialTextureSwapEventData } from "./models/EventData/MaterialTextureSwapEventData";
import { getOnProgressCallback } from "./getOnProgressCallback";

const __showDebugCanvas: boolean = false;

interface MaterialMap {
  [key: string]: any;
}

export class TextureChanger {
  private productConfiguratorService: ProductConfiguratorService;

  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  public isChanging: boolean = false;

  constructor(productConfiguratorService: ProductConfiguratorService) {
    this.productConfiguratorService = productConfiguratorService;

    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    productConfiguratorService.getSubject( ProductConfigurationEvent.Material_TextureSwap )
      .subscribe((event: MaterialTextureSwapEventData) => {
        this.swapTexture(event);
      });
  }

  /**
   * Swap a texture from a -> b over time.
   * @param event
   */
  private swapTexture(event: MaterialTextureSwapEventData) {
    if (!event.productItem.object3D) {
      return;
    }


    this.productConfiguratorService.dispatch(ProductConfigurationEvent.Loading_Started);

    // Load the new texture
    new TextureLoader().load(event.textureUrl, (texture: Texture) => {
      this.productConfiguratorService.dispatch(ProductConfigurationEvent.Loading_Finished);
      this.animateTextureSwap(event.productItem.object3D as Object3D, event.textureSlot, texture, 500);
    }, getOnProgressCallback(this.productConfiguratorService));
  }

  /**
   * Animate the change from texture a to texture b.
   * @param rootObject
   * @param slot
   * @param newTexture
   * @param duration
   */
  private animateTextureSwap(rootObject: Object3D, slot: string, newTexture: Texture, duration: number) {
    // TODO: Improve swapping handle logic, for example if a new swap event fires then finish the existing one.
    if (this.isChanging) {
      return;
    }

    const start: number = Date.now();

    const tmpTexture = new CanvasTexture(this.canvas);
    const materials: MaterialMap[] = [];
    let originalImage: HTMLImageElement | undefined;

    rootObject.traverse((object: Object3D) => {
      const mesh = object as Mesh;
      const material = mesh.material as Material;
      const materialMap = material as MaterialMap;
      if (material && materialMap[slot]) {
        if (!originalImage) {
          originalImage = materialMap[slot].image;
          // Need to have same flipY as the original texture or bad things will happen!
          const flipY = materialMap[slot].flipY;
          tmpTexture.flipY = flipY;
          newTexture.flipY = flipY;

          materialMap[slot] = tmpTexture;
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

    let debugCanvasElement: HTMLCanvasElement;
    let debugCanvasContext: CanvasRenderingContext2D;
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
      debugCanvasContext = debugCanvasElement.getContext("2d") as CanvasRenderingContext2D;
      debugCanvasContext.drawImage(this.canvas, 0, 0);
    }

    const frameCallback = () => {
      // Get progress from 0 -> 1 and make sure progress isn't larger than 1.
      const progress = Math.min((Date.now() - start)  / duration, 1 );

      if (progress < 1) {
        // Do the texture update
        this.context.clearRect(0, 0, width, height);
        this.context.drawImage(originalImage as HTMLImageElement, 0, 0);
        //
        this.context.save();
        this.context.beginPath();
        this.context.rect(0, 0, progress * width, progress * height);
        this.context.clip();

        this.context.drawImage(bImage, 0, 0, width, height);
        this.context.restore();

        if (debugCanvasContext) {
          debugCanvasContext.drawImage(this.canvas, 0, 0);
        }

        tmpTexture.needsUpdate = true;

        requestAnimationFrame(frameCallback);
      } else {
        // Set the final texture as the canvas
        for (const material of materials) {
          material[slot] = newTexture;
        }

        if (debugCanvasContext) {
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
