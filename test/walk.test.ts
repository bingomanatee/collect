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

        console.log('mc store:', mc.store);
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

          console.log('mc store:', mc.store);
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
});
