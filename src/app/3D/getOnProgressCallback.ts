import { ProductConfiguratorService } from "../product-configurator.service";
import { ProductConfigurationEvent } from "../product-configurator-events";

type OnProgressCallback = (progress: ProgressEvent) => void;

// Return a unique id for each progress callback.
let _loadingId = 0;

export const getOnProgressCallback = (productConfiguratorService: ProductConfiguratorService): OnProgressCallback => {
  const id = _loadingId++;

  return (progress: ProgressEvent) => {
    productConfiguratorService.dispatch(ProductConfigurationEvent.Loading_Progress, {
      id,
      loaded: progress.loaded,
      total: progress.total
    });
  };
};
