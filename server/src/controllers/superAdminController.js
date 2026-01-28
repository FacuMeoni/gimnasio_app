import User from "../models/User.js";
import { BadRequestError, UnauthorizedError } from "../utils/errorTemplates.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/envProvider.js";
import { signToken } from "../utils/jwtGenerator.js";

export const registerSuperAdmin = async (req, res) => {
   const { fullName, email, password } = req.body;

   if (!fullName || !email || !password) throw new BadRequestError("All fields are required");

   const existingSuperAdmin = await User.findOne({ where: { email } });
   if (existingSuperAdmin) throw new BadRequestError("Super admin already exists");

   const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: "superadmin",
    });

    const token = signToken(user);

    return res
    .cookie("token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
     })
    .status(201).json({
        message: "Super admin created successfully",
        data: {
            user: {
                fullName: user.fullName,
                id: user.id,
                email: user.email,
            }
        }, 
    });
}

export const loginSuperAdmin = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedError("Invalid credentials") ; 

    const token = signToken(user);

    return res
     .cookie("token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
     })
     .status(200).json({
        message: "Super admin logged in successfully",
        data: {
            user: {
               fullName: user.fullName,
               id: user.id,
               email: user.email,
            }
        }, 
     });
}
