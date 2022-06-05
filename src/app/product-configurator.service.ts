import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { ProductItem } from "./3D/models/product-item/ProductItem";
import { createFlowerPot, createRose, createWuffels } from "../mockdata/UnrealisticItems";
import { createIkeaChear, createIkeaTable, createWayfairChair, createWayfairTable } from "../mockdata/RealisticItems";
import { ProductConfigurationEvent } from "./product-configurator-events";
import { LoadingProgressEventData } from "./3D/models/event-data/LoadingProgressEventData";
import { MaterialTextureSwapEventData } from "./3D/models/event-data/MaterialTextureSwapEventData";
import { Mesh, Vector2 } from "three";
import { MaterialColorSwapEventData } from "./3D/models/event-data/MaterialColorSwapEventData";

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

  public meshSelected: Subject<Mesh>;
  public meshDeselected: Subject<Mesh>;
  public meshPointerEnter: Subject<Mesh>;
  public meshPointerLeave: Subject<Mesh>;

  public selectedProductChanged: Subject<ProductItem>;

  public toolbarChangeProduct: Subject<ProductItem>;

  constructor() {
    let id = 0;

    // Who needs a database!
    this.items.push(createFlowerPot(id++));
    this.items.push(createRose(id++));
    this.items.push(createWuffels(id++));
    this.items.push(createWayfairTable(id++));
    this.items.push(createWayfairChair(id++));
    this.items.push(createIkeaChear(id++));
    this.items.push(createIkeaTable(id++));

    this.canvasResized = this.createSubject<Vector2>(ProductConfigurationEvent.CanvasResized);

    this.loadingStarted = this.createSubject<void>(ProductConfigurationEvent.LoadingStarted);
    this.loadingProgress = this.createSubject<LoadingProgressEventData>(ProductConfigurationEvent.LoadingProgress);
    this.loadingFinished = this.createSubject<void>(ProductConfigurationEvent.LoadingFinished);

    this.materialColorSwap = this.createSubject<MaterialColorSwapEventData>(ProductConfigurationEvent.MaterialColorSwap);
    this.materialTextureSwap = this.createSubject<MaterialTextureSwapEventData>(ProductConfigurationEvent.MaterialTextureSwap);

    this.meshSelected = this.createSubject<Mesh>(ProductConfigurationEvent.MeshSelected);
    this.meshDeselected = this.createSubject<Mesh>(ProductConfigurationEvent.MeshDeselected);
    this.meshPointerEnter = this.createSubject<Mesh>(ProductConfigurationEvent.MeshPointerEnter);
    this.meshPointerLeave = this.createSubject<Mesh>(ProductConfigurationEvent.MeshPointerLeave);

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
