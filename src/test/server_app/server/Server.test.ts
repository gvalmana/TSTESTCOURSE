import { Server } from "../../../app/server_app/server/Server";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { HTTP_CODES } from "../../../app/server_app/model/ServerModel";

jest.mock("../../../app/server_app/auth/Authorizer");
jest.mock("../../../app/server_app/data/ReservationsDataAccess");
jest.mock("../../../app/server_app/handlers/LoginHandler");
jest.mock("../../../app/server_app/handlers/RegisterHandler");
jest.mock("../../../app/server_app/handlers/ReservationsHandler");

const resquestMock = {
  url: "",
  headers: {
    "user-agent": "jest-test",
  },
};

const responseMock = {
  writeHead: jest.fn(),
  end: jest.fn(),
};

const serverMock = {
  listen: jest.fn(),
  close: jest.fn(),
};

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(resquestMock, responseMock);
    return serverMock;
  },
}));

describe.only("Server Test suite", () => {
  let sut: Server;

  beforeEach(() => {
    sut = new Server();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should start server on port 8080 and end the request", async () => {
    await sut.startServer();
    expect(serverMock.listen).toHaveBeenCalledWith(8080);
    expect(responseMock.end).toHaveBeenCalled();
  });

  it("Should handle register request", async () => {
    resquestMock.url = "localhost:8080/register";
    const handleRequestSpy = jest.spyOn(
      RegisterHandler.prototype,
      "handleRequest"
    );
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(RegisterHandler).toHaveBeenCalledWith(
      resquestMock,
      responseMock,
      expect.any(Authorizer) //Call with the right type of argument
    );
  });

  it("Should handle login request", async () => {
    resquestMock.url = "localhost:8080/login";
    const handleRequestSpy = jest.spyOn(
      LoginHandler.prototype,
      "handleRequest"
    );
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(LoginHandler).toHaveBeenCalledWith(
      resquestMock,
      responseMock,
      expect.any(Authorizer) //Call with the right type of argument
    );
  });

  it("Should handle reservation request", async () => {
    resquestMock.url = "localhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    await sut.startServer();

    expect(handleRequestSpy).toHaveBeenCalledTimes(1);
    expect(ReservationsHandler).toHaveBeenCalledWith(
      resquestMock,
      responseMock,
      expect.any(Authorizer), //Call with the right type of argument
      expect.any(ReservationsDataAccess)
    );
  });

  it("Should do nothing for not supported routes", async () => {
    resquestMock.url = "localhost:8080/someRandomRoute";
    const validateTokenSpy = jest.spyOn(Authorizer.prototype, "validateToken");
    await sut.startServer();

    expect(validateTokenSpy).not.toHaveBeenCalledTimes(1);
  });

  it("Should handle errors in serving request", async () => {
    resquestMock.url = "localhost:8080/reservation";
    const handleRequestSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    handleRequestSpy.mockRejectedValueOnce(new Error("some error"));
    await sut.startServer();
    expect(responseMock.writeHead).toHaveBeenCalledWith(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      JSON.stringify("Internal server error: some error")
    );
  });

  it("Should stop the server if started", async () => {
    serverMock.close.mockImplementation((callback: Function) => {
      callback();
    });
    await sut.startServer();
    await sut.stopServer();
    expect(serverMock.close).toHaveBeenCalledTimes(1);
  });
});
