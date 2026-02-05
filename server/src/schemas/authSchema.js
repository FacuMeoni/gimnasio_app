import { z } from "zod";

export const superAdminSchema = z.object({
    fullName: z.string({ required_error: "Full name is required", invalid_type_error: "Full name must be a string" }).min(3, { message: "Full name must be at least 3 characters long" }).trim(),
    email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email({ message: "Invalid email address" }).trim().toLowerCase(),
    password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be a string" }).min(3, { message: "Password must be at least 3 characters long" }).trim(),
})


export const adminSchema = z.object({
  fullName: z.string({ required_error: "Full name is required", invalid_type_error: "Full name must be a string" }).min(3, { message: "Full name must be at least 3 characters long" }).trim(),
  email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email({ message: "Invalid email address" }).trim().toLowerCase(),
  password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be a string" }).min(3, { message: "Password must be at least 3 characters long" }).trim(),
  role: z.enum(["admin", "employee"], { required_error: "Role is required", invalid_type_error: "Role must be a string" }).default("admin"),
  phone: z.string({ required_error: "Phone is required", invalid_type_error: "Phone must be a string" }).min(10, { message: "Phone must be at least 10 characters long" }).trim().optional(),
  birthDate: z.date({ required_error: "Birth date is required", invalid_type_error: "Birth date must be a date" }).min(new Date(1900, 0, 1), { message: "Birth date must be at least 1900-01-01" }).max(new Date(), { message: "Birth date must be before today" }).optional(),
  dni: z.string({ required_error: "DNI is required", invalid_type_error: "DNI must be a string" }).regex(/^\d{7,8}$/, {
    message: "DNI must be 7-8 digits without dots (e.g. 44836939)",
  }).trim(),
});


export const userSchema = z.object({
  fullName: z.string({ required_error: "Full name is required", invalid_type_error: "Full name must be a string" }).min(3, { message: "Full name must be at least 3 characters long" }).trim(),
  email: z.string({ required_error: "Email is required", invalid_type_error: "Email must be a string" }).email({ message: "Invalid email address" }).trim().toLowerCase(),
  password: z.string({ required_error: "Password is required", invalid_type_error: "Password must be a string" }).min(3, { message: "Password must be at least 3 characters long" }).trim(),
  birthDate: z.date({ required_error: "Birth date is required", invalid_type_error: "Birth date must be a date" }).min(new Date(1900, 0, 1), { message: "Birth date must be at least 1900-01-01" }).max(new Date(), { message: "Birth date must be before today" }).optional(),
  height: z.number({ required_error: "Height is required", invalid_type_error: "Height must be a number" }).min(100, { message: "Height must be at least 100cm" }).max(250, { message: "Height must be less than 250cm" }).optional(),
  weight_history: z
    .array(
      z.object({
        weight: z.number({ invalid_type_error: "Weight must be a number" }).min(40, { message: "Weight must be at least 40kg" }).max(200, { message: "Weight must be less than 200kg" }),
        date: z.string().optional(),
      })
    )
    .optional(),
  dni: z.string({ required_error: "DNI is required", invalid_type_error: "DNI must be a string" }).regex(/^\d{7,8}$/, {
    message: "DNI must be 7-8 digits without dots (e.g. 44836939)",
  }).trim(),
  phone: z.string({ required_error: "Phone is required", invalid_type_error: "Phone must be a string" }).min(10, { message: "Phone must be at least 10 characters long" }).trim().optional(),
})
