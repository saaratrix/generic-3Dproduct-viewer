import { ElementRef, Injectable, } from "@angular/core";
import { Subject } from "rxjs";
import { ProductItem } from "./3D/models/ProductItem";
import { createFlowerPot, createRose, createWuffels } from "../mockdata/UnrealisticItems";
import { createIkeaChear, createIkeaTable, createWayfairChair, createWayfairTable } from "../mockdata/RealisticItems";
import { ProductConfigurationEvent } from "./product-configurator-events";

@Injectable({
  providedIn: "root"
})
export class ProductConfiguratorService {
  /**
   * The product items that you can choose between.
   */
  public items: ProductItem[] = [];
  public selectedProduct: ProductItem | null = null;
  /**
   * Sometimes we need the product container element.
   * For example to center the sub item products over the product item.
   */
  public selectedProductElementRef: ElementRef<HTMLElement> | null = null;

  /**
   * The RxJs Subject objects.
   */
  private readonly subjects: { [s: number]: Subject<any> };

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

    this.subjects = {};

    // Create all the event subjects.
    // This gets all the numbers and filters away the string keys, since ProductConfigurationEvent.Event == 0
    // But ProductConfigurationEvent[0] = "Event"
    const eventKeys = Object.keys(ProductConfigurationEvent).filter(key => typeof ProductConfigurationEvent[key as any] !== "number");

    for (const key of eventKeys) {
      this.subjects[ key ] = new Subject<any>();
    }
  }

  /**
   * Get a subject corresponding to the type.
   * @param type
   */
  public getSubject(type: ProductConfigurationEvent): Subject<any> {
    return this.subjects[type];
  }

  public dispatch(type: ProductConfigurationEvent, data?: any ) {
    if (!this.subjects[type]) {
      return;
    }

    this.subjects[type].next(data);
  }
}
