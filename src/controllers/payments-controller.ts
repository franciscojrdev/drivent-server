import { AuthenticatedRequest } from '@/middlewares';
import { PaymentProcess } from '@/protocols';
import paymentsService from '@/services/payments-service';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

export async function getPayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ticketId = +req.query.ticketId as number;
  const { userId } = req;
  if (!ticketId) res.sendStatus(400);
  try {
    const paymentData = await paymentsService.findPayments(ticketId, userId);

    res.status(httpStatus.OK).send(paymentData);
  } catch (error) {
    next(error);
  }
}

export async function createPayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const paymentData = req.body as PaymentProcess;
  const { userId } = req;
  try {
    const paymentResult = await paymentsService.createPayments(paymentData, userId);
    res.status(httpStatus.OK).send(paymentResult);
  } catch (error) {
    next(error);
  }
}
