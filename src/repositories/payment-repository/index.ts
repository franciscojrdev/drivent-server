import { prisma } from '@/config';
import { PaymentProcess } from '@/protocols';
import { Enrollment, Ticket } from '@prisma/client';

async function findTicket(ticketId: number): Promise<Ticket> {
  return prisma.ticket.findUnique({ where: { id: ticketId } });
}
async function findTicketPrice(ticketTypeId: number){
  return prisma.ticketType.findFirst({
    where: { id: ticketTypeId },
    select: {
      price: true,
    },
  });
}
async function findUserData(enrollmentId: number): Promise<Enrollment> {
  return prisma.enrollment.findFirst({ where: { id: enrollmentId } });
}

async function findPaymentData(ticketId: number) {
  return prisma.payment.findFirst({ where: { ticketId } });
}

async function createPayment(paymentData: any,price:number) {
  return prisma.payment.create({
    data: {
        ticketId:paymentData.ticketId,
        value:price,
        cardIssuer:paymentData.cardData.issuer,
        cardLastDigits:paymentData.cardData.number
    },
  });
}

async function updateTicketStatus(id: number) {
  return prisma.ticket.update({
    where: { id },
    data: {
      status: 'PAID',
    },
  });
}

const paymentRepository = {
  findUserData,
  findTicket,
  findTicketPrice,
  findPaymentData,
  createPayment,
  updateTicketStatus,
};

export default paymentRepository;
