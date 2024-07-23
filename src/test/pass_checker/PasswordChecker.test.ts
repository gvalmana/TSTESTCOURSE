import {
  PasswordChecker,
  PasswordErrors,
} from '../../app/pass_checker/PasswordChecker';

describe('PasswordChecker Test suite', () => {
  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  });

  it('Password with less than 8 characters is invalid', () => {
    const actual = sut.checkPassword('12345');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.SHORT);
  });

  it('Password more than 8 characters is ok', () => {
    const actual = sut.checkPassword('12345678Ad');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
  });

  it('Password with not uppercase is invalid', () => {
    const actual = sut.checkPassword('abcd124');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_UPPERCASE);
  });

  it('Password with uppercase letters is valid', () => {
    const actual = sut.checkPassword('Abcd1234');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPERCASE);
  });

  it('Password with not lowercase is invalid', () => {
    const actual = sut.checkPassword('ABCD1234');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_LOWERCASE);
  });

  it('Password with lowercase letters is valid', () => {
    const actual = sut.checkPassword('ABCd1234');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWERCASE);
  });

  it('Complex password is valid', () => {
    const actual = sut.checkPassword('Abcd1234');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).toHaveLength(0);
  });

  it('Admin password no number is valid', () => {
    const actual = sut.checkAdminPassword('Abcd');
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_NUMBERS);
  });

  it('Admin password number is valid', () => {
    const actual = sut.checkAdminPassword('Abcd1234');
    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBERS);
  });
});
