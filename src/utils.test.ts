import { toUpperCase } from './utils';
import * as assert from 'node:assert';
import { describe, test, mock } from 'node:test';

describe('node test trials', () => {
  test('toUpperCase', () => {
    const actual = toUpperCase('abc');
    const expected = 'ABC';
    assert.strictEqual(actual, expected);
  });

  test('sum mock', () => {
    const toUpperCaseMock = mock.fn((arg) => {
      return toUpperCase(arg);
    });
    assert.strictEqual(toUpperCaseMock.mock.calls.length, 0);
    toUpperCaseMock('abc');
    assert.strictEqual(toUpperCaseMock.mock.calls.length, 1);
  });
});
