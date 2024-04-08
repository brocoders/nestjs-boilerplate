import { EntityCondition } from './types/entity-condition.type';

function toDocumentCondition<T extends object>(
  conditionObject: T,
  parentKey: string = '',
  isArray = false,
): Record<string, string | number | { $in: Array<string | number> }> {
  if (isArray && Array.isArray(conditionObject)) {
    const keys = [
      ...new Set(conditionObject.map((value) => Object.keys(value)).flat()),
    ];

    return keys.reduce((acc, key) => {
      const documentKey = key === 'id' ? '_id' : key;
      const newKey = parentKey ? `${parentKey}.${documentKey}` : documentKey;
      const values = conditionObject.map((value) => value[key]);

      if (values.every((value) => value === null || value === undefined)) {
        return acc;
      }

      if (values.every((value) => value instanceof Date)) {
        return {
          ...acc,
          [newKey]: {
            $in: values.map((value) => (value as Date).toISOString()),
          },
        };
      }

      if (values.every((value) => Array.isArray(value))) {
        return {
          ...acc,
          [newKey]: {
            $in: values.flat(),
          },
        };
      }

      return { ...acc, [newKey]: { $in: values } };
    }, {});
  }

  return Object.keys(conditionObject).reduce((acc, key) => {
    const documentKey = key === 'id' ? '_id' : key;
    const value = conditionObject[key];
    const newKey = parentKey ? `${parentKey}.${documentKey}` : documentKey;

    if (value === null || value === undefined) {
      return acc;
    }

    if (value instanceof Date) {
      return { ...acc, [newKey]: value.toISOString() };
    }

    if (Array.isArray(value)) {
      return { ...acc, ...toDocumentCondition(value, newKey, true) };
    }

    if (value instanceof Object) {
      return { ...acc, ...toDocumentCondition(value, newKey) };
    }

    return { ...acc, [newKey]: value };
  }, {});
}

function domainToDocumentCondition<T>(conditions: EntityCondition<T>) {
  return toDocumentCondition(conditions);
}

export default domainToDocumentCondition;
