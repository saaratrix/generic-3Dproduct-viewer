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
  const mockProductConfiguratorService: ProductConfiguratorService = <any> {
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
      const input = getDefaultTestTree();
      const expectedObjectsNames = ['A_A', 'A_C', 'B_A', 'B_B'];

      const objects = service.getObjects({}, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
      for (const expectedObject of expectedObjectsNames) {
        expect(objects.some(o => o.name === expectedObject)).toBeTrue();
      }
    });

    it('should return all polygonal objects because no objects in included, excluded', () => {
      const input = getDefaultTestTree();
      const expectedObjectsNames = ['A_A', 'A_C', 'B_A', 'B_B'];

      const objects = service.getObjects({ included: [], excluded: [] }, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
      for (const expectedObject of expectedObjectsNames) {
        expect(objects.some(o => o.name === expectedObject)).toBeTrue();
      }
    });

    it('should return only included objects', () => {
      const input = getDefaultTestTree();
      const expectedObjectsNames = ['A_A', 'B_B'];

      const objects = service.getObjects({ included: ['a_a', 'B_B', 'not_a_node'] }, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
      for (const expectedObject of expectedObjectsNames) {
        expect(objects.some(o => o.name === expectedObject)).toBeTrue();
      }
    });

    it('should not return excluded objects', () => {
      const input = getDefaultTestTree();
      const expectedObjectsNames = ['A_C', 'B_A'];

      const objects = service.getObjects({ excluded: ['a_a', 'B_B', 'not_a_node'] }, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
      for (const expectedObject of expectedObjectsNames) {
        expect(objects.some(o => o.name === expectedObject)).toBeTrue();
      }
    });

    it('no includes will have no objects returned', () => {
      const input = getDefaultTestTree();
      const expectedObjectsNames = [];

      const objects = service.getObjects({ excluded: ['a_a', 'B_B', 'not_a_node'], included: [''] }, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
    });

    function getDefaultTestTree(): Object3D {
      const bTreeChildren: NodeTree[] = [
        { name: 'B_A', isPolygonalObject: true },
        { name: 'B_B', isPolygonalObject: true },
        { name: 'B_C', isPolygonalObject: false },
      ];

      return generateTree({
        name: 'A',
        isPolygonalObject: false,
        children: [
          { name: 'A_A', isPolygonalObject: true },
          { name: 'A_B', isPolygonalObject: false, children: bTreeChildren },
          { name: 'A_C', isPolygonalObject: true },
        ],
      });
    }

    function generateTree(node: NodeTree): Object3D {
      const object = node.isPolygonalObject ? new Mesh() : new Object3D();
      object.name = node.name;

      for (const child of node.children ?? []) {
        const childObject = generateTree(child);
        object.add(childObject);
      }

      return object;
    }
  });
});
