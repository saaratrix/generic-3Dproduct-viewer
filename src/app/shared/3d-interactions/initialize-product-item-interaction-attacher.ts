import { APP_INITIALIZER, Provider } from '@angular/core';
import { ProductItemInteractionAttacherService } from './product-item-interaction-attacher.service';

/**
 * This adds the service to the dependency injection so the constructor is run.
 */
function initializeProductItemInteractionAttacher(service: ProductItemInteractionAttacherService): () => void {
  return (): void => { };
}

export const productItemInteractionAttacherAppInitializer: Provider = {
  provide: APP_INITIALIZER,
  useFactory: () => initializeProductItemInteractionAttacher,
  deps: [ProductItemInteractionAttacherService],
  multi: true,
};
