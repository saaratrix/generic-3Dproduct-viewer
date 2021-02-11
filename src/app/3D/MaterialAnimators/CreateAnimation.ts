import { ProductItem } from "../models/ProductItem/ProductItem";
import { OnProgressCallback } from "./OnProgressCallback";
import { CancelActiveEventCallback } from "../models/ProductItem/CancelActiveEventCallback";
import { ActiveProductItemEventType } from "../models/ProductItem/ActiveProductItemEventType";

export function createAnimation(productItem: ProductItem, duration: number, onProgress: OnProgressCallback, easingMethod?: (progress: number) => number): () => void {
  let isCancelled: boolean = false;
  let lastFrame: number = Date.now();
  let elapsed: number = 0;

  const animate = (): void => {
    if (isCancelled) {
      return;
    }

    const now = Date.now();
    elapsed += now - lastFrame;
    lastFrame = now;

    // Get the time elapsed from 0 -> 1.
    let progress = Math.min(elapsed / duration, 1);
    // https://gist.github.com/gre/1650294
    // Visual representation: https://easings.net/
    if (easingMethod) {
      progress = easingMethod(progress);
    }
    onProgress(progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      onAnimationFinished();
    }
  };

  const cancelEvent: CancelActiveEventCallback = (complete: boolean): void => {
    isCancelled = true;
    if (complete) {
      onProgress(1);
    }

    onAnimationFinished();
  };

  const onAnimationFinished = () => {
    const index = productItem.activeEvents.indexOf(activeEvent);
    if (index !== -1) {
      productItem.activeEvents.splice(index, 1);
    }
  };

  // Create the event so we have a reference to it when we need to remove it.
  const activeEvent = {
    cancelEvent,
    type: ActiveProductItemEventType.ColorChange,
  };
  productItem.activeEvents.push(activeEvent);
  return animate;
}
