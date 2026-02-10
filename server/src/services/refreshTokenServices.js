import { RefreshToken } from "../models/index.js";
import { signRefreshToken, verifyToken } from "../utils/jwt.js";
import { BadRequestError, UnauthorizedError } from "../utils/errorTemplates.js";

const createRefreshToken = async ({ userId, ipAddress, userAgent }) => {

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.destroy({ where: { userId, ipAddress } });

    const dbToken = await RefreshToken.create({
        userId,
        ipAddress,
        userAgent,
        expiresAt,
    });

    return signRefreshToken({ userId, tokenId: dbToken.id });
}

const validateRefreshToken = async (token) => {

    const { userId, tokenId } = verifyToken(token);

    const storedToken = await RefreshToken.findOne({ where: { id: tokenId, userId } });
    if (!storedToken) throw new UnauthorizedError("Access denied");

    if (storedToken.expiresAt < new Date()) throw new UnauthorizedError("Session expired or revoked");

    return storedToken;
}

const revokeRefreshToken = async({ userId, tokenId }) => {
    if(!userId || !tokenId) throw new BadRequestError("Data is missing");
    
    const dbToken = await RefreshToken.findOne({ where: { userId, id: tokenId } });
    if(!dbToken) throw new UnauthorizedError("Invalid refresh token");

    if(dbToken.expiresAt < new Date()) throw new UnauthorizedError("Refresh token expired");

    await RefreshToken.destroy({ where: { userId, id: tokenId } });

    return true;
}



export default {
    createRefreshToken,
    validateRefreshToken,
    revokeRefreshToken,
};