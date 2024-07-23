import { StringUtils, getStringInfo, toUpperCase } from '../app/Utils';

describe('Utils Test suite', () => {
  describe('SrtingUtils test', () => {
    let sut: StringUtils;
    beforeEach(() => {
      sut = new StringUtils();
    });

    it('Should return correct uppercase', () => {
      const actual = sut.toUpperCase('abc');
      expect(actual).toBe('ABC');
    });

    it('Should throw error on invalid argument - function', () => {
      function expectError() {
        const actual = sut.toUpperCase('');
      }
      expect(expectError).toThrow();
      expect(expectError).toThrow('Invalid argument');
    });

    it('Should throw error on invalid argument - arrow function', () => {
      expect(() => sut.toUpperCase('')).toThrow('Invalid argument');
    });

    it('Should throw error on invalid argument - try catch block', (done) => {
      try {
        sut.toUpperCase('');
        done('GetStringInfo should throw error for invalid arg!');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Invalid argument');
        done();
      }
    });
  });

  it('Should return correct uppercase', () => {
    const sut = toUpperCase;
    const expected = 'ABC';

    const actual = sut('abc');

    expect(actual).toBe(expected);
  });

  describe('toUpperCase examples', () => {
    it.each([
      { input: 'abc', expected: 'ABC' },
      { input: 'My-String', expected: 'MY-STRING' },
      { input: 'def', expected: 'DEF' },
    ])('$input to Uppercased should be $expected', ({ input, expected }) => {
      const sut = toUpperCase;
      const actual = sut(input);
      expect(actual).toBe(expected);
    });
  });

  describe('getStringInfo for My-String should', () => {
    test('return right length', () => {
      const actual = getStringInfo('My-String');
      expect(actual.characters).toHaveLength(9);
    });
    test('return right lower case', () => {
      const actual = getStringInfo('My-String');
      expect(actual.lowerCase).toBe('my-string');
    });
    test('return right upper case', () => {
      const actual = getStringInfo('My-String');
      expect(actual.upperCase).toBe('MY-STRING');
    });
    test('return right right characters', () => {
      const actual = getStringInfo('My-String');
      expect(actual.characters.length).toBe(9);

      expect(actual.characters).toEqual([
        'M',
        'y',
        '-',
        'S',
        't',
        'r',
        'i',
        'n',
        'g',
      ]);
      expect(actual.characters).toContain<string>('M');

      expect(actual.characters).toEqual(
        expect.arrayContaining(['y', '-', 'S', 't', 'r', 'i', 'n', 'g', 'M']),
      );
    });

    test('return defined extra info', () => {
      const actual = getStringInfo('My-String');
      expect(actual.extraInfo).not.toBeUndefined();
    });

    test('return right extra info', () => {
      const actual = getStringInfo('My-String');
      expect(actual.extraInfo).toEqual({}); // Compare objects
    });
  });
});
