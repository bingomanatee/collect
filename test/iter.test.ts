import create from '../src';
import { Iter } from '../src/Iter';

describe('iter', () => {
  describe('itemIter', () => {
    it('should iterate over Object items', () => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = Iter.itemIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(new Set([1, 2, 3]));
      }
    });

    it('should iterate over Map items', () => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = Iter.itemIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(new Set([1, 2, 3]));
      }
    });

    it('should iterate over Array items', () => {
      const oc = create([1, 2, 3]);

      const iter = Iter.itemIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(new Set([1, 2, 3]));
      }
    });

    it('should iterate over String items', () => {
      const oc = create('xyz');

      const iter = Iter.itemIter(oc);
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(new Set(['x', 'y', 'z']));
      }
    });
  });
  describe('keyIter', () => {
    it('should iterate over Object keys', () => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = Iter.keyIter(oc);
      const keys: any[] = [];

      if (iter) {
        for (const item of iter) {
          keys.push(item);
        }

        expect(new Set(keys)).toEqual(new Set(['x', 'y', 'z']));
      }
    });

    it('should iterate over Map keys', () => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = Iter.keyIter(oc);
      const keys: any[] = [];

      if (iter) {
        for (const item of iter) {
          keys.push(item);
        }

        expect(new Set(keys)).toEqual(new Set(['x', 'y', 'z']));
      }
    });

    it('should iterate over Array keys', () => {
      const oc = create([1, 2, 3]);

      const iter = Iter.keyIter(oc);
      const keys: any[] = [];

      if (iter) {
        for (const item of iter) {
          keys.push(item);
        }

        expect(new Set(keys)).toEqual(new Set([0, 1, 2]));
      }
    });

    it('should iterate over String keys', () => {
      const oc = create('xyz');

      const iter = Iter.keyIter(oc);
      const keys: any[] = [];

      if (iter) {
        for (const item of iter) {
          keys.push(item);
        }

        expect(new Set(keys)).toEqual(new Set([0, 1, 2]));
      }
    });
  });
});
