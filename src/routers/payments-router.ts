import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createPayments, getPayments } from '@/controllers/payments-controller';
import { paymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPayments)
  .post('/process', validateBody(paymentSchema),createPayments);

export { paymentsRouter };
