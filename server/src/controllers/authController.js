import { User } from "../models/index.js";
import { BadRequestError, UnauthorizedError } from "../utils/errorTemplates.js";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../utils/envProvider.js";
import { generateAccessToken } from "../utils/jwt.js";
import { createRefreshToken, getValidRefreshTokenById } from "../services/authServices.js";
import { validateToken } from "../utils/jwt.js";
import { RefreshToken } from "../models/index.js";

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
 
export const login = async (req, res) => {
     const { email, password } = req.body;
 
     if(!email || !password) throw new BadRequestError("All fields are required");
     
     const user = await User.findOne({ where: { email } });
     if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedError("Invalid credentials") ; 
 
     const accessToken = generateAccessToken({ userId: user.id, role: user.role });
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
 
export const generateNewTokens = async(req, res) => {
    const { rtoken } = req.cookies; 
    const { userId, tokenId } = validateToken(rtoken);
    
    const dbToken = await getValidRefreshTokenById(tokenId);

    const userDetails = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
    if (!userDetails) throw new UnauthorizedError("Access denied, user not found");
    
    if(dbToken.userId !== userId) throw new UnauthorizedError("Access denied, token not found");

    await RefreshToken.destroy({ where: { userId, ipAddress: req.ip } });
    
    const newAccessToken = generateAccessToken({ userId: userDetails.id, role: userDetails.role, gymId: userDetails.gymId || null });
    const newRefreshToken = await createRefreshToken({ userId: userDetails.id, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

    return res
    .cookie("rtoken", newRefreshToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
     })
    .status(200).json({
        message: "New tokens generated successfully",
        data: { 
            user: {
                fullName: userDetails.fullName,
                id: userDetails.id,
                email: userDetails.email,
            }, access_token: { newAccessToken } 
        },
    });
}

export const logout = async(req, res) => {
    const { userId, tokenId } = validateToken(req.cookies.rtoken);

    await RefreshToken.destroy({ where: { userId, id: tokenId } });

    return res.clearCookie("rtoken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    }).status(200).json({ message: "Logged out successfully" });
}

export const registerUser = async(req, res) => {
    const { fullName, email, password, birthDate, height, weight, injuries, goals, dni, phone } = req.body;

    if(!fullName || !email || !password) throw new BadRequestError("All fields are required");

    const existingUser = await User.findOne({ where: { fullName } });
    if(existingUser) throw new BadRequestError("User already exists");

    const user = await User.create({
        fullName,
        email,
        password: await bcrypt.hash(password, SALT_ROUNDS),
        birthDate,
        height,
        weight,
        injuries,
        goals,
        dni,
        phone,
        role: "user",
    });

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = await createRefreshToken({ userId: user.id, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

    return res
    .cookie("rtoken", refreshToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
     })
    .status(201).json({
        message: "User created successfully",
        data: { 
            user: {
                fullName: user.fullName,
                id: user.id,
                email: user.email,
            }, access_token: { accessToken } 
        },
    });
}