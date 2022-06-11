/* eslint-disable @typescript-eslint/ban-ts-ignore */
import tap from 'tap';
import pkg from '../dist/index.js';

const { create } = pkg;

tap.test('fist, last', (firstLastTest) => {
  firstLastTest.test('scalars', (testScalars) => {
    const numCollection = create(42);
    testScalars.throws(() => numCollection.first(7));
    testScalars.throws(() => numCollection.last());
    testScalars.end();
  });
  firstLastTest.test('string', (testString) => {
    const STRING = 'a long time ago in a galaxy far far away';
    testString.test('first', (firstTest) => {
      const sc = create(STRING);
      firstTest.same(sc.first(), ['a']);
      firstTest.same(sc.first(3), 'a l'.split(''));
      firstTest.same(sc.first(1000), STRING.split(''))
      firstTest.end();
    })

    testString.test('last', (lastTest) => {
      const sc = create(STRING);
      lastTest.same(sc.last(), ['y']);
      lastTest.same(sc.last(3), 'way'.split(''));
      lastTest.same(sc.last(1000), STRING.split(''))
      lastTest.end();
    })

    testString.end();
  });

  firstLastTest.test('array', (testArray) => {
    const LIST = [1, 2, 3, 'cow', 1000, 3, 2, 1];
    testArray.test('first', (firstTest) => {
      const sc = create(LIST);
      firstTest.same(sc.first(), [1]);
      firstTest.same(sc.first(3), [1, 2, 3]);
      firstTest.same(sc.first(1000), LIST)
      firstTest.end();
    })

    testArray.test('last', (lastTest) => {
      const sc = create(LIST);
      lastTest.same(sc.last(), [1]);
      lastTest.same(sc.last(3),[3, 2, 1]);
      lastTest.same(sc.last(1000), LIST)
      lastTest.end();
    })
    testArray.end();
  })

  firstLastTest.test('Map', (testMap) => {
    const LIST = [
      [1, 'cow'],
      [2, 'another cow'],
      ['happy', 'sad'],
      ['sad', 'furious'],
    ];
    testMap.test('first', (firstTest) => {
      const sc = create(new Map(LIST));
      firstTest.same(sc.first(), ['cow']);
      firstTest.same(sc.first(3), ['cow', 'another cow', 'sad']);
      firstTest.same(sc.first(1000), LIST.map((item) => item[1]));
      firstTest.end();
    })

    testMap.test('last', (lastTest) => {
      const sc = create(new Map(LIST));
      lastTest.same(sc.last(), ['furious']);
      lastTest.same(sc.last(3),['another cow', 'sad', 'furious']);
      lastTest.same(sc.last(1000), LIST.map((item) => item[1]));
      lastTest.end();
    })
    testMap.end();
  });
  firstLastTest.test('Object', (testObject) => {
    const LIST = [
      [1, 'cow'],
      [2, 'another cow'],
      ['happy', 'sad'],
      ['sad', 'furious'],
    ];

    testObject.test('first', (firstTest) => {
      const sc = create(Object.fromEntries(LIST));
      firstTest.same(sc.first(), ['cow']);
      firstTest.same(sc.first(3), ['cow', 'another cow', 'sad']);
      firstTest.same(sc.first(1000), LIST.map((item) => item[1]));
      firstTest.end();
    })

    testObject.test('last', (lastTest) => {
      const sc = create(Object.fromEntries(LIST));
      lastTest.same(sc.last(), ['furious']);
      lastTest.same(sc.last(3),['another cow', 'sad', 'furious']);
      lastTest.same(sc.last(1000), LIST.map((item) => item[1]));
      lastTest.end();
    })
    testObject.end();
  })

  firstLastTest.test('Set', (testSet) => {
    const LIST = [1, 2, 3, 'cow', 1000];

    testSet.test('first', (firstTest) => {
      const sc = create(new Set(LIST));
      firstTest.same(sc.first(), [1]);
      firstTest.same(sc.first(3), [1, 2, 3]);
      firstTest.same(sc.first(1000), LIST);
      firstTest.end();
    })

    testSet.test('last', (lastTest) => {
      const sc = create(new Set(LIST));
      lastTest.same(sc.last(), [1000]);
      lastTest.same(sc.last(3),[3, 'cow', 1000]);
      lastTest.same(sc.last(1000), LIST);
      lastTest.end();
    })

    testSet.end();
  }, {skip: true})
  firstLastTest.end();
});
