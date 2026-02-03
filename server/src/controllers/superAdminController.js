import User from "../models/User.js";
import { BadRequestError, UnauthorizedError } from "../utils/errorTemplates.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/envProvider.js";
import { generateAccessToken } from "../utils/jwt.js";  
import { createRefreshToken } from "./refreshTokenController.js";

export const registerSuperAdmin = async (req, res) => {
   const { fullName, email, password } = req.body;

   if (!fullName || !email || !password) throw new BadRequestError("All fields are required");

   const existingSuperAdmin = await User.findOne({ where: { email }, attributes: { exclude: ["password"] } });
   if (existingSuperAdmin) throw new BadRequestError("Super admin already exists");

    const user = await User.create({
        fullName,
        email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        role: "superadmin",
    });

    const accessToken = generateAccessToken({ userId: user.id, role: user.role, gymId: user.gymId || null });
    const refreshToken = await createRefreshToken({ userId: user.id, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

    return res
    .cookie("rtoken", refreshToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
     })
    .status(201).json({
        message: "Created successfully",
        data: {
            user: {
                fullName: user.fullName,
                id: user.id,
                email: user.email,
            }, access_token: { accessToken }
        }, 
    });
}

export const loginSuperAdmin = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) throw new BadRequestError("All fields are required");
    
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedError("Invalid credentials") ; 

    const accessToken = generateAccessToken({ id: user.id, role: user.role, gymId: user.gymId || null });
    const refreshToken = await createRefreshToken({ userId: user.id, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

    return res
     .cookie("rtoken", refreshToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
     })
     .status(200).json({
        message: "Logged in successfully",
        data: {
            user: {
               fullName: user.fullName,
               id: user.id,
               email: user.email,
            }, access_token: { accessToken }
        }, 
     });
}
