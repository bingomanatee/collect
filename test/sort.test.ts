import create from '../src';
import _ from 'lodash';
import compare from '../src/utils/compare';
const NUMBERS = [4, 1, 30, 3, 10, 2, 20, 40];
const LETTERS = 'zaybdxc'.split('');

describe('sort', () => {
  describe('default sorter (conpare)', () => {
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
    it('sorts maps', () => {
      const oc = create(new Map([]))
        .set('z', 10)
        .set('y', 20)
        .set('x', 30)
        .set('a', 40);
      expect(_.toString(oc.sort().keys)).toBe('a,x,y,z');
      expect(_.toString(oc.items)).toBe('40,30,20,10');
    });
  });

  xit('sorts via custom sort function', () => {
    xit('should sort arrays', () => {});
  });

  describe('compare function', () => {
    it('should sort strings', () => {
      expect(LETTERS.sort(compare)).toEqual('abcdxyz'.split(''));
    });

    it('should  sort numbers', () => {
      expect(NUMBERS.sort(compare)).toEqual([1, 2, 3, 4, 10, 20, 30, 40]);
    });

    it('should sort numbers after letters', () => {
      const LN = _.shuffle([...LETTERS, ...NUMBERS]);
      expect(LN.sort(compare)).toEqual([
        1,
        2,
        3,
        4,
        10,
        20,
        30,
        40,
        'a',
        'b',
        'c',
        'd',
        'x',
        'y',
        'z',
      ]);
    });

    /**
     * object sort- work in progress
     */
    xit('should sort objects like strings', () => {
      const objects = [
        { a: 3, b: 2 },
        { a: 1, b: 1 },
        { a: 2, b: 1 },
        { a: 1, c: 1, b: 0 },
      ];
      console.log('object sort: ', JSON.stringify(objects.sort(compare)));
      expect(objects.sort(compare)).toEqual([
        { a: 2, b: 1 },
        { a: 3, b: 2 },
        { a: 1, c: 1, b: 0 },
        { a: 1, b: 1 },
      ]);
    });
  });
});
