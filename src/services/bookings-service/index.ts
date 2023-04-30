import { notFoundError } from "@/errors"
import bookingRepository from "@/repositories/booking-repository"
import hotelsService from "../hotels-service"
import roomRepository from "@/repositories/rooms-repository"
import { forbiddenError } from "@/errors/forbidden-error"


async function verifyRoom(roomId:number){
    const room = await roomRepository.findRoom(roomId)
    const allBookings = await bookingRepository.findAllBookings(room.id)

    if(!room) throw notFoundError()
    if(room.capacity === allBookings.length) throw forbiddenError()
}

async function getBooking(userId:number) {
    const findBooking = await bookingRepository.findBooking(userId)

    if(!findBooking) throw notFoundError()

    return findBooking
}

async function createBooking(userId:number,roomId:number){

    await hotelsService.listHotels(userId)

    await verifyRoom(roomId)
    // const room = await roomRepository.findRoom(roomId)
    // const allBookings = await bookingRepository.findAllBookings(room.id)
    
    // if(!room) throw notFoundError()
    // if(room.capacity === allBookings.length) throw forbiddenError()
    
    await bookingRepository.createBooking(userId,roomId)

    const {id:bookingId} = await bookingRepository.findBooking(userId)

    return bookingId
}

async function updateBooking(roomId:number,userId:number,bookingId:number) {

    await verifyRoom(roomId)

    const findBooking = await bookingRepository.findBookingById(bookingId)

    if(!findBooking || findBooking.userId !== userId) throw forbiddenError()

    const {id} = await bookingRepository.updateBooking(bookingId,roomId)

    console.log(id)

    return id
}

const bookingsService = {
    getBooking,
    createBooking,
    updateBooking
}

export default bookingsService