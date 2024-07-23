import * as Utils from '../../app/doubles/OtherUtils';

jest.mock('../../app/doubles/OtherUtils', () => ({
  ...jest.requireActual('../../app/doubles/OtherUtils'),
  calculateComplexity: () => {
    return 10;
  },
}));

jest.mock('uuid', () => ({ v4: () => '123' }));

describe('OtherUtils Test suite', () => {
  test('Calculate complexity', () => {
    const result = Utils.calculateComplexity({} as any);
    console.log(result);
  });

  test('Keep other functions', () => {
    const result = Utils.toUpperCase('abc');
    expect(result).toBe('ABC');
  });

  test('String with id', () => {
    const result = Utils.toLowerCaseWihId('ABC');
    console.log(result);
    expect(result).toBe('abc123');
  });
});
