import create from '../src';

describe('change', () => {
  describe('array', () => {
    it('injects a value', () => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      expect(start.store).toBe(START_STORE);

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      start.change([2, 3, 4]);

      expect(start.store).toEqual([2, 3, 4]);
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: [2, 3, 4],
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
    });

    it('modifies AND RETURNS a value', () => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      expect(start.store).toBe(START_STORE);

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.shift();
        fromStore.push(4);
        return fromStore;
      });

      expect(start.store).toEqual([2, 3, 4]);
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: [2, 3, 4],
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });

    it('modifies BUT DOES NOT RETURN a value', () => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      expect(start.store).toBe(START_STORE);

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.shift();
        fromStore.push(4);
      });

      expect(start.store).toEqual([2, 3, 4]);
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: [2, 3, 4],
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });

    it('throws on a wrong returned type', () => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      expect(start.store).toBe(START_STORE);

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      expect(() =>
        start.change(fromStore => {
          const out = {};
          fromStore.forEach((value, key) => (out[key] = value));
          return out;
        })
      ).toThrow();
    });
  });
  describe('object', () => {
    it('injects a value', () => {
      const START_STORE = { x: 10, y: 20 };
      const start = create(START_STORE);
      expect(start.store).toBe(START_STORE);

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      start.change({ x: 30, y: 40 });

      expect(start.store).toEqual({ x: 30, y: 40 });
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: { x: 30, y: 40 },
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
    });

    it('modifies AND RETURNS a value', () => {
      const START_STORE = { x: 10, y: 20 };
      const start = create(START_STORE);
      expect(start.store).toBe(START_STORE);

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.x *= 2;
        fromStore.y *= 2;
        return fromStore;
      });

      expect(start.store).toEqual({ x: 20, y: 40 });
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: { x: 20, y: 40 },
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });

    it('modifies BUT DOES NOT RETURN a value', () => {
      const START_STORE = [1, 2, 3];
      const start = create(START_STORE);
      expect(start.store).toBe(START_STORE);

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.shift();
        fromStore.push(4);
      });

      expect(start.store).toEqual([2, 3, 4]);
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: [2, 3, 4],
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });
  });

  describe('set', () => {
    const START_STORE = [10, 20];
    it('injects a value', () => {
      const start = create(new Set(START_STORE));
      expect(start.store).toEqual(new Set(START_STORE));

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      const UPDATE = new Set([3, 4]);
      start.change(UPDATE);

      expect(start.store).toEqual(UPDATE);
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: UPDATE,
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
    });

    xit('modifies AND RETURNS a value', () => {
      const start = create(new Set(START_STORE));
      expect(start.store).toEqual(new Set(START_STORE));

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        const data: Array<any> = [];
        fromStore.forEach(([item]) => data.push(item * 2));
        return new Set(data);
      });

      const UPDATED = new Set([20, 40]);
      expect(start.store).toEqual(UPDATED);
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: UPDATED,
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });

    xit('modifies BUT DOES NOT RETURN a value', () => {
      const start = create(new Set(START_STORE));
      expect(start.store).toEqual(new Set(START_STORE));

      const updates: any[] = [];
      start.onChange = (store: any, method: string, input?: any) => {
        updates.push({ store, method, input });
      };
      start.change(fromStore => {
        fromStore.delete(10);
        fromStore.push(40);
      });

      const UPDATED = new Set([20, 40])
      expect(start.store).toEqual(UPDATED);
      expect(updates).toEqual([
        {
          input: [],
          method: 'change',
          store: UPDATED,
        },
      ]);

      expect(start.store === START_STORE).toBeFalsy();
      // even though the mutator "modifies" the store, it operates ona clone, so
    });
  });
});
