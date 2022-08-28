import { TestBed } from '@angular/core/testing';

import { ProductItemInteractionAttacherService } from './product-item-interaction-attacher.service';
import { Mesh, Object3D } from 'three';
import { ProductConfiguratorService } from '../product-configurator.service';
import { of, Subject } from 'rxjs';
import { ProductLoadingFinishedEvent } from '../events/product-loading-finished-event';

interface NodeTree {
  name: string;
  isPolygonalObject: boolean;
  children?: NodeTree[];
}

describe('ProductItemInteractionAttacherService', () => {
  let service: ProductItemInteractionAttacherService;
  const mockProductConfiguratorService: ProductConfiguratorService = {
    productLoadingFinished: new Subject<ProductLoadingFinishedEvent>(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductConfiguratorService, useValue: mockProductConfiguratorService },
      ],
    });
    service = TestBed.inject(ProductItemInteractionAttacherService);
  });

  describe('getObjects()', () => {
    it('should return all polygonal objects because no includes or excludes', () => {
      const input = generateTree({
        name: 'A',
        isPolygonalObject: false,
        children: [
          { name: 'A_A', isPolygonalObject: true },
          { name: 'A_B', isPolygonalObject: false },
          { name: 'A_C', isPolygonalObject: true },
        ],
      }, undefined);

      const objects = service.getObjects({}, input);
      expect(objects.length).toBe(2);
      expect(objects[0].name).toBe('A_A');
      expect(objects[1].name).toBe('A_C');
    });

    it('should return only included objects', () => {
      fail();
    });

    it('should not return excluded objects', () => {
      fail();
    });

    function generateTree(node: NodeTree, parent: Object3D | undefined): Object3D {
      const object = node.isPolygonalObject ? new Mesh() : new Object3D();
      object.name = node.name;

      if (parent) {
        object.parent = parent;
      }

      for (const child of node.children ?? []) {
        generateTree(child, object);
      }

      return object;
    }
  });
});
