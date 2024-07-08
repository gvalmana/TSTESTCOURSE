import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("RegisterHandler Test suite", () => {
  let sut: RegisterHandler;

  const request = {
    method: undefined,
  };

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };

  const authorizerMock = {
    registerUser: jest.fn(),
  };

  const someAccount: Account = {
    id: "",
    userName: "someUser",
    password: "somePassword",
  };

  const someId = "1234";

  beforeEach(() => {
    sut = new RegisterHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should register valid account in request", async () => {
    request.method = "POST";
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.registerUser.mockResolvedValueOnce(someId);

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });

    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify({ userId: someId })
    );
  });
});
