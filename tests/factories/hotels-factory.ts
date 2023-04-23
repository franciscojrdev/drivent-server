import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI-z6klN1Adx9SmQfdoBkV3AM7FL4Xm4Qb7pJiVety&s'
    },
  });
}
