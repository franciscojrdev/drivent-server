import { badRequest } from '@/errors';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getHotels(userId);
    res.status(httpStatus.OK).send(hotels);
  } catch (e) {
    next(e);
  }
}

export async function getHotelsRooms(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const hotelId = +req.params.hotelId as number;
  const { userId } = req;

  if(!hotelId) throw badRequest()

  try {
    const hotelRooms = await hotelsService.getHotelsRooms(hotelId,userId)
    res.status(httpStatus.OK).send(hotelRooms)
  } catch (e) {
    next(e);
  }
}
