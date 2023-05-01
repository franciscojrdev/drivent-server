import { badRequest } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import { RoomIdBody } from "@/protocols";
import bookingsService from "@/services/bookings-service";
import { NextFunction, Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req:AuthenticatedRequest,res:Response,next:NextFunction) {
    const {userId} = req
    try {
        const booking = await bookingsService.getBooking(userId)
        res.status(httpStatus.OK).send(booking)
    } catch (e) {
        next(e)
    }
}

export async function createBooking(req:AuthenticatedRequest,res:Response,next:NextFunction) {
    const {userId} = req
    const {roomId} = req.body as RoomIdBody

    try {
        const bookingId = await bookingsService.createBooking(userId,roomId)
        res.status(httpStatus.OK).send({bookingId})
    } catch (e) {
        next(e)
    }
}

export async function updateBooking(req:AuthenticatedRequest,res:Response,next:NextFunction) {
    const {userId} = req 
    const {roomId} = req.body as RoomIdBody
    const {bookingId} = req.params
  
    try {
        const booking = await bookingsService.updateBooking(roomId,userId,Number(bookingId))
        res.status(httpStatus.OK).send({booking})
    } catch (e) {
        next(e)
    }
}