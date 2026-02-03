import { RefreshToken, User } from "../models/index.js";
import { generateRefreshToken, generateAccessToken } from "../utils/jwt.js";
import { validateToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../utils/errorTemplates.js";

export const createRefreshToken = async ({ userId, ipAddress, userAgent }) => {

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.destroy({ where: { userId, ipAddress } });

    const dbToken = await RefreshToken.create({
        userId,
        ipAddress,
        userAgent,
        expiresAt,
    });

    const newRefreshToken = generateRefreshToken({ userId, tokenId: dbToken.id });

    return newRefreshToken;
}

export const validateRefreshToken = async (tokenId) => {
    const dbToken = await RefreshToken.findOne({ where: { id: tokenId } });
    if (!dbToken) throw new UnauthorizedError("Invalid refresh token");

    if (dbToken.expiresAt < new Date()) throw new UnauthorizedError("Refresh token expired");

    return dbToken;
}

export const generateNewTokens = async(req, res) => {
    const { rtoken } = req.cookies; 
    const { userId, tokenId } = validateToken(rtoken);
    
    const dbToken = await validateRefreshToken(tokenId);

    const userDetails = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
    if (!userDetails) throw new UnauthorizedError("Access denied, user not found");

    if(dbToken)

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