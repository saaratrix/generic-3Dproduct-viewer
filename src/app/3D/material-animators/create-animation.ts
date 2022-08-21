import type { ProductItem } from '../models/product-item/product-item';
import type { OnAnimationProgressCallback } from './on-animation-progress-callback';
import type { CancelActiveEventCallback } from '../models/product-item/cancel-active-event-callback';
import type { ActiveProductItemEventType } from '../models/product-item/active-product-item-event-type';
import type { ActiveProductItemEvent } from '../models/product-item/active-product-item-event';

// TODO: Try and refactor all this into a better system at some point (so never!) or maybe take a promise as input to continue the promise?
export function addActiveEventItem(productItem: ProductItem, eventType: ActiveProductItemEventType): ActiveProductItemEvent {
  const item: ActiveProductItemEvent = {
    cancelEvent: () => {
      const index = productItem.activeEvents.indexOf(item);
      if (index !== -1) {
        productItem.activeEvents.splice(index);
      }
    },
    type: eventType,
  };

  productItem.activeEvents.push(item);
  return item;
}

export function createAnimation(
  productItem: ProductItem,
  eventType: ActiveProductItemEventType,
  duration: number,
  onProgress: OnAnimationProgressCallback,
  onFinish?: (cancelled: boolean, complete: boolean) => void,
  easingMethod?: (progress: number) => number,
): () => void {
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
      onAnimationFinished(true);
    }
  };

  const cancelEvent: CancelActiveEventCallback = (complete: boolean): void => {
    isCancelled = true;
    if (complete) {
      onProgress(1);
    }

    onAnimationFinished(complete);
  };

  const onAnimationFinished = (complete: boolean): void => {
    const index = productItem.activeEvents.indexOf(activeEvent);
    if (index !== -1) {
      productItem.activeEvents.splice(index, 1);
    }

    onFinish?.(isCancelled, complete);
  };

  // Create the event so we have a reference to it when we need to remove it.
  const activeEvent: ActiveProductItemEvent = {
    cancelEvent,
    type: eventType,
  };
  productItem.activeEvents.push(activeEvent);

  return animate;
}
