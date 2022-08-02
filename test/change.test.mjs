import tap from 'tap';
import { create } from '../dist/collect.es.js';

tap.test('change', (suite) => {
  suite.test('array', (arrayTest) => {
    arrayTest.test('injects a value', (gsd) => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      gsd.same(start.store, START_STORE);

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      start.change([2, 3, 4]);

      gsd.same(start.store, [2, 3, 4]);
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: [2, 3, 4],
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
    });

    arrayTest.test('modifies AND RETURNS a value', (gsd) => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      gsd.same(start.store, START_STORE);

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.shift();
        fromStore.push(4);
        return fromStore;
      });

      gsd.same(start.store, [2, 3, 4]);
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: [2, 3, 4],
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });

    arrayTest.test('modifies BUT DOES NOT RETURN a value', (gsd) => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      gsd.same(start.store, START_STORE);

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.shift();
        fromStore.push(4);
      });

      gsd.same(start.store, [2, 3, 4]);
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: [2, 3, 4],
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });

    arrayTest.test('throws on a wrong returned type', (gsd) => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      gsd.same(start.store, START_STORE);

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      gsd.throws(() =>
        start.change(fromStore => {
          const out = {};
          fromStore.forEach((value, key) => (out[key] = value));
          return out;
        })
      );
      gsd.end();
    });
    arrayTest.end();
  });
  suite.test('object', (objectTest) => {
    objectTest.test('injects a value', (gsd) => {
      const START_STORE = { x: 10, y: 20 };
      const start = create(START_STORE);
      gsd.same(start.store, START_STORE);

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      start.change({ x: 30, y: 40 });

      gsd.same(start.store, { x: 30, y: 40 });
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: { x: 30, y: 40 },
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
    });

    objectTest.test('modifies AND RETURNS a value', (gsd) => {
      const START_STORE = { x: 10, y: 20 };
      const start = create(START_STORE);
      gsd.same(start.store, START_STORE);

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.x *= 2;
        fromStore.y *= 2;
        return fromStore;
      });

      gsd.same(start.store, { x: 20, y: 40 });
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: { x: 20, y: 40 },
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });

    objectTest.test('modifies BUT DOES NOT RETURN a value', (gsd) => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      gsd.same(start.store, START_STORE);

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.shift();
        fromStore.push(4);
      });

      gsd.same(start.store, [2, 3, 4]);
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: [2, 3, 4],
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });
    objectTest.end();
  });

  suite.test('set', (setTest) => {
    const START_STORE = [10, 20];
    setTest.test('injects a value', (gsd) => {
      const start = create(new Set(START_STORE));
      gsd.same(start.store, new Set(START_STORE));

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      const UPDATE = new Set([3, 4]);
      start.change(UPDATE);

      gsd.same(start.store, UPDATE);
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: UPDATE,
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
    });

    setTest.test('modifies AND RETURNS a value', (gsd) => {
      const start = create(new Set(START_STORE));
      gsd.same(start.store, new Set(START_STORE));

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        const data = [];
        fromStore.forEach(([item]) => data.push(item * 2));
        return new Set(data);
      });

      const UPDATED = new Set([20, 40]);
      gsd.same(start.store, UPDATED);
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: UPDATED,
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
      // even though the mutator "modifies" the store, it operates ona clone, so
    }, { skip: true });

    setTest.test('modifies BUT DOES NOT RETURN a value', (gsd) => {
      const start = create(new Set(START_STORE));
      gsd.same(start.store, new Set(START_STORE));

      const updates = [];
      start.onChange = (store, method, input) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.delete(10);
        fromStore.push(40);
      });

      const UPDATED = new Set([20, 40]);
      gsd.same(start.store, UPDATED);
      gsd.same(updates, [
        {
          input: [],
          method: 'change',
          store: UPDATED,
        },
      ]);

      gsd.notOk(start.store === START_STORE);
      gsd.end();
      // even though the mutator "modifies" the store, it operates ona clone, so
    }, { skip: true });
    setTest.end();
  });
  suite.end();
});
