import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketsByType(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsWithType = await ticketsService.getTicketsByType();

    console.log(ticketsWithType);
    return res.status(httpStatus.OK).send(ticketsWithType);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTicketByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const userTicket = await ticketsService.getTicket(userId);

    res.status(httpStatus.OK).send(userTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createNewTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  const {userId} = req
  try {
    const createTicket = await ticketsService.createTicket(ticketTypeId,userId);

    res.status(httpStatus.CREATED).send(createTicket)
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
