import tap from 'tap';
import { create } from '../dist/collect.es.js';

tap.test('walkers', (suite) => {
  suite.test('reduce', (reduce) => {
    reduce.test('scalars', (scalarsTest) => {
        const sc = create(1);
      scalarsTest.throws(() =>
          sc.reduce((sum, value) => {
            return sum + value;
          }, 3)
        );
      scalarsTest.end();
    });

    reduce.test('strings', (stringTest) => {
      stringTest.test('should go over all the characters', (allTest) => {
        const stc = create('All Good Things Must Come To An End');

        const vowels = stc.reduce((memo, letter) => {
          if (/[aeiou]/i.test(letter)) {
            return memo + letter;
          }
          return memo;
        }, '');

        allTest.same(vowels, 'AooiuoeoAE');
        allTest.end();
      });

      stringTest.test('should stop on command', (socTest) => {
        const stc = create('All Good Things Must Come To An End');

        const phrase = stc.reduce((memo, letter, _index, _phrase, stopper) => {
          let out;
          if (/[aeiou]/i.test(letter)) {
            out = memo + letter;
          } else {
            out = memo + letter.toUpperCase();
          }
          if (memo.length > 12) {
            stopper.stop();
          }
          return out;
        }, '');

        socTest.same(phrase, 'ALL GooD THiN');
        socTest.end();
      });

      stringTest.test('should stop on command longer with stopAfterThis', (satTest) => {
        const stc = create('All Good Things Must Come To An End');

        const phrase = stc.reduce((memo, letter, _index, _phrase, stopper) => {
          let out;
          if (/[aeiou]/i.test(letter)) {
            out = memo + letter;
          } else {
            out = memo + letter.toUpperCase();
          }
          if (memo.length > 12) {
            stopper.stopAfterThis();
          }
          return out;
        }, '');

        satTest.same(phrase, 'ALL GooD THiNG');
        satTest.end();
      });
      stringTest.end();
    });

    reduce.test('Map', (mapTest) => {
      mapTest.test('should reduce the map properties', (propsTest) => {
        const mc = create(new Map());
        mc.set('x', 20)
          .set('y', -50)
          .set('z', 100);

        const milDistance = mc.reduce((distance, size) => {
          return distance + Math.abs(size);
        }, 0);

        propsTest.same(milDistance, 170);
        propsTest.end();
      });

      mapTest.test('should stop on stopAfterThis call', (satTest) => {
        const mc = create(new Map());
        'abcdefghij'.split('').forEach((letter, index) => {
          mc.set(letter, (index + 1) * 10);
        });

        const sum = mc.reduce((sum, value, key, _map, stopper) => {
          const nextSum = sum + value;
          if (key === 'g') {
            stopper.stopAfterThis();
          }
          return nextSum;
        }, 0);

        satTest.same(sum, 280);
        satTest.end();
      });
      mapTest.test('should stop sooner on stop call', (socTest) => {
        const mc = create(new Map());
        'abcdefghij'.split('').forEach((letter, index) => {
          mc.set(letter, (index + 1) * 10);
        });

        const sum = mc.reduce((sum, value, key, _map, stopper) => {
          const nextSum = sum + value;
          if (key === 'g') {
            stopper.stop();
          }
          return nextSum;
        }, 0);

        socTest.same(sum, 210);
        socTest.end();
      });
      mapTest.end();
    });

    reduce.test('array', (arrayTest) => {
      arrayTest.test('should reduce the array', (aRedTest) => {
        const ac = create([1, 2, 3, 5, 8, 13, 21, 34]);

        const sum = ac.reduce((sum, value) => sum + value, 0);

        aRedTest.same(sum, 87);
        aRedTest.end();
      });

      arrayTest.test('should stop on command', (socTest) => {
        const ac = create([1, 2, 3, 5, 8, 13, 21, 34]);

        const sum = ac.reduce((sum, value, _k, _a, stopper) => {
          if (sum > 30) {
            stopper.stop();
          }
          return sum + value;
        }, 0);

        socTest.same(sum, 32);
        socTest.end();
      });

      arrayTest.test('should stop longer on stopAfterThis', (socTest) => {
        const ac = create([1, 2, 3, 5, 8, 13, 21, 34]);

        const sum = ac.reduce((sum, value, _k, _a, stopper) => {
          if (sum > 30) {
            stopper.stopAfterThis();
          }
          return sum + value;
        }, 0);

        socTest.same(sum, 53);
        socTest.end();
      });
      arrayTest.end();
    });
    reduce.test('Object', (objTest) => {
      objTest.test('should reduce the object properties', (propsTest) => {
        const mc = create({});
        mc.set('x', 20)
          .set('y', -50)
          .set('z', 100);

        const milDistance = mc.reduce((distance, size) => {
          return distance + Math.abs(size);
        }, 0);

        propsTest.same(milDistance, 170);
        propsTest.end();
      });

      objTest.test('should stop on stopAfterThis call', (satTest) => {
        const mc = create({});
        'abcdefghij'.split('').forEach((letter, index) => {
          mc.set(letter, (index + 1) * 10);
        });

        const sum = mc.reduce((sum, value, key, _map, stopper) => {
          const nextSum = sum + value;
          if (key === 'g') {
            stopper.stopAfterThis();
          }
          return nextSum;
        }, 0);

        satTest.same(sum, 280);
        satTest.end();
      });

      objTest.test('should stop sooner on stop call', (socTest) => {
        const mc = create({});
        'abcdefghij'.split('').forEach((letter, index) => {
          mc.set(letter, (index + 1) * 10);
        });

        const sum = mc.reduce((sum, value, key, _map, stopper) => {
          const nextSum = sum + value;
          if (key === 'g') {
            stopper.stop();
          }
          return nextSum;
        }, 0);

        socTest.same(sum, 210);
        socTest.end();
      });
      objTest.end();
    });

    reduce.end();
  });

  suite.test('map', (mapTest) => {
    mapTest.test('array', (arrayTest) => {
      arrayTest.test('should double values', (dvTest) => {
        const ac = create([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);

        ac.map(v => v * 2);

        dvTest.same(ac.store, [4, 8, 12, 16, 20, 24, 28, 32, 36, 40]);
        dvTest.end();
      });

      arrayTest.test('should stop on command', (socTest) => {
        const ac = create([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);

        ac.map((v, index, _list, stopper) => {
          if (index > 6) {
            stopper.stop();
          }
          return v * 2;
        });

        socTest.same(ac.store, [4, 8, 12, 16, 20, 24, 28]);
        socTest.end();
      });

      arrayTest.test('should stop later on stopAfterThis', (satTest) => {
        const ac = create([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);

        ac.map((v, index, _list, stopper) => {
          if (index > 6) {
            stopper.stopAfterThis();
          }
          return v * 2;
        });

        satTest.same(ac.store, [4, 8, 12, 16, 20, 24, 28, 32]);
        satTest.end();
      });
      arrayTest.end();
    });

    mapTest.test('object', (objectTest) => {
      objectTest.test('should mutate the properties', (propTest) => {
        const oc = create({});
        'abcde'.split('').forEach((letter, index) => {
          oc.set(letter, (index + 1) * 10);
        });

        oc.map((value, key) => `${key}=${value}`);
        propTest.same(oc.store, {
          a: `a=10`,
          b: 'b=20',
          c: 'c=30',
          d: 'd=40',
          e: 'e=50',
        });
        propTest.end();
      });
      objectTest.test('should stop on command', (socTest) => {
        const oc = create({});
        'abcde'.split('').forEach((letter, index) => {
          oc.set(letter, (index + 1) * 10);
        });

        oc.map((value, key, _obj, stopper) => {
          if (value > 30) {
            stopper.stop();
          }
          return `${key}=${value}`;
        });
        socTest.same(oc.store, {
          a: `a=10`,
          b: 'b=20',
          c: 'c=30',
        });
        socTest.end();
      });
      objectTest.end();
    });
    mapTest.end();
  });
  suite.end();
});
