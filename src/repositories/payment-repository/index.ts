import { prisma } from "@/config"



async function findPayment(){
    return prisma.
}


const paymentRepository = {
    findPayment
}

export default paymentRepository