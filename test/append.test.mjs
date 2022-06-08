/* eslint-disable @typescript-eslint/ban-ts-ignore */
import tap from 'tap';
import pkg from '../dist/index.js';

const { create } = pkg;

tap.test('apppend', (appendTest) => {
  appendTest.test('scalars', (testScalars) => {
    const numCollection = create(42);
    testScalars.throws(() => numCollection.addAfter(7));
    testScalars.throws(() => numCollection.addBefore('a', 7));
    testScalars.throws(() => numCollection.removeLast(42));
    testScalars.throws(() => numCollection.removeFirst(0));
    testScalars.end();
  });
  appendTest.test('string', (testString) => {
    const STRING = 'a long time ago in a galaxy far far away';
    testString.test('addBefore', (addBeforeTest) => {
      const sc = create(STRING);
      sc.addBefore('!')
      addBeforeTest.same(sc.store, `!${STRING}`)
      addBeforeTest.end();
    })

    testString.test('addAfter', (addAfterTest) => {
      const sc = create(STRING);
      sc.addAfter('!')
      addAfterTest.same(sc.store, `${STRING}!`)
      addAfterTest.end();
    })

    testString.test('removeFirst', (removeFirstTest) => {
      const sc = create(STRING);
      const first = sc.removeFirst();
      removeFirstTest.same(sc.store, STRING.substring(1));
      removeFirstTest.same(first, 'a');
      removeFirstTest.end();
    })

    testString.test('removeLast', (removeLastTest) => {
      const sc = create(STRING);
      const last = sc.removeLast();

      removeLastTest.same(sc.store, 'a long time ago in a galaxy far far awa');
      removeLastTest.same(last, 'y');
      removeLastTest.end();
    })

    testString.end();
  });

  appendTest.test('array', (testArray) => {
    const LIST = [1, 2, 3, 'cow', 1000, 3, 2, 1];
    testArray.test('addBefore', (addBeforeTest) => {
      const sc = create(LIST);
      sc.addBefore('horse')
      addBeforeTest.same(sc.store, ['horse', ...LIST])
      addBeforeTest.end();
    })

    testArray.test('addAfter', (addAfterTest) => {
      const sc = create(LIST);
      sc.addAfter('horse')
      addAfterTest.same(sc.store, [...LIST, 'horse'])
      addAfterTest.end();
    })

    testArray.test('removeFirst', (removeFirstTest) => {
      const sc = create(LIST);
      const first = sc.removeFirst();
      removeFirstTest.same(sc.store, LIST.slice(1));
      removeFirstTest.same(first, LIST[0]);
      removeFirstTest.end();
    })

    testArray.test('removeLast', (removeLastTest) => {
      const sc = create(LIST);
      const last = sc.removeLast();

      const WITHOUT = [...LIST];
      WITHOUT.pop();
      removeLastTest.same(sc.store, WITHOUT);
      removeLastTest.same(last, LIST[LIST.length - 1]);
      removeLastTest.end();
    })
    testArray.end();
  });

  appendTest.test('Map', (testMap) => {
    const LIST = [
      [1, 'cow'],
      [2, 'another cow'],
      ['happy', 'sad'],
      ['sad', 'furious'],
    ];
    testMap.test('addBefore', (addBeforeTest) => {
      const sc = create(new Map(LIST));
      sc.addBefore('camel', 'angry');
      addBeforeTest.same(sc.store, new Map([['angry', 'camel' ], ...LIST]), 'map addBefore');
      addBeforeTest.end();
    })

    testMap.test('addAfter', (addAfterTest) => {
      const sc = create(new Map(LIST));
      sc.addAfter('horse', 'angry')
      addAfterTest.same(sc.store, new Map([...LIST, ['angry', 'horse' ]]), 'map addAfter');
      addAfterTest.end();
    })

    testMap.test('removeFirst', (removeFirstTest) => {
      const sc = create(new Map(LIST));
      const first = sc.removeFirst();
      removeFirstTest.same(sc.store, new Map(LIST.slice(1)));
      removeFirstTest.same(first, LIST[0][1]);
      removeFirstTest.end();
    })

    testMap.test('removeLast', (removeLastTest) => {
      const sc = create(new Map(LIST));
      const last = sc.removeLast();

      const WITHOUT = [...LIST];
      WITHOUT.pop();
      removeLastTest.same(sc.store, new Map(WITHOUT));
      removeLastTest.same(last, LIST[LIST.length - 1][1]);
      removeLastTest.end();
    })
    testMap.end();
  });
  appendTest.test('Object', (testObject) => {
    const LIST = [
      ['happy', 'sad'],
      ['sad', 'angry'],
    ];

    // @ts-ignore
    testObject.test('addBefore', (addBeforeTest) => {
      const sc = create(Object.fromEntries(LIST));
      sc.addBefore('horse', 'angry')
      addBeforeTest.same(sc.store, Object.fromEntries([['angry', 'horse'], ...LIST]))
      addBeforeTest.end();
    })

    testObject.test('addAfter', (addAfterTest) => {
      const sc = create(Object.fromEntries(LIST));
      sc.addAfter('horse', 'angry')
      addAfterTest.same(sc.store, Object.fromEntries([ ...LIST, ['angry', 'horse']]))
      addAfterTest.end();
    })

    testObject.test('removeFirst', (removeFirstTest) => {
      const sc = create(Object.fromEntries(LIST));
      const first = sc.removeFirst();
      removeFirstTest.same(sc.store, Object.fromEntries(LIST.slice(1)));
      removeFirstTest.same(first, LIST[0][1]);
      removeFirstTest.end();
    })

    testObject.test('removeLast', (removeLastTest) => {
      const sc = create(Object.fromEntries(LIST));
      const last = sc.removeLast();

      const WITHOUT = [...LIST];
      WITHOUT.pop();
      removeLastTest.same(sc.store, Object.fromEntries(WITHOUT));
      removeLastTest.same(last, LIST[LIST.length - 1][1]);
      removeLastTest.end();
    })
    testObject.end();
  });

  appendTest.test('Set', (testSet) => {
    const LIST = [1, 2, 3, 'cow', 1000];
    testSet.test('addBefore', (addBeforeTest) => {
      const setCollection = create(new Set(LIST));
      setCollection.addBefore('horse', )
      addBeforeTest.same(setCollection.store, new Set(['horse', ...LIST]))
      addBeforeTest.end();
    })

    testSet.test('addAfter', (addAfterTest) => {
      const setCollection = create(new Set(LIST));
      setCollection.addAfter('horse', )
      addAfterTest.same(setCollection.store, new Set([...LIST, 'horse']))
      addAfterTest.end();
    })

    testSet.end();
  });

  appendTest.end();
});
