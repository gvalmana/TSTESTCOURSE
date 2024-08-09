import { Reservation } from '../../app/server_app/model/ReservationModel';

expect.extend({
  toBeValidReservation(reservertaion: Reservation) {
    const validId = reservertaion.id.length > 5 ? true : false;
    const validUser = reservertaion.room.length > 5 ? true : false;
    return {
      pass: validId && validUser,
      message: () => 'expected reservation to have valid id and user',
    };
  },
  toHaveUSer(reservation: Reservation, user: string) {
    const hasUser = reservation.user == user;
    return {
      pass: hasUser,
      message: () =>
        `Expected reserver to have user ${user}, recieved ${reservation.user}`,
    };
  },
});

interface CustomMatchers<R> {
  toBeValidReservation(): R;
  toHaveUSer(user: string): R;
}

declare global {
  namespace jest {
    interface Matchers<R> extends CustomMatchers<R> {}
  }
}

const someReservation: Reservation = {
  id: '123456',
  room: 'someRoom',
  user: 'someUser',
  startDate: 'someStartDate',
  endDate: 'someEndDate',
};

describe('custom matchers test suite', () => {
  it('check for valid reservation', () => {
    expect(someReservation).toBeValidReservation();
    expect(someReservation).toHaveUSer('someUser');
  });
});
