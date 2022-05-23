import { comparatorObj } from '../types';

export abstract class Match {
  static sameKey(
    key: any,
    k2: any,
    context: comparatorObj,
    many = true, // individually compare keys if arrays
    debug = false
  ) {
    if (!context?.compKeys) {
      if (debug) {
        console.log('Match: no comparator for keys; returning === comparison');
      }
      return key === k2;
    }
    if (many && Array.isArray(k2)) {
      if (debug) {
        console.log(
          'comparing individual keys:',
          k2,
          'to',
          key,
          'context.compKeys = ',
          context?.compKeys
        );
      }
      return k2.some(otherSubKey => {
        const use = context?.compKeys
          ? context.compKeys(key, otherSubKey)
          : key === otherSubKey;
        if (debug) {
          console.log(
            'MATCH subkey comparison: ',
            otherSubKey,
            'to first key',
            key,
            'result: ',
            use
          );
        }
        return use;
      });
    }
    return context.compKeys(key, k2);
  }

  static sameItem(item: any, i2: any, context: comparatorObj, many = true) {
    if (!context?.compItems) {
      return item === i2;
    }
    if (many && Array.isArray(i2)) {
      return i2.some(otherSubItem => {
        return context?.compItems
          ? context.compItems(item, otherSubItem)
          : item === otherSubItem;
      });
    }
    return context.compItems(item, i2);
  }
}
