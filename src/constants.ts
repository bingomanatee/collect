/* eslint-disable no-unused-vars */
export enum TypeEnum {
  string = 'string',
  number = 'number',
  date = 'date',
  null = 'null',
  symbol = 'symbol',
  any = 'any',
  undefined = 'undefined',
}

export enum FormEnum {
  array = 'Array',
  map = 'Map',
  object = 'object',
  set = 'set',
  scalar = 'scalar',
  function = 'function',
  any = 'any',
}

export type DefEnum = TypeEnum | FormEnum;

export enum booleanMode {
  byValue = 'value',
  byKey = 'key',
  byBoth = 'both',
}

export enum stopperEnum {
  continue,
  last, // process the return value, but stop iteration
  stop, // do not process the return value - stop immediately
}
