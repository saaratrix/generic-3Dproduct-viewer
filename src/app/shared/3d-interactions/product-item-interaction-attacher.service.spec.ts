import { TestBed } from '@angular/core/testing';
import { ProductItemInteractionAttacherService } from './product-item-interaction-attacher.service';
import { Mesh, Object3D } from 'three';
import { ProductConfiguratorService } from '../product-configurator.service';
import { Subject } from 'rxjs';
import type { ProductLoadingFinishedEvent } from '../events/product-loading-finished-event';
import type { InteractionAction } from '../../3D/interaction/interaction-action';
import type { PolygonalObject3D } from '../../3D/3rd-party/three/types/polygonal-object-3D';
import type { InteractionUserdata } from '../../3D/interaction/interaction-userdata';

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
    it('should return all polygonal objects because no includes or excludes.', () => {
      const input = getDefaultTestTree();
      const expectedObjectsNames = ['A_A', 'A_C', 'B_A', 'B_B'];

      const objects = service.getObjects({}, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
      for (const expectedObject of expectedObjectsNames) {
        expect(objects.some(o => o.name === expectedObject)).toBeTrue();
      }
    });

    it('should return all polygonal objects because no objects in included, excluded.', () => {
      const input = getDefaultTestTree();
      const expectedObjectsNames = ['A_A', 'A_C', 'B_A', 'B_B'];

      const objects = service.getObjects({ included: [], excluded: [] }, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
      for (const expectedObject of expectedObjectsNames) {
        expect(objects.some(o => o.name === expectedObject)).toBeTrue();
      }
    });

    it('should return only included objects.', () => {
      const input = getDefaultTestTree();
      const expectedObjectsNames = ['A_A', 'B_B'];

      const objects = service.getObjects({ included: ['a_a', 'B_B', 'not_a_node'] }, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
      for (const expectedObject of expectedObjectsNames) {
        expect(objects.some(o => o.name === expectedObject)).toBeTrue();
      }
    });

    it('should not return excluded objects.', () => {
      const input = getDefaultTestTree();
      const expectedObjectsNames = ['A_C', 'B_A'];

      const objects = service.getObjects({ excluded: ['a_a', 'B_B', 'not_a_node'] }, input);
      expect(objects.length).toBe(expectedObjectsNames.length);
      for (const expectedObject of expectedObjectsNames) {
        expect(objects.some(o => o.name === expectedObject)).toBeTrue();
      }
    });

    it('no includes will have no objects returned.', () => {
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

  describe('setupInteraction()', () => {
    it('should work with empty data.', () => {
      service.setupInteraction([], []);
      expect(true).withContext('Did not throw!').toBeTrue();
    });

    it('Should set objects on actions.', () => {
      const actions: InteractionAction[] = [<any> {
        objects: undefined,
      }, <any> {
        objects: undefined,
      }];

      const objects: PolygonalObject3D[] = [
        <any> { name: 'A', userData: {} },
        <any> { name: 'B', userData: {} },
      ];

      service.setupInteraction(objects, actions);

      for (const action of actions) {
        expect(action.objects).not.toBeUndefined();
        expect(action.objects!.size).toBe(objects.length);
        objects.forEach(o => action.objects!.has(o));
      }
    });

    it('Should set objects on actions without duplicates.', () => {
      const actions: InteractionAction[] = [<any> {
        objects: undefined,
      }, <any> {
        objects: new Set(),
      }];

      const objects: PolygonalObject3D[] = [
        <any> { name: 'A', userData: {} },
        <any> { name: 'B', userData: { interactionActions: [actions[0]], isPickable: true } },
      ];

      actions[1].objects!.add(objects[1]);

      service.setupInteraction(objects, actions);

      // Tests first action
      let action = actions[0];
      expect(action.objects).not.toBeUndefined();
      expect(action.objects!.size).toBe(objects.length);
      objects.forEach(o => action.objects!.has(o));

      // Tests second action
      action = actions[1];
      expect(action.objects).not.toBeUndefined();
      expect(action.objects!.size).toBe(objects.length);
      objects.forEach(o => action.objects!.has(o));
    });

    it(`Should set actions on object's userdata.`, () => {
      const actions: InteractionAction[] = [<any> {
        objects: undefined,
      }, <any> {
        objects: undefined,
      }];

      const objects: PolygonalObject3D[] = [
        <any> { name: 'A', userData: {} },
        <any> { name: 'B', userData: {} },
      ];

      service.setupInteraction(objects, actions);

      for (const object of objects) {
        const userData = object.userData as InteractionUserdata;
        expect(userData.interactionActions).not.toBeUndefined();
        expect(userData.interactionActions.length).toBe(actions.length);
        for (const action of actions.values()) {
          action.objects!.has(object);
        }
      }
    });

    it(`Should set actions on object's userdata without duplicates`, () => {
      const actions: InteractionAction[] = [<any> {
        objects: undefined,
      }, <any> {
        objects: undefined,
      }];

      const userDataForA: InteractionUserdata = {
        interactionActions: [actions[0]],
        isPickable: true,
      };
      const objects: PolygonalObject3D[] = [
        <any> { name: 'A', userData: userDataForA,
        },
        <any> { name: 'B', userData: {} },
      ];
      actions[0].objects = new Set([objects[0]]);

      service.setupInteraction(objects, actions);

      for (const object of objects) {
        const userData = object.userData as InteractionUserdata;
        expect(userData.interactionActions).not.toBeUndefined();
        expect(userData.interactionActions.length).toBe(actions.length);
        for (const action of actions.values()) {
          action.objects!.has(object);
        }
      }
    });

    it(`Should combine actions on object's userdata.`, () => {
      const extraAction: InteractionAction = <any> { objects: new Set() };
      const actions: InteractionAction[] = [<any> {
        objects: undefined,
      }, <any> {
        objects: undefined,
      }];

      const userDataForA: InteractionUserdata = {
        interactionActions: [extraAction],
        isPickable: true,
      };
      const objects: PolygonalObject3D[] = [
        <any> { name: 'A', userData: userDataForA,
        },
        <any> { name: 'B', userData: {} },
      ];
      extraAction.objects!.add(objects[0]);

      service.setupInteraction(objects, actions);

      let object = objects[0];
      let userData = object.userData as InteractionUserdata;
      expect(userData.interactionActions).not.toBeUndefined();
      expect(userData.interactionActions.length).toBe(actions.length + 1);
      userData.interactionActions.includes(extraAction);
      for (const action of actions.values()) {
        action.objects!.has(object);
      }

      object = objects[1];
      userData = object.userData as InteractionUserdata;
      expect(userData.interactionActions).not.toBeUndefined();
      expect(userData.interactionActions.length).toBe(actions.length);
      for (const action of actions.values()) {
        action.objects!.has(object);
      }
    });
  });
});
