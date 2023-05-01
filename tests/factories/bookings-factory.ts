import { prisma } from '@/config';

//Sabe criar objetos - Hotel do banco
export async function createBooking(userId:number,roomId:number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

