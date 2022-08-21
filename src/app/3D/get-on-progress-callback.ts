import type { ProductConfiguratorService } from '../product-configurator.service';

type OnProgressCallback = (progress: ProgressEvent) => void;

// Return a unique id for each progress callback.
let loadingId = 0;

export const getOnProgressCallback = (productConfiguratorService: ProductConfiguratorService): OnProgressCallback => {
  const id = loadingId++;

  return (progress: ProgressEvent): void => {
    productConfiguratorService.loadingProgress.next({
      id,
      loaded: progress.loaded,
      total: progress.total,
    });
  };
};
