import { prisma } from '@/config';

async function findAllTickets() {
  return prisma.ticketType.findMany();
}

async function findTicket(userId: number) {
  return prisma.ticket.findUnique({
    where: { id: userId },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

async function createTicket(ticketTypeId: number) {
  return;
}

const ticketRepository = {
  findAllTickets,
  findTicket,
  createTicket,
};

export default ticketRepository;
