import { z } from "zod";


const onBoardingSchema = z.object({
    gymData: z.object({
        name: z.string({ required_error: "Name is required", invalid_type_error: "Name must be a string" }).trim(),
        location: z.string({ required_error: "Location is required", invalid_type_error: "Location must be a string" }).trim(),
        slug: z.string({ required_error: "Slug is required", invalid_type_error: "Slug must be a string" }).trim(),
    }), 
    adminData: z.object({
        fullName: z.string({ required_error: "Full name is required", invalid_type_error: "Full name must be a string" }).trim(),
        email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email({ message: "Invalid email address" }).toLowerCase(),
        password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be a string" }).min(3, { message: "Password must be at least 3 characters long" }),
        dni: z.string({ required_error: "DNI is required", invalid_type_error: "DNI must be a string" }).regex(/^\d{7,8}$/, {
            message: "DNI must be 7-8 digits without dots (e.g. 44836939)",
          }).trim(),
        role: z.enum(["admin"], { required_error: "Role is required", invalid_type_error: "Role must be a string" }).default("admin"),
    })
})



export default {
    onBoardingSchema,
}