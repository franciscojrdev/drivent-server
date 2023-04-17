import { Router } from 'express';
import { createNewTicket, getTicketByUser, getTicketsByType } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsByType)
  .get('/', getTicketByUser)
  .post('/', validateBody(ticketSchema), createNewTicket);

export { ticketsRouter };
