import _ from 'lodash';
import tap from 'tap';
import pkg from '../dist/index.js';

const { utils: { compare }, create } = pkg;

const NUMBERS = [4, 1, 30, 3, 10, 2, 20, 40];
const LETTERS = 'zaybdxc'.split('');

tap.test('sort', (suite) => {
  suite.test('default sorter (conpare)', (defaultTest) => {
    defaultTest.test('should sort strings', (stringTest) => {
      const sc = create('cgsabsdzy');
      stringTest.same(sc.sort().store, 'abcdgssyz');
      stringTest.end();
    });

    defaultTest.test('should sort arrays', (arrayTest) => {
      const sc = create([5, 4, 3, 2, 1, 'liftoff']);

      arrayTest.same(sc.sort().store, [1, 2, 3, 4, 5, 'liftoff']);
      arrayTest.end();
    });

    defaultTest.test('should sort objects', (objectTest) => {
      const oc = create({ z: 10, y: 20, x: 30, a: 40 });
      objectTest.same(JSON.stringify(oc.sort().store),
        '{"a":40,"x":30,"y":20,"z":10}'
      );
      objectTest.end();
    });
    defaultTest.test('sorts maps', (mapTest) => {
      const oc = create(new Map([]))
        .set('z', 10)
        .set('y', 20)
        .set('x', 30)
        .set('a', 40);
      mapTest.same(_.toString(oc.sort().keys), 'a,x,y,z');
      mapTest.same(_.toString(oc.items), '40,30,20,10');
      mapTest.end();
    });

    defaultTest.test('sorts sets', (setTest) => {
      const sc = create(new Set([5, 4, 3, 2, 1, 'liftoff']));

      setTest.same(sc.sort().store, new Set([1, 2, 3, 4, 5, 'liftoff']));
      setTest.end();
    });

    defaultTest.end();
  });

  suite.test('sorts via custom sort function', (arrayTest) => {
    const sortFn = (a, b) => {
      if (a.name === b.name) {
        return 0;
      }
      if (a.name > b.name) {
        return 1;
      }
      return -1;
    };

    const oc = create([
      { name: 'Bob' },
      { name: 'Alpha' },
      { name: 'Dover' },
      { name: 'Chris' },
    ]);

    oc.sort(sortFn);

    arrayTest.same(oc.store, [
      { name: 'Alpha' },
      { name: 'Bob' },
      { name: 'Chris' },
      { name: 'Dover' },
    ]);
    arrayTest.end();
  });

  suite.test('compare function', (compareTest) => {
    compareTest.test('should sort strings', (stringTest) => {
      stringTest.same(LETTERS.sort(compare), 'abcdxyz'.split(''));
      stringTest.end();
    });

    compareTest.test('should  sort numbers', (numTest) => {
      numTest.same(NUMBERS.sort(compare), [1, 2, 3, 4, 10, 20, 30, 40]);
      numTest.end();
    });

    compareTest.test('should sort numbers after letters', (nlTest) => {
      const LN = _.shuffle([...LETTERS, ...NUMBERS]);
      nlTest.same(LN.sort(compare), [
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
      nlTest.end()
    });

    /**
     * object sort- work in progress
     */
    compareTest.test('should sort objects like strings', (obTest) => {
      const objects = [
        { a: 3, b: 2 },
        { a: 1, b: 1 },
        { a: 2, b: 1 },
        { a: 1, c: 1, b: 0 },
      ];
      console.log('object sort: ', JSON.stringify(objects.sort(compare)));
      obTest.same(objects.sort(compare), [
        { a: 2, b: 1 },
        { a: 3, b: 2 },
        { a: 1, c: 1, b: 0 },
        { a: 1, b: 1 },
      ]);
      obTest.end();
    }, {skip: true});
    compareTest.end();
  });
  suite.end();
});
