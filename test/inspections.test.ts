import create from '../src';

describe('inspections', () => {
  describe('scalars', () => {
    it('fails on most inspections', () => {
      const c = create(2);
      expect(c.size).toBe(0);
      expect(() => c.hasKey(1)).toThrow(
        'hasKey not available for scalar collection'
      );
      expect(() => c.hasItem(1)).toThrow(
        'hasItem not available for scalar collection'
      );
      expect(() => c.keys).toThrow('keys not available for scalar collection');
      expect(() => c.items).toThrow(
        'items not available for scalar collection'
      );
      expect(() => c.keyOf(1)).toThrow(
        'keyOf not available for scalar collection'
      );
    });
  });

  describe('strings', () => {
    const STRING = 'a long winter';
    const sc = create(STRING);

    expect(sc.size).toBe(STRING.length);
    expect(sc.hasItem('w')).toBeTruthy();
    expect(sc.hasItem('z')).toBeFalsy();
    expect(sc.keys).toEqual(STRING.split('').map((_c, i) => i));
    expect(sc.items).toEqual(STRING.split(''));
    expect(sc.keyOf('w')).toBe(STRING.indexOf('w'));
    expect(sc.keyOf('z')).toBeUndefined();
  });

  describe('Map', () => {
    it('has the expected inspection behavior', () => {
      const m = new Map<any, any>([
        ['x', 100],
        ['y', 200],
      ]);

      const mc = create(m);

      expect(mc.size).toBe(2);
      expect(mc.hasItem(200)).toBeTruthy();
      expect(mc.hasItem(500)).toBeFalsy();
      expect(mc.keys).toEqual(['x', 'y']);
      expect(mc.items).toEqual([100, 200]);
      expect(mc.keyOf(200)).toBe('y');
      expect(mc.keyOf(400)).toBeUndefined();
    });
  });

  describe('Array', () => {
    it('has the expected inspection behavior', () => {
      const list = ['a', 1, 'b', 2, 'c', 3];

      const ac = create(list);

      expect(ac.size).toBe(6);
      expect(ac.hasItem('a')).toBeTruthy();
      expect(ac.hasItem(3)).toBeTruthy();
      expect(ac.hasItem(4)).toBeFalsy();

      expect(ac.keys).toEqual([0, 1, 2, 3, 4, 5]);
    });
  });
});
