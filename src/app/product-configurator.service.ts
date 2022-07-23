import type { OnDestroy } from "@angular/core";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import type { ProductItem } from "./3D/models/product-item/product-item";
import { ProductConfigurationEvent } from "./product-configurator-events";
import type { LoadingProgressEventData } from "./3D/models/event-data/loading-progress-event-data";
import type { MaterialTextureSwapEventData } from "./3D/models/event-data/material-texture-swap-event-data";
import type { Vector2 } from "three";
import type { MaterialColorSwapEventData } from "./3D/models/event-data/material-color-swap-event-data";
import type { PolygonalObject3D } from "./3D/3rd-party/three/types/polygonal-object-3D";

@Injectable({
  providedIn: "root",
})
export class ProductConfiguratorService implements OnDestroy {
  /**
   * The product items that you can choose between.
   */
  public items: ProductItem[] = [];
  /**
   * The HTML element associated with an item id.
   */
  public itemElements: Record<string, HTMLElement> = {};
  /**
   * The currently selected product.
   */
  public selectedProduct: ProductItem | null = null;

  private subjects: Record<ProductConfigurationEvent, Subject<unknown>> = {} as Record<ProductConfigurationEvent, Subject<unknown>>;
  // The subjects
  public canvasResized: Subject<Vector2>;

  public loadingStarted: Subject<void>;
  public loadingProgress: Subject<LoadingProgressEventData>;
  public loadingFinished: Subject<void>;

  public materialColorSwap: Subject<MaterialColorSwapEventData>;
  public materialTextureSwap: Subject<MaterialTextureSwapEventData>;

  public object3DSelected: Subject<PolygonalObject3D>;
  public object3DDeselected: Subject<PolygonalObject3D>;
  public object3DPointerEnter: Subject<PolygonalObject3D>;
  public object3DPointerLeave: Subject<PolygonalObject3D>;

  public selectedProductChanged: Subject<ProductItem>;

  public toolbarChangeProduct: Subject<ProductItem>;

  constructor() {
    this.canvasResized = this.createSubject<Vector2>(ProductConfigurationEvent.CanvasResized);

    this.loadingStarted = this.createSubject<void>(ProductConfigurationEvent.LoadingStarted);
    this.loadingProgress = this.createSubject<LoadingProgressEventData>(ProductConfigurationEvent.LoadingProgress);
    this.loadingFinished = this.createSubject<void>(ProductConfigurationEvent.LoadingFinished);

    this.materialColorSwap = this.createSubject<MaterialColorSwapEventData>(ProductConfigurationEvent.MaterialColorSwap);
    this.materialTextureSwap = this.createSubject<MaterialTextureSwapEventData>(ProductConfigurationEvent.MaterialTextureSwap);

    this.object3DSelected = this.createSubject<PolygonalObject3D>(ProductConfigurationEvent.Object3DSelected);
    this.object3DDeselected = this.createSubject<PolygonalObject3D>(ProductConfigurationEvent.Object3DDeselected);
    this.object3DPointerEnter = this.createSubject<PolygonalObject3D>(ProductConfigurationEvent.Object3DPointerEnter);
    this.object3DPointerLeave = this.createSubject<PolygonalObject3D>(ProductConfigurationEvent.Object3DPointerLeave);

    this.selectedProductChanged = this.createSubject<ProductItem>(ProductConfigurationEvent.SelectedProductChanged);

    this.toolbarChangeProduct = this.createSubject<ProductItem>(ProductConfigurationEvent.ToolbarChangeProduct);
  }

  public ngOnDestroy(): void {
    const keys = Object.keys(this.subjects);
    for (const key of keys) {
      const subject = this.subjects[key] as Subject<unknown>;
      if (!subject) {
        continue;
      }

      subject.complete();
      subject.unsubscribe();
      delete this.subjects[key];
    }
  }

  public dispatch<T = unknown>(eventType: ProductConfigurationEvent, data?: T): void {
    if (!this.subjects[eventType]) {
      return;
    }

    this.subjects[eventType].next(data);
  }

  public getSelectedProductElement(product: ProductItem): HTMLElement | undefined {
    if (!product) {
      return undefined;
    }

    return this.itemElements[product.name];
  }

  private createSubject<T>(eventType: ProductConfigurationEvent): Subject<T> {
    const subject = new Subject<T>();
    this.subjects[eventType] = subject as Subject<unknown>;
    return subject;
  }
}
