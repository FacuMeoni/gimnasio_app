import { z } from "zod";

export const membershipSchema = z.object({
    startDate: z.string({ required_error: "Start date is required", invalid_type_error: "Start date must be a string" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Must be a valid date (format YYYY-MM-DD)" })
        .transform((val) => new Date(val)),
    expirationDate: z.string({ required_error: "Expiration date is required", invalid_type_error: "Expiration date must be a string" })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Must be a valid date (format YYYY-MM-DD)" })
        .transform((val) => new Date(val)),

    amount: z.number({ required_error: "Amount is required", invalid_type_error: "Amount must be a number" }).min(0),
    planId: z.string({ required_error: "Plan ID is required", invalid_type_error: "Plan ID must be a string" }).uuid({ message: "Invalid Plan ID" }),
})