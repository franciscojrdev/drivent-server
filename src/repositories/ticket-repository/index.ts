import { prisma } from '@/config';

async function findAllTickets() {
  return prisma.ticketType.findMany();
}

async function findTicket(id: number) {
  return prisma.ticket.findFirst({
    where: {enrollmentId:id},
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

async function createTicket(ticketTypeId: number,enrollmentId:number) {
  return prisma.ticket.create({
    data:{
      ticketTypeId,
      enrollmentId,
      status:'RESERVED'
    }
  })
}

async function findUserEnrollment(userId:number) {
  return prisma.enrollment.findUnique({
    where:{userId},
    select:{
      id:true
    }
  })
}

const ticketRepository = {
  findAllTickets,
  findTicket,
  findUserEnrollment,
  createTicket
};

export default ticketRepository;
