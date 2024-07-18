import { Server } from "../../../app/server_app/server/Server";

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
});
