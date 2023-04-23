import type { ProductConfiguratorService } from '../app/shared/product-configurator.service';
import { createFlowerPot, createRose, createWuffels } from './unrealistic-items';
import { createIkeaChear, createIkeaTable, createWayfairChair, createWayfairTable } from './realistic-items';

export function loadMockData(productConfiguratorService: ProductConfiguratorService): void {
  // Who needs a database!
  productConfiguratorService.items.push(createFlowerPot());
  productConfiguratorService.items.push(createRose());
  productConfiguratorService.items.push(createWuffels());
  productConfiguratorService.items.push(createWayfairTable());
  productConfiguratorService.items.push(createWayfairChair());
  productConfiguratorService.items.push(createIkeaChear());
  productConfiguratorService.items.push(createIkeaTable());
}
