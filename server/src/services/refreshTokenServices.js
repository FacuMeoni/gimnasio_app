import { RefreshToken } from "../models/index.js";
import { signRefreshToken, verifyToken } from "../utils/jwt.js";
import { BadRequestError, UnauthorizedError } from "../utils/errorTemplates.js";


const getOneRefreshToken = async({ userId, tokenId }) => {
    const refreshToken = await RefreshToken.findOne({ where: { userId, id: tokenId } });
    if(!refreshToken) throw new UnauthorizedError("Invalid refresh token");

    return refreshToken;
}

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

    const storedToken = await getOneRefreshToken({ userId, tokenId });
    if (storedToken.expiresAt < new Date()) throw new UnauthorizedError("Session expired or revoked");

    return storedToken;
}

const revokeRefreshToken = async({ userId, tokenId }) => await RefreshToken.destroy({ where: { id: tokenId, userId } });    

export default {
    createRefreshToken,
    validateRefreshToken,
    revokeRefreshToken,
};