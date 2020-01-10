import * as cdk from '@aws-cdk/core';

/**
 * Normalize a policy field to be the simplest possibel form (Action, Resource, etc.)
 *
 * Arrays: an empty array will become undefined, a singleton array
 * will just be the single object.
 *
 * Objects: empty objects will become undefined.
 */
export function normalizePolicyField(values: any) {
  if (typeof(values) === 'undefined') {
    return undefined;
  }

  if (cdk.Token.isUnresolved(values)) {
    return values;
  }

  if (Array.isArray(values)) {
    if (!values || values.length === 0) {
      return undefined;
    }

    if (values.length === 1) {
      return values[0];
    }

    return values;
  }

  if (typeof(values) === 'object') {
    if (Object.keys(values).length === 0) {
      return undefined;
    }
  }

  return values;
}

/**
 * Normalize a policy principal's fields as much as possible.
 */
export function normalizePolicyPrincipal(principal: { [key: string]: any[] }) {
  const keys = Object.keys(principal);
  if (keys.length === 0) { return undefined; }
  const result: any = {};
  for (const key of keys) {
    const normVal = normalizePolicyField(principal[key]);
    if (normVal) {
      result[key] = normVal;
    }
  }
  if (Object.keys(result).length === 1 && result.AWS === '*') {
    return '*';
  }
  return result;
}

/**
 * Drop undefined entries from object
 */
export function noUndefined<A extends object>(x: A): A {
  const ret: any = {};
  for (const [key, value] of Object.entries(x)) {
    if (value !== undefined) {
      ret[key] = value;
    }
  }
  return ret;
}