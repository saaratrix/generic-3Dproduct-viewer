import { APP_INITIALIZER, Provider } from '@angular/core';
import { ProductItemInteractionAttacherService } from './product-item-interaction-attacher.service';

/**
 * This adds the service to the dependency injection so the constructor is run.
 */
function initializeProductItemInteractionAttacher(): () => void {
  // This is empty because angular DI takes care of the rest.
  return (): void => { };
}

export const productItemInteractionAttacherAppInitializer: Provider = {
  provide: APP_INITIALIZER,
  useFactory: () => initializeProductItemInteractionAttacher,
  deps: [ProductItemInteractionAttacherService],
  multi: true,
};
