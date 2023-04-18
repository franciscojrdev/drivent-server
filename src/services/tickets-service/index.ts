import { TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketsByType(): Promise<TicketType[]> {
  const ticketsData = await ticketRepository.findAllTickets();

  return ticketsData;
}

async function getTicket(userId: number) {

  const enrollmentUser = await ticketRepository.findUserEnrollment(userId) 

  const ticketData = await ticketRepository.findTicket(enrollmentUser.id);

  if (!ticketData || !enrollmentUser) throw notFoundError();

  return ticketData;
}

async function createTicket(ticketTypeId: number,userId:number) {

  const enrollmentUser = await ticketRepository.findUserEnrollment(userId);

  console.log(enrollmentUser)

  if(!enrollmentUser) throw notFoundError()

  await ticketRepository.createTicket(ticketTypeId, enrollmentUser.id)

  const ticketData = await ticketRepository.findTicket(enrollmentUser.id)

  return ticketData
}

const ticketsService = {
  getTicketsByType,
  getTicket,
  createTicket,
};

export default ticketsService;
