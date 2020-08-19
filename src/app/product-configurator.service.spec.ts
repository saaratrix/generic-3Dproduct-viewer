import { TestBed } from "@angular/core/testing";

import { ProductConfiguratorService } from "./product-configurator.service";

describe("ProductConfiguratorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ProductConfiguratorService = TestBed.inject(ProductConfiguratorService);
    expect(service).toBeTruthy();
  });
});
