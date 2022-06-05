import create from '../src';

describe('iter', () => {
  describe('storeIter', () => {
    it('should iterate over Object', () => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = oc.storeIter();

      if (iter) {
        const pairs: any[] = [];
        for (const item of iter) {
          pairs.push(item);
        }
        expect(new Set(pairs)).toEqual(
          new Set([
            ['x', 1],
            ['y', 2],
            ['z', 3],
          ])
        );
      }
    });

    it('should iterate over Map items', () => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = oc.storeIter();
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(
          new Set([
            ['x', 1],
            ['y', 2],
            ['z', 3],
          ])
        );
      }
    });

    it('should iterate over Array items', () => {
      const ac = create(['a', 'b', 'c']);

      const iter = ac.storeIter();
      const items: any[] = [];

      if (iter) {
        for (const item of iter) {
          items.push(item);
        }

        expect(new Set(items)).toEqual(
          new Set([
            [0, 'a'],
            [1, 'b'],
            [2, 'c'],
          ])
        );
      }
    });

    it('should iterate over String items', () => {
      const oc = create('xyz');

      const iter = oc.storeIter();
      const items: any[] = [];

      for (const item of iter) {
        items.push(item);
      }

      expect(new Set(items)).toEqual(
        new Set([
          [0, 'x'],
          [1, 'y'],
          [2, 'z'],
        ])
      );
    });
  });
  describe('itemIter', () => {
    it('should iterate over Object items', () => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = oc.itemIter();
      const items: any[] = [];

      for (const item of iter) {
        items.push(item);
      }

      expect(new Set(items)).toEqual(new Set([1, 2, 3]));
    });

    it('should iterate over Map items', () => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = oc.itemIter();
      const items: any[] = [];

      for (const item of iter) {
        items.push(item);
      }

      expect(new Set(items)).toEqual(new Set([1, 2, 3]));
    });

    it('should iterate over Array items', () => {
      const oc = create([1, 2, 3]);

      const iter = oc.itemIter();
      const items: any[] = [];

      for (const item of iter) {
        items.push(item);
      }

      expect(new Set(items)).toEqual(new Set([1, 2, 3]));
    });

    it('should iterate over String items', () => {
      const oc = create('xyz');

      const iter = oc.itemIter();
      const items: any[] = [];

      for (const item of iter) {
        items.push(item);
      }

      expect(new Set(items)).toEqual(new Set(['x', 'y', 'z']));
    });
  });
  describe('keyIter', () => {
    it('should iterate over Object keys', () => {
      const oc = create({
        x: 1,
        y: 2,
        z: 3,
      });

      const iter = oc.keyIter();
      const keys: any[] = [];

      for (const item of iter) {
        keys.push(item);
      }

      expect(new Set(keys)).toEqual(new Set(['x', 'y', 'z']));
    });

    it('should iterate over Map keys', () => {
      const oc = create(new Map());
      oc.set('x', 1)
        .set('y', 2)
        .set('z', 3);

      const iter = oc.keyIter();
      const keys: any[] = [];

      for (const item of iter) {
        keys.push(item);
      }

      expect(new Set(keys)).toEqual(new Set(['x', 'y', 'z']));
    });

    it('should iterate over Array keys', () => {
      const oc = create([1, 2, 3]);

      const iter = oc.keyIter();
      const keys: any[] = [];

      for (const item of iter) {
        keys.push(item);
      }

      expect(new Set(keys)).toEqual(new Set([0, 1, 2]));
    });

    it('should iterate over String keys', () => {
      const oc = create('xyz');

      const iter = oc.keyIter();
      const keys: any[] = [];

      for (const item of iter) {
        keys.push(item);
      }

      expect(new Set(keys)).toEqual(new Set([0, 1, 2]));
    });
  });

  xit('loops - example from docs', () => {
    const collect = create;

    const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    numbers.map(item => item * 10);

    console.log('numbers is now ', numbers.store);
    // [10, 20, 30, 40, 50 ,60, 70, 80, 90, 100]

    const sumOfAll = numbers.reduce((memo, item) => memo + item, 0);
    console.log('sum of all', sumOfAll); // 550

    const sumOfFive = numbers.reduce((memo, item, key, _store, stopper) => {
      if (key === 4) stopper.stopAfterThis();
      return memo + item;
    }, 0);

    console.log('sum of first five', sumOfFive); // 150

    const sumOfFour = numbers.reduce((memo, item, key, _store, stopper) => {
      if (key === 4) stopper.stop();
      return memo + item;
    }, 0);

    console.log('sum of four', sumOfFour); // 100
  });
});
