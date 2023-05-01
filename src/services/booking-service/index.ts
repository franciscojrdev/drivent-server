import { notFoundError } from "@/errors"
import bookingRepository from "@/repositories/booking-repository"
import roomRepository from "@/repositories/rooms-repository"
import { forbiddenError } from "@/errors/forbidden-error"
import enrollmentRepository from "@/repositories/enrollment-repository"
import ticketsRepository from "@/repositories/tickets-repository"

async function listHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
      throw notFoundError();
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  
    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      throw forbiddenError();
    }
  }
  
async function verifyRoom(roomId:number){
    const room = await roomRepository.findRoom(roomId)

    if(!room) throw notFoundError()
    
    const allBookings = await bookingRepository.findAllBookings(room.id)
    
    if(room.capacity === allBookings.length) throw forbiddenError()
}

async function getBooking(userId:number) {
    const findBooking = await bookingRepository.findBooking(userId)

    if(!findBooking) throw notFoundError()

    return findBooking
}

async function createBooking(userId:number,roomId:number){

    await listHotels(userId)

    await verifyRoom(roomId)
    
    await bookingRepository.createBooking(userId,roomId)

    const {id:bookingId} = await bookingRepository.findBooking(userId)

    return bookingId
}

async function updateBooking(roomId:number,userId:number,bookingId:number) {

    await verifyRoom(roomId)

    const findBooking = await bookingRepository.findBookingById(bookingId)

    if(!findBooking || findBooking.userId !== userId) throw forbiddenError()

    const {id} = await bookingRepository.updateBooking(bookingId,roomId)

    return id
}

const bookingsService = {
    getBooking,
    createBooking,
    updateBooking
}

export default bookingsService