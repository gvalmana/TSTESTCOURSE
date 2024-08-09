import { Account } from '../../app/server_app/model/AuthModel';
import { Reservation } from '../../app/server_app/model/ReservationModel';
import {
  HTTP_CODES,
  HTTP_METHODS,
} from '../../app/server_app/model/ServerModel';
import { Server } from '../../app/server_app/server/Server';
import { makeAwesomeRequest } from './utils/http-client';
describe('Server app integration test suite', () => {
  let server: Server;

  beforeAll(() => {
    server = new Server();
    server.startServer();
  });

  afterAll(() => {
    server.stopServer();
  });
  const someUser: Account = {
    id: '',
    userName: 'someUserName',
    password: 'somePassword',
  };

  const someReservation: Reservation = {
    id: '',
    room: 'someRoom',
    user: 'someUser',
    startDate: 'someStartDate',
    endDate: 'someEndDate',
  };

  it('Should register new user', async () => {
    const result = await fetch('http://localhost:8080/register', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser),
    });
    const resultBody = await result.json();
    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.userId).toBeDefined();
  });

  it('Should register new user with awesomRequest', async () => {
    const result = await makeAwesomeRequest(
      {
        host: 'localhost',
        port: 8080,
        method: HTTP_METHODS.POST,
        path: '/register',
      },
      someUser,
    );
    expect(result.statusCode).toBe(HTTP_CODES.CREATED);
    expect(result.body.userId).toBeDefined();
  });

  let token: string;

  it('Should register login user', async () => {
    const result = await fetch('http://localhost:8080/login', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someUser),
    });
    const resultBody = await result.json();
    token = resultBody.token;
    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.token).toBeDefined();
    token = resultBody.token;
  });

  let createReservationId: string;

  it('Should create new reservation if authenticated', async () => {
    const result = await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        Authorization: token,
      },
    });
    const resultBody = await result.json();
    expect(result.status).toBe(HTTP_CODES.CREATED);
    expect(resultBody.reservationId).toBeDefined();
    createReservationId = resultBody.reservationId;
  });
  it('Should get reservation if authenticated', async () => {
    const result = await fetch(
      `http://localhost:8080/reservation/${createReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          Authorization: token,
        },
      },
    );
    const resultBody = await result.json();
    const expectedReservation = structuredClone(someReservation);
    expectedReservation.id = createReservationId;
    expect(result.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toEqual(expectedReservation);
  });

  it('Should create and retrieve multiple reservation if authenticated', async () => {
    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        Authorization: token,
      },
    });
    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        Authorization: token,
      },
    });
    await fetch('http://localhost:8080/reservation', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(someReservation),
      headers: {
        Authorization: token,
      },
    });
    const getAllResult = await fetch(`http://localhost:8080/reservation/all`, {
      method: HTTP_METHODS.GET,
      headers: {
        Authorization: token,
      },
    });
    const resultBody = await getAllResult.json();
    expect(getAllResult.status).toBe(HTTP_CODES.OK);
    expect(resultBody).toHaveLength(4);
  });

  it('Should update reservation if authenticated', async () => {
    const result = await fetch(
      `http://localhost:8080/reservation/${createReservationId}`,
      {
        method: HTTP_METHODS.PUT,
        body: JSON.stringify({
          startDate: 'someOtherStartDate',
        }),
        headers: {
          Authorization: token,
        },
      },
    );
    expect(result.status).toBe(HTTP_CODES.OK);
    const getResult = await fetch(
      `http://localhost:8080/reservation/${createReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          Authorization: token,
        },
      },
    );
    const getResultBody: Reservation = await getResult.json();
    expect(getResultBody.startDate).toBe('someOtherStartDate');
  });

  it('Should delete reservation if authenticated', async () => {
    const result = await fetch(
      `http://localhost:8080/reservation/${createReservationId}`,
      {
        method: HTTP_METHODS.DELETE,
        headers: {
          Authorization: token,
        },
      },
    );
    expect(result.status).toBe(HTTP_CODES.OK);
    const getResult = await fetch(
      `http://localhost:8080/reservation/${createReservationId}`,
      {
        method: HTTP_METHODS.GET,
        headers: {
          Authorization: token,
        },
      },
    );
    expect(getResult.status).toBe(HTTP_CODES.NOT_fOUND);
  });
});
