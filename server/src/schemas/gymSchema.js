import { z } from "zod";

export const gymSchema = z.object({
    name: z.string({ required_error: "Name is required", invalid_type_error: "Name must be a string" }).trim(),
    location: z.string({ required_error: "Location is required", invalid_type_error: "Location must be a string" }).trim(),
    slug: z.string({ required_error: "Slug is required", invalid_type_error: "Slug must be a string" }).trim(),
    paymentCredentials: z.object({
        cash: z.object({ enabled: z.boolean({ required_error: "Cash is required", invalid_type_error: "Cash must be a boolean" }).optional(), instructions: z.string({ required_error: "Instructions is required", invalid_type_error: "Instructions must be a string" }).trim().optional() }),
        transfer: z.object({ enabled: z.boolean({ required_error: "Transfer is required", invalid_type_error: "Transfer must be a boolean" }).optional(), alias: z.string({ required_error: "Alias is required", invalid_type_error: "Alias must be a string" }).trim().optional(), cbu: z.string({ required_error: "CBU is required", invalid_type_error: "CBU must be a string" }).trim().optional(), holderName: z.string({ required_error: "Holder name is required", invalid_type_error: "Holder name must be a string" }).trim().optional(), holderDni: z.string({ required_error: "Holder DNI is required", invalid_type_error: "Holder DNI must be a string" }).trim().optional() }),
    }).optional(),
})
