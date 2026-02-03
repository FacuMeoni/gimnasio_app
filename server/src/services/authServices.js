import { RefreshToken } from "../models/index.js";
import { generateRefreshToken } from "../utils/jwt.js";
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

export const getValidRefreshTokenById = async (tokenId) => {
    const dbToken = await RefreshToken.findOne({ where: { id: tokenId } });
    if (!dbToken) throw new UnauthorizedError("Invalid refresh token");

    if (dbToken.expiresAt < new Date()) throw new UnauthorizedError("Refresh token expired");

    return dbToken;
}

