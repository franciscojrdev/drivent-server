import Joi from "joi";

export const bookingSchema = Joi.object({
    roomId: Joi.number().min(1).required()
})