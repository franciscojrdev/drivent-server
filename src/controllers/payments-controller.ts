import { AuthenticatedRequest } from '@/middlewares';
import { NextFunction, Response } from 'express';

export async function getPayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { ticketId } = req.query as Record<string,string>;
  const {userId} = req
  if (!ticketId) res.sendStatus(400);
  try {
    const result = await paymentsService.findPayments(ticketId,userId)
  } catch (error) {
    next(error);
  }
}
