import _ from 'lodash';
import tap from 'tap';
import pkg from '../dist/index.js';

const { utils: { compare }, create } = pkg;

describe('type,form detection', () => {
  it('detects strings', () => {
    const c = create('');
    expect(c.form).toBe(FormEnum.scalar);
    expect(c.type).toBe(TypeEnum.string);
  });

  it('detects numbers', () => {
    const c = create(3);
    expect(c.form).toBe(FormEnum.scalar);
    expect(c.type).toBe(TypeEnum.number);
  });

  it('detects arrays', () => {
    const c = create([]);
    expect(c.form).toBe(FormEnum.array);
    expect(c.type).toBe(FormEnum.array);
  });

  it('detects maps', () => {
    const c = create(new Map());
    expect(c.form).toBe(FormEnum.map);
    expect(c.type).toBe(FormEnum.map);
  });

  it('detects objects', () => {
    const c = create({foo: 'bar'});
    expect(c.form).toBe(FormEnum.object);
    expect(c.type).toBe(FormEnum.object);
  });

  it('detects Sets', () => {
    const c = create(new Set([1, 2, 3]));

    expect(c.form).toBe(FormEnum.set);
    expect(c.type).toBe(FormEnum.set);
  });
});
