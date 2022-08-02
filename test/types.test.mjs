import tap from 'tap';
import { create, enums } from '../dist/collect.es.js';

const { FormEnum, TypeEnum } = enums;

tap.test('type,form detection', (suite) => {
  suite.test('detects strings', (stringTest) => {
    const c = create('');
    stringTest.same(c.form, FormEnum.scalar);
    stringTest.same(c.type, TypeEnum.string);
    stringTest.end();
  });

  suite.test('detects numbers', (numberTest) => {
    const c = create(3);
    numberTest.same(c.form, FormEnum.scalar);
    numberTest.same(c.type, TypeEnum.number);
    numberTest.end();
  });

  suite.test('detects arrays', (arrayTest) => {
    const c = create([]);
    arrayTest.same(c.form, FormEnum.array);
    arrayTest.same(c.type, FormEnum.array);
    arrayTest.end();
  });

  suite.test('detects maps', (mapTest) => {
    const c = create(new Map());
    mapTest.same(c.form, FormEnum.map);
    mapTest.same(c.type, FormEnum.map);
    mapTest.end();
  });

  suite.test('detects objects', (objTest) => {
    const c = create({ foo: 'bar' });
    objTest.same(c.form, FormEnum.object);
    objTest.same(c.type, FormEnum.object);
    objTest.end();
  });

  suite.test('detects Sets', (setTest) => {
    const c = create(new Set([1, 2, 3]));

    setTest.same(c.form, FormEnum.set);
    setTest.same(c.type, FormEnum.set);
    setTest.end();
  });
  suite.end();
});
