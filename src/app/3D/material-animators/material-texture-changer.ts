import type { Material, Texture } from 'three';
import { CanvasTexture, TextureLoader } from 'three';
import type { ProductConfiguratorService } from '../../shared/product-configurator.service';
import type { MaterialTextureSwapEventData } from '../models/event-data/material-texture-swap-event-data';
import { getOnProgressCallback } from '../get-on-progress-callback';
import { MaterialAnimationType } from './material-animation-type';
import { addActiveEventItem, createAnimation } from './create-animation';
import { ActiveProductItemEventType } from '../models/product-item/active-product-item-event-type';
import { clearEvents } from '../utility/product-item-event-utility';
import { isPolygonalObject3D } from '../3rd-party/three/types/is-three-js-custom-type';
import type { MapMaterial } from '../3rd-party/three/types/map-material';

const showDebugCanvas: boolean = false;

interface DebugCanvas {
  debugCanvasElement: HTMLCanvasElement | undefined;
  debugCanvasContext: CanvasRenderingContext2D | undefined;
}

interface AnimatedMaterial<T = Material> {
  material: T;
  originalTexture: Texture;
}

/**
 * Changes a texture from one to another over time.
 */
export class MaterialTextureChanger {
  constructor(
    private productConfiguratorService: ProductConfiguratorService,
  ) {
    productConfiguratorService.materialTextureSwap.subscribe(event => {
      this.swapTexture(event);
    });
  }

  /**
   * Swap a texture from a -> b over time.
   * @param event
   */
  private swapTexture(event: MaterialTextureSwapEventData): void {
    if (!event.productItem.object3D) {
      event.onLoaded?.();
      return;
    }
    // This is probably not necessary, it seems to handle it just fine with multiple events at once.
    clearEvents(event.productItem, [ActiveProductItemEventType.TextureChange], true);

    switch (event.animationType) {
      case MaterialAnimationType.None:
        this.changeTexture(event, 0);
        break;
      case MaterialAnimationType.Linear:
        this.changeTexture(event, 250);
        break;
      case MaterialAnimationType.FromTopToBottom:
        this.changeTexture(event, 500);
        break;
    }
  }

  private loadTexture(event: MaterialTextureSwapEventData, onLoaded: (texture: Texture) => void): void {
    if (event.addGlobalLoadingEvent) {
      this.productConfiguratorService.loadingStarted.next();
    }

    const onProgressCallback = event.addGlobalLoadingEvent ? getOnProgressCallback(this.productConfiguratorService) : undefined;

    // Load the new texture
    new TextureLoader().load(event.textureUrl, (texture: Texture) => {
      if (event.addGlobalLoadingEvent) {
        this.productConfiguratorService.loadingFinished.next();
      }
      // For example to stop a loading spinner!
      event.onLoaded?.();

      onLoaded(texture);
    }, onProgressCallback);
  }

  private changeTexture(event: MaterialTextureSwapEventData, duration: number): void {
    const activeAnimationEvent = addActiveEventItem(event.productItem, ActiveProductItemEventType.TextureChange);

    this.loadTexture(event, (texture) => {
      const indexOf = event.productItem.activeEvents.indexOf(activeAnimationEvent);
      // If the item can't be found it was removed.
      if (indexOf === -1) {
        return;
      }
      // We remove the activeAnimation event because we're going to create a second one!
      // TODO: Try and merge the two active events? This system got a bit complex, should look into a better one most likely.
      event.productItem.activeEvents.splice(indexOf, 1);

      const animatedMaterials = this.getMaterials<MapMaterial>(event, texture);
      // If duration is 0 just instantly set the new texture.
      // Or if length is 0, to be lazy and use the same early exit!
      if (duration === 0 || animatedMaterials.length === 0) {
        for (const animatedMaterial of animatedMaterials) {
          animatedMaterial.material[event.textureSlot] = texture;
        }
        return;
      }

      let canvas: HTMLCanvasElement | undefined = document.createElement('canvas');
      let context: CanvasRenderingContext2D | null = canvas.getContext('2d');

      const onFinish = (isCancelled: boolean, complete: boolean): void => {
        canvas!.width = 1;
        canvas!.height = 1;
        context?.clearRect(0, 0, 1, 1);

        canvas = undefined;
        context = null;
        tmpTexture?.dispose();

        if (isCancelled && !complete) {
          for (const animatedMaterial of animatedMaterials) {
            animatedMaterial.material[event.textureSlot] = animatedMaterial.originalTexture;
          }
          return;
        }

        if (debugCanvasContext) {
          debugCanvasContext.drawImage(targetImage, 0, 0);
        }

        for (const animatedMaterial of animatedMaterials) {
          animatedMaterial.material[event.textureSlot] = texture;
        }
      };

      if (!context) {
        onFinish(false, true);
      }

      const tmpTexture = new CanvasTexture(canvas);
      const firstTexture = animatedMaterials[0].originalTexture;
      tmpTexture.flipY = firstTexture.flipY;
      const originalImage = firstTexture.image as HTMLImageElement;
      const targetImage = texture.image as HTMLImageElement;

      const width = originalImage.naturalWidth || originalImage.width;
      const height = originalImage.naturalHeight || originalImage.height;

      canvas.width = width;
      canvas.height = height;

      const { debugCanvasContext } = this.trySetupDebugCanvas(canvas);
      const renderMethod = this.getRenderMethod(event.animationType);

      const onProgress = (progress: number): void => {
        renderMethod(context!, progress, width, height, originalImage, targetImage);

        if (debugCanvasContext) {
          debugCanvasContext.drawImage(canvas!, 0, 0);
        }

        tmpTexture.needsUpdate = true;
      };

      // Draw the original image once so it doesn't flicker when changing.
      context!.drawImage(originalImage, 0, 0);
      for (const animatedMaterial of animatedMaterials) {
        animatedMaterial.material[event.textureSlot] = tmpTexture;
      }

      const animate = createAnimation(event.productItem, ActiveProductItemEventType.TextureChange, duration, onProgress, onFinish);
      requestAnimationFrame(animate);
    });
  }

  private getMaterials<T = Material>(event: MaterialTextureSwapEventData, newTexture: Texture): AnimatedMaterial<T>[] {
    const materials: AnimatedMaterial<T>[] = [];

    if (event.materials) {
      for (const material of event.materials) {
        if (event.textureSlot in material) {
          const texture = material[event.textureSlot] as Texture;
          materials.push({
            material: material as T,
            originalTexture: texture,
          });
          newTexture.flipY = texture.flipY;
        }
      }
    } else {
      event.productItem.object3D!.traverse(o => {
        if (!isPolygonalObject3D(o)) {
          return;
        }

        const objectMaterials = Array.isArray(o.material) ? o.material : [o.material];
        for (const material of objectMaterials) {
          if (event.textureSlot in material) {
            const texture = material[event.textureSlot] as Texture;
            materials.push({
              material: material as T,
              originalTexture: texture,
            });
            newTexture.flipY = texture.flipY;
          }
        }
      });
    }

    return materials;
  }

  private getRenderMethod(animationType: MaterialAnimationType): (context: CanvasRenderingContext2D, progress: number, width: number, height: number, a: HTMLImageElement, b: HTMLImageElement) => void {
    switch (animationType) {
      case MaterialAnimationType.Linear:
        return this.renderLinearly;
      case MaterialAnimationType.FromTopToBottom:
        return this.renderFromTopToBottom;
      default:
        return (): void => {};
    }
  }

  private renderLinearly(context: CanvasRenderingContext2D, progress: number, width: number, height: number, a: HTMLImageElement, b: HTMLImageElement): void {
    context.clearRect(0, 0, width, height);
    context.globalAlpha = 1 - progress;
    context.drawImage(a, 0, 0);

    context.globalAlpha = progress;
    context.drawImage(b, 0, 0);
  }

  private renderFromTopToBottom(context: CanvasRenderingContext2D, progress: number, width: number, height: number, a: HTMLImageElement, b: HTMLImageElement): void {
    context.clearRect(0, 0, width, height);
    context.drawImage(a, 0, 0);

    context.save();
    context.beginPath();
    context.rect(0, 0, progress * width, progress * height);
    context.clip();

    context.drawImage(b, 0, 0, width, height);
    context.restore();
  }

  private trySetupDebugCanvas(canvas: HTMLCanvasElement): DebugCanvas {
    let debugCanvasElement: HTMLCanvasElement | undefined;
    let debugCanvasContext: CanvasRenderingContext2D | undefined;

    if (showDebugCanvas) {
      debugCanvasElement = document.getElementById('debugCanvas') as HTMLCanvasElement;
      if (!debugCanvasElement) {
        debugCanvasElement = document.createElement('canvas');
        debugCanvasElement.id = 'debugCanvas';
        document.body.appendChild(debugCanvasElement);
        debugCanvasElement.classList.add('debug-canvas');
      }

      debugCanvasElement.width = canvas.width;
      debugCanvasElement.height = canvas.height;
      debugCanvasContext = debugCanvasElement.getContext('2d') as CanvasRenderingContext2D;
      debugCanvasContext.drawImage(canvas, 0, 0);
    }

    return { debugCanvasElement, debugCanvasContext };
  }


}
