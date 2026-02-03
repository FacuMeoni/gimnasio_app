import { User } from "../models/index.js";
import { BadRequestError } from "../utils/errorTemplates.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/envProvider.js";

export const registerAdmin = async (req, res) => { 
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) throw new BadRequestError("All fields are required");

    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) throw new BadRequestError("Admin already exists");

    const admin = await User.create({
        fullName,
        email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        role: "admin",
    });

    return res.status(201).json({
        message: "Admin created successfully",
        data: {
        user: {
            fullName: admin.fullName,
            id: admin.id,
            email: admin.email,
        },
    }});
}
