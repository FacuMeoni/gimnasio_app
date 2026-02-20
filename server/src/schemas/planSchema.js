import { z } from "zod";

export const planSchema = z.object({
    description: z.string({ required_error: "Description is required", invalid_type_error: "Description must be a string" }).min(3, { message: "Description must be at least 3 characters long" }).trim().optional(),
    name: z.string({ required_error: "Name is required", invalid_type_error: "Name must be a string" }).min(3, { message: "Name must be at least 3 characters long" }).trim().optional(),
    price: z.number({ required_error: "Price is required", invalid_type_error: "Price must be a number" }).min(0, { message: "Price must be greater than 0" }),
    daysPerWeek: z.enum(["1", "2", "3", "4", "5", "6", "7"], { required_error: "Days per week is required", invalid_type_error: "Days per week must be a string" }),
    isActive: z.boolean({ required_error: "Is active is required", invalid_type_error: "Is active must be a boolean" }).optional(),
    isDeleted: z.boolean({ required_error: "Is deleted is required", invalid_type_error: "Is deleted must be a boolean" }).optional(),
});
