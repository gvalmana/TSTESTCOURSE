import { DataBase } from "../../../app/server_app/data/DataBase";
import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";

const insertMock = jest.fn();
const getByMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase", () => {
  return {
    Database: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getByMock,
      };
    }),
  };
});

describe("UserCredentialsDataAccess Test suite", () => {
  let sut: UserCredentialsDataAccess;

  beforeEach(() => {
    sut = new UserCredentialsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should call mock db", async () => {});
});
