import { TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketsByType(): Promise<TicketType[]> {
  const ticketsData = await ticketRepository.findAllTickets();

  return ticketsData;
}

async function getTicket(userId: number) {
  const ticketData = await ticketRepository.findTicket(userId);

  if (!ticketData) throw notFoundError();

  return ticketData;
}

async function createTicket(ticketTypeId: number) {
  const ticketResponse = await ticketRepository.createTicket(ticketTypeId);
}

const ticketsService = {
  getTicketsByType,
  getTicket,
  createTicket,
};

export default ticketsService;
