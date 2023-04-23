import { notFoundError, paymentRequired } from '@/errors';
import ticketService from '../tickets-service';
import hotelRepository from '@/repositories/hotel-repository';

async function verifyTicket(userId: number) {
  const ticket = await ticketService.getTicketByUserId(userId);

  const ticketType = await ticketService.getTicketTypeById(ticket.ticketTypeId);

  if (ticket.status === 'RESERVED' || ticketType.isRemote === true || ticketType.includesHotel === false)
    throw paymentRequired();
}

async function getHotels(userId: number) {

  await verifyTicket(userId)

  const hotels = await hotelRepository.findHotels();

  if (hotels.length === 0) throw notFoundError();

  return hotels
}

async function getHotelsRooms(hotelId: number, userId: number) {

  await verifyTicket(userId)

  const hotelRooms = await hotelRepository.findHotelsRooms(hotelId)

  if(!hotelRooms) throw notFoundError()

  return hotelRooms
}

export default { getHotels,getHotelsRooms };
