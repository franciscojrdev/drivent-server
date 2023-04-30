import { createBooking, getBooking, updateBooking } from '@/controllers/bookings-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas';
import { Router } from 'express';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/',validateBody(bookingSchema), createBooking)
  .put('/:bookingId',validateBody(bookingSchema), updateBooking);

export { bookingsRouter };
