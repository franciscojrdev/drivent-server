import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';

async function findPayments(ticketId: number, userId: number) {
  const findTicket = await paymentRepository.findTicket(ticketId);

  if (!findTicket) throw notFoundError();

  const findUserData = await paymentRepository.findUserData(findTicket.enrollmentId);

  if (userId !== findUserData.userId) throw unauthorizedError();

  const findPaymentData = await paymentRepository.findPaymentData(ticketId);

  return findPaymentData;
}

async function createPayments(paymentData: any,userId:number) {
  const findTicket = await paymentRepository.findTicket(paymentData.ticketId);

  if (!findTicket) throw notFoundError();

  const ticketPrice = await paymentRepository.findTicketPrice(findTicket.ticketTypeId)

  const findUserData = await paymentRepository.findUserData(findTicket.enrollmentId);

  if (userId !== findUserData.userId) throw unauthorizedError();
  
  await paymentRepository.createPayment(paymentData,ticketPrice.price)
  
  await paymentRepository.updateTicketStatus(findTicket.id)

  const confirmPaymentData = await paymentRepository.findPaymentData(paymentData.ticketId)

  return confirmPaymentData
}

const paymentsService = {
  findPayments,
  createPayments,
};

export default paymentsService;
