import create from '../src';

describe('walkers', () => {
  describe('reduce', () => {
    describe('scalars', () => {
      it('should throw', () => {
        const sc = create(1);
        expect(() =>
          sc.reduce((sum, value) => {
            return sum + value;
          }, 3)
        ).toThrow();
      });
    });

    describe('strings', () => {
      it('should go over all the characters', () => {
        const stc = create('All Good Things Must Come To An End');

        const vowels = stc.reduce((memo, letter) => {
          if (/[aeiou]/i.test(letter)) {
            return memo + letter;
          }
          return memo;
        }, '');

        expect(vowels).toBe('AooiuoeoAE');
      });

      it('should stop on command', () => {
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

        expect(phrase).toBe('ALL GooD THiN');
      });

      it('should stop on command longer with stopAfterThis', () => {
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

        expect(phrase).toBe('ALL GooD THiNG');
      });
    });

    describe('Map', () => {
      it('should reduce the map properties', () => {
        const mc = create(new Map());
        mc.set('x', 20)
          .set('y', -50)
          .set('z', 100);

        const milDistance = mc.reduce((distance, size) => {
          return distance + Math.abs(size);
        }, 0);

        expect(milDistance).toBe(170);
      });

      it('should stop on stopAfterThis call', () => {
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

        expect(sum).toBe(280);
      });
      it('should stop sooner on stop call', () => {
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

        expect(sum).toBe(210);
      });
    });

    describe('array', () => {
      it('should reduce the array', () => {
        const ac = create([1, 2, 3, 5, 8, 13, 21, 34]);

        const sum = ac.reduce((sum, value) => sum + value, 0);

        expect(sum).toBe(87);
      });

      it('should stop on command', () => {
        const ac = create([1, 2, 3, 5, 8, 13, 21, 34]);

        const sum = ac.reduce((sum, value, _k, _a, stopper) => {
          if (sum > 30) stopper.stop();
          return sum + value;
        }, 0);

        expect(sum).toBe(32);
      });

      it('should stop longer on stopAfterThis', () => {
        const ac = create([1, 2, 3, 5, 8, 13, 21, 34]);

        const sum = ac.reduce((sum, value, _k, _a, stopper) => {
          if (sum > 30) stopper.stopAfterThis();
          return sum + value;
        }, 0);

        expect(sum).toBe(53);
      });

      describe('Object', () => {
        it('should reduce the object properties', () => {
          const mc = create({});
          mc.set('x', 20)
            .set('y', -50)
            .set('z', 100);

          const milDistance = mc.reduce((distance, size) => {
            return distance + Math.abs(size);
          }, 0);

          expect(milDistance).toBe(170);
        });

        it('should stop on stopAfterThis call', () => {
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

          expect(sum).toBe(280);
        });

        it('should stop sooner on stop call', () => {
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

          expect(sum).toBe(210);
        });
      });
    });
  });

  describe('map', () => {
    describe('array', () => {
      it('should double values', () => {
        const ac = create([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);

        ac.map(v => v * 2);

        expect(ac.store).toEqual([4, 8, 12, 16, 20, 24, 28, 32, 36, 40]);
      });

      it('should stop on command', () => {
        const ac = create([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);

        ac.map((v, index, _list, stopper) => {
          if (index > 6) stopper.stop();
          return v * 2;
        });

        expect(ac.store).toEqual([4, 8, 12, 16, 20, 24, 28]);
      });

      it('should stop later on stopAfterThis', () => {
        const ac = create([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);

        ac.map((v, index, _list, stopper) => {
          if (index > 6) stopper.stopAfterThis();
          return v * 2;
        });

        expect(ac.store).toEqual([4, 8, 12, 16, 20, 24, 28, 32]);
      });
    });

    describe('object', () => {
      it('should mutate the properties', () => {
        const oc = create({});
        'abcde'.split('').forEach((letter, index) => {
          oc.set(letter, (index + 1) * 10);
        });

        oc.map((value, key) => `${key}=${value}`);
        expect(oc.store).toEqual({
          a: `a=10`,
          b: 'b=20',
          c: 'c=30',
          d: 'd=40',
          e: 'e=50',
        });
      });
      it('should stop on command', () => {
        const oc = create({});
        'abcde'.split('').forEach((letter, index) => {
          oc.set(letter, (index + 1) * 10);
        });

        oc.map((value, key, _obj, stopper) => {
          if (value > 30) stopper.stop();
          return `${key}=${value}`;
        });
        expect(oc.store).toEqual({
          a: `a=10`,
          b: 'b=20',
          c: 'c=30',
        });
      });
    });
  });
});
