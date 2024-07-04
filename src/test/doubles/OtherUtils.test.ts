import {
  OtherStringUtils,
  calculateComplexity,
  toUpperCaseWithCB,
} from "../../app/doubles/OtherUtils";

describe.skip("OtherUtils Test suite", () => {
  describe("OtherStringUtils test with spies", () => {
    let sut: OtherStringUtils;
    beforeEach(() => {
      sut = new OtherStringUtils();
    });

    test("Use a spy to track calls", () => {
      const toUpperCaseSpy = jest.spyOn(sut, "toUpperCase");
      sut.toUpperCase("asa");
      expect(toUpperCaseSpy).toHaveBeenCalledWith("asa");
    });

    test("Use a spy to track calls to others modules", () => {
      const consoleLogSpy = jest.spyOn(sut, "logString");
      sut.logString("abc");
      expect(consoleLogSpy).toHaveBeenCalledWith("abc");
    });

    test("Use a spy to replace implementation of a method", () => {
      jest.spyOn(sut as any, "callExternalService").mockImplementation(() => {
        console.log("Calling mock implementation!!!");
      });
      (sut as any).callExternalService();
    });
  });
  describe("Tracking callbacks with jest mocks", () => {
    const callbackMock = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("ToUpperCase - calls callback for invalid argument - tracks calls", () => {
      const actual = toUpperCaseWithCB("", callbackMock);
      expect(actual).toBeUndefined();
      expect(callbackMock).toHaveBeenCalledWith("Invalid argument");
      expect(callbackMock).toHaveBeenCalledTimes(1);
    });

    it("ToUpperCase - calls callback for valid argument - tracks calls", () => {
      const actual = toUpperCaseWithCB("abc", callbackMock);
      expect(actual).toBe("ABC");
      expect(callbackMock).toHaveBeenCalledWith("Called fuction with abc");
      expect(callbackMock).toHaveBeenCalledTimes(1);
    });
  });
  describe("Tracking callbacks", () => {
    let cbArgs = [];
    let timesCalled = 0;

    function callbackMock(str: string) {
      cbArgs.push(str);
      timesCalled++;
    }

    afterEach(() => {
      //clearing tracking fields
      cbArgs = [];
      timesCalled = 0;
    });

    it("ToUpperCase - calls callback for invalid argument - tracks calls", () => {
      const actual = toUpperCaseWithCB("", callbackMock);
      expect(actual).toBeUndefined();
      expect(cbArgs).toContain("Invalid argument");
      expect(timesCalled).toBe(1);
    });

    it("ToUpperCase - calls callback for valid argument - tracks calls", () => {
      const actual = toUpperCaseWithCB("abc", callbackMock);
      expect(actual).toBe("ABC");
      expect(cbArgs).toContain("Called fuction with abc");
      expect(timesCalled).toBe(1);
    });
  });

  it("ToUpperCase - calls callback for invalid argument", () => {
    const actual = toUpperCaseWithCB("", () => {});
    expect(actual).toBeUndefined();
  });

  it("ToUpperCase - calls callback for valid argument", () => {
    const actual = toUpperCaseWithCB("abc", () => {});
    expect(actual).toBe("ABC");
  });

  it("Calculate complexity", () => {
    const someInfo = {
      length: 5,
      extraInfo: {
        field1: "someInfo",
        field2: "someOtherInfo",
      },
    };
    const actual = calculateComplexity(someInfo as any);
    expect(actual).toBe(10);
  });
});
