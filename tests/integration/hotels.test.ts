import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createTicketTypeTrue,
  createHotel,
  createRooms,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when doesnt exists hotel yet', async () => {
      const toogleBoolean: boolean = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when ticket status is not paid', async () => {
      const toogleBoolean: boolean = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket is remote and dont include hotel', async () => {
      const toogleBoolean: boolean = false;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 200 and with hotels data', async () => {
      const toogleBoolean: boolean = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
          }),
        ]),
      );
    });
    // it('should respond with status 200 and with ticket data', async () => {
    //   const user = await createUser();
    //   const token = await generateValidToken(user);
    //   const enrollment = await createEnrollmentWithAddress(user);
    //   const ticketType = await createTicketType();
    //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    //   const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

    //   expect(response.status).toEqual(httpStatus.OK);
    //   expect(response.body).toEqual({
    //     id: ticket.id,
    //     status: ticket.status,
    //     ticketTypeId: ticket.ticketTypeId,
    //     enrollmentId: ticket.enrollmentId,
    //     TicketType: {
    //       id: ticketType.id,
    //       name: ticketType.name,
    //       price: ticketType.price,
    //       isRemote: ticketType.isRemote,
    //       includesHotel: ticketType.includesHotel,
    //       createdAt: ticketType.createdAt.toISOString(),
    //       updatedAt: ticketType.updatedAt.toISOString(),
    //     },
    //     createdAt: ticket.createdAt.toISOString(),
    //     updatedAt: ticket.updatedAt.toISOString(),
    //   });
    // });
  });
});

describe('GET /hotels/:hotelId', () => {
  const hotelId = 1;
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get(`/hotels/${hotelId}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
      const token = await generateValidToken();

      const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when doesnt exists hotel yet', async () => {
      const toogleBoolean: boolean = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when ticket status is not paid', async () => {
      const toogleBoolean: boolean = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket is remote and dont include hotel', async () => {
      const toogleBoolean: boolean = false;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 400 when hotelId is not valid', async () => {
      const toogleBoolean: boolean = false;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels/:').set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 404 when hotelId return empty data', async () => {
      const toogleBoolean: boolean = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and with hotels and rooms data', async () => {
      const toogleBoolean: boolean = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRooms(hotel.id);

      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
          Rooms: expect.arrayContaining([
            expect.objectContaining({
              id: room.id,
              name: room.name,
              capacity: room.capacity,
              hotelId: room.hotelId,
              createdAt: room.createdAt.toISOString(),
              updatedAt: room.updatedAt.toISOString(),
            }),
          ]),
        }),
      );
    });

    it('should respon with status 200 and with hotels data', async () => {
      const toogleBoolean: boolean = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeTrue(toogleBoolean);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
          }),
        ]),
      );
    });
  });
});
