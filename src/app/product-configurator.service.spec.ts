import { TestBed } from "@angular/core/testing";

import { ProductConfiguratorService } from "./product-configurator.service";

describe("ProductConfiguratorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ProductConfiguratorService = TestBed.get(ProductConfiguratorService);
    expect(service).toBeTruthy();
  });
});
