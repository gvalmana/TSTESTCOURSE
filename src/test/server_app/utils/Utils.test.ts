import { getRequestBody } from '../../../app/server_app/utils/Utils';
import { IncomingMessage } from 'http';

const requestMock = {
  on: jest.fn(),
};

const someObjetc = {
  name: 'Gustavo',
  age: 36,
  city: 'Habana',
};

const someObjectAsString = JSON.stringify(someObjetc);

describe('getRequestBody suit', () => {
  it('Should return objetct for valid JSON', async () => {
    requestMock.on.mockImplementation((event, callback) => {
      if (event == 'data') {
        callback(someObjectAsString);
      } else {
        callback();
      }
    });
    const actual = await getRequestBody(requestMock as any as IncomingMessage);

    expect(actual).toEqual(someObjetc);
  });
  it.skip('Should throw error for invalid JSON', async () => {
    requestMock.on.mockImplementation((event, callback) => {
      if (event == 'data') {
        callback('a' + someObjectAsString);
      } else {
        callback();
      }
    });

    await expect(
      getRequestBody(requestMock as any as IncomingMessage),
    ).rejects.toThrow('Unexpected token a in JSON at position 0');
  });
  it.skip('Should throw error unexpected error', async () => {
    const someError = new Error('Something went wrong!!!');
    requestMock.on.mockImplementation((event, callback) => {
      if (event == 'error') {
        callback(someError);
      } else {
        callback();
      }
    });

    await expect(
      getRequestBody(requestMock as any as IncomingMessage),
    ).rejects.toThrow(someError.message);
  });
});
