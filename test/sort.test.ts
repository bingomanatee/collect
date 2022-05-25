import create from '../src';
import _ from 'lodash';
describe('sort', () => {
  describe('without sorter', () => {
    it('should sort strings', () => {
      const sc = create('cgsabsdzy');
      expect(sc.sort().store).toBe('abcdgssyz');
    });

    it('should sort arrays', () => {
      const sc = create([5, 4, 3, 2, 1, 'liftoff']);

      expect(sc.sort().store).toEqual([1, 2, 3, 4, 5, 'liftoff']);
    });

    it('should sort objects', () => {
      const oc = create({ z: 10, y: 20, x: 30, a: 40 });
      expect(JSON.stringify(oc.sort().store)).toBe(
        '{"a":40,"x":30,"y":20,"z":10}'
      );
    });
  });
  it('sorts maps', () => {
    const oc = create(new Map([]))
      .set('z', 10)
      .set('y', 20)
      .set('x', 30)
      .set('a', 40);
    expect(_.toString(oc.sort().keys)).toBe('a,x,y,z');
    expect(_.toString(oc.items)).toBe('40,30,20,10');
  });
  // @TODO: custom sort functions
});
