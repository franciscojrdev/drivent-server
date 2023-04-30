import { prisma } from '@/config';

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}
async function findAllBookings(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
  });
}
async function findBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: { id: bookingId },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}
async function updateBooking(bookingId:number,roomId:number) {
  return prisma.booking.update({
    where:{id:bookingId},
    data:{
      roomId
    }
  })
}

const bookingRepository = {
  findBooking,
  findAllBookings,
  findBookingById,
  createBooking,
  updateBooking
};

export default bookingRepository;
