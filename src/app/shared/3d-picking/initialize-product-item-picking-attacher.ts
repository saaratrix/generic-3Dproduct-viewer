import { APP_INITIALIZER, Provider } from '@angular/core';
import { ProductItemPickingAttacherService } from './product-item-picking-attacher.service';

/**
 * This adds the service to the dependency injection so the constructor is run.
 */
function initializeProductItemPickingAttacher(): () => void {
  // This is empty because angular DI takes care of the rest.
  return (): void => { };
}

export const productItemPickingAttacherAppInitializer: Provider = {
  provide: APP_INITIALIZER,
  useFactory: () => initializeProductItemPickingAttacher,
  deps: [ProductItemPickingAttacherService],
  multi: true,
};
