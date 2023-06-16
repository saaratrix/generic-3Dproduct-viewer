import type { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import type { ProductItem } from '../3D/models/product-item/product-item';
import { ProductConfigurationEvent } from './events/product-configurator-events';
import type { LoadingProgressEventData } from '../3D/models/event-data/loading-progress-event-data';
import type { MaterialTextureSwapEventData } from '../3D/models/event-data/material-texture-swap-event-data';
import type { Vector2 } from 'three';
import type { MaterialColorSwapEventData } from '../3D/models/event-data/material-color-swap-event-data';
import type { PolygonalObject3D } from '../3D/3rd-party/three/types/polygonal-object-3D';
import type { ProductLoadingFinishedEvent } from './events/product-loading-finished-event';

@Injectable({
  providedIn: 'root',
})
export class ProductConfiguratorService implements OnDestroy {
  /**
   * The product items that you can choose between.
   */
  items: ProductItem[] = [];
  /**
   * The HTML element associated with an item id.
   */
  itemElements: Record<string, HTMLElement> = {};
  /**
   * The currently selected product.
   */
  selectedProduct: ProductItem | null = null;

  private subjects = new Map<ProductConfigurationEvent, Subject<unknown>>();

  readonly canvasResized: Subject<Vector2>;

  readonly loadingStarted: Subject<void>;
  readonly loadingProgress: Subject<LoadingProgressEventData>;
  readonly loadingFinished: Subject<void>;

  readonly materialColorSwap: Subject<MaterialColorSwapEventData>;
  readonly materialTextureSwap: Subject<MaterialTextureSwapEventData>;

  readonly object3DSelected: Subject<PolygonalObject3D>;
  readonly object3DDeselected: Subject<PolygonalObject3D>;
  readonly object3DPointerEnter: Subject<PolygonalObject3D>;
  readonly object3DPointerLeave: Subject<PolygonalObject3D>;

  readonly productLoadingFinished: Subject<ProductLoadingFinishedEvent>;

  readonly selectedProductChanged: Subject<ProductItem>;

  readonly toolbarChangeProduct: Subject<ProductItem>;

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

    this.productLoadingFinished = this.createSubject<ProductLoadingFinishedEvent>(ProductConfigurationEvent.ProductLoadingFinished);

    this.selectedProductChanged = this.createSubject<ProductItem>(ProductConfigurationEvent.SelectedProductChanged);

    this.toolbarChangeProduct = this.createSubject<ProductItem>(ProductConfigurationEvent.ToolbarChangeProduct);
  }

  public ngOnDestroy(): void {
    for (const subject of this.subjects.values()) {
      subject.complete();
      subject.unsubscribe();
    }
    this.subjects.clear();
  }

  public setProductItemHTMLElement(item: ProductItem, element: HTMLElement): void {
    this.itemElements[item.id] = element;
  }

  public dispatch<T = unknown>(eventType: ProductConfigurationEvent, data?: T): void {
    if (!this.subjects.has(eventType)) {
      return;
    }

    this.subjects.get(eventType)!.next(data);
  }

  public getSelectedProductHTMLElement(product: ProductItem): HTMLElement | undefined {
    if (!product) {
      return undefined;
    }

    return this.itemElements[product.id];
  }

  private createSubject<T>(eventType: ProductConfigurationEvent): Subject<T> {
    const subject = new Subject<T>();
    this.subjects.set(eventType, subject as Subject<unknown>);
    return subject;
  }
}
