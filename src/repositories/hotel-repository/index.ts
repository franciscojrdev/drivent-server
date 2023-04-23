import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelsRooms(hotelId: number) {
  return prisma.hotel.findFirst({
    where: { id: hotelId },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findHotels,
  findHotelsRooms
};

export default hotelRepository;
