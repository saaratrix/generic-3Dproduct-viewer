import { getRelatedObjects } from './get-related-objects';
import type { PolygonalObject3D } from '../3rd-party/three/types/polygonal-object-3D';

describe('get-related-obects()', () => {
  describe('without type', () => {
    it('Should get no objects if not interactable.', () => {
      const result = getRelatedObjects(<any> {
        userData: {},
      });
      expect(result.length).toBe(0);
    });

    it('Should get no objects if not grouping objects together.', () => {
      const input = <any> {
        userData: {
          interactionActions: [{
            groupObjectsTogether: false,
            objects: new Set<PolygonalObject3D>([<any> {}, <any> {}]),
          }],
        },
      };

      const result = getRelatedObjects(input);
      expect(result.length).toBe(0);
    });

    it('Should only get grouped objects.', () => {
      const expectedName = 'grouped';
      const input = <any> {
        userData: {
          interactionActions: [
            {
              groupObjectsTogether: false,
              objects: new Set<PolygonalObject3D>([<any> { name: 'not-grouped' }, <any> { name: 'not-grouped' }]),
            },
            {
              groupObjectsTogether: true,
              objects: new Set<PolygonalObject3D>([<any> { name: expectedName }, <any> { name: expectedName }, <any> { name: expectedName }]),
            },
          ],
        },
      };

      const result = getRelatedObjects(input);
      expect(result.length).toBe(3);
      result.forEach((r) => {
        expect(r.name).toBe(expectedName);
      });
    });

    it('Should not return input object (itself).', () => {
      const input = <any> {
        userData: {
          interactionActions: [{
            groupObjectsTogether: true,
            objects: new Set<PolygonalObject3D>([<any> {}]),
          }],
        },
      };
      input.userData.interactionActions[0].objects.add(input);
      const result = getRelatedObjects(input);
      expect(result.length).toBe(1);
      expect(result.includes(input)).toBeFalse();
    });
  });

  describe('with specific type', () => {
    it ('should get only of certain type', () => {
      const expectedName = 'grouped';
      const aObjects = new Set<PolygonalObject3D>([<any> { name: expectedName + 'A' }, <any> { name: expectedName + 'A' }, <any> { name: expectedName + 'A' }]);

      const input = <any> {
        userData: {
          interactionActions: [
            {
              groupObjectsTogether: false,
              type: 'A',
              objects: new Set<PolygonalObject3D>([<any> { name: 'not-grouped' }, <any> { name: 'not-grouped' }]),
            },
            {
              groupObjectsTogether: true,
              type: 'A',
              objects: aObjects,
            },
            {
              groupObjectsTogether: true,
              type: 'B',
              objects: new Set<PolygonalObject3D>([<any> { name: expectedName + 'B' }, <any> { name: expectedName + 'B' }, <any> { name: expectedName + 'B' }]),
            },
          ],
        },
      };
      aObjects.add(input);

      const result = getRelatedObjects(input, 'A');
      expect(result.length).toBe(aObjects.size - 1);
      result.forEach((r) => {
        expect(r.name).toBe(expectedName + 'A');
      });
    });
  });
});
