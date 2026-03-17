import { UnauthorizedError } from "../../src/utils/errorTemplates.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../../src/utils/jwt.js";
import { userService } from "./userServices.js";
import { Session } from "../../src/models/index.js";

const createSession = async ({ userId, ipAddress, userAgent }) => {

    const user = await userService.getUserById({ id: userId });

    await Session.destroy({ where: { userId: user.id, ipAddress: ipAddress, userAgent: userAgent }});
    
    const newSession = await Session.create({ userId: user.id, ipAddress: ipAddress, userAgent: userAgent, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
    const accessToken = signAccessToken({ userId: user.id, role: user.role, gymId: user.gymId });
    const refreshToken = signRefreshToken({ userId: user.id, sessionId: newSession.id });
    
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
    }
}

const verifySession = async({ userId, sessionId }) => {

    const session = await Session.findOne({ where: { userId: userId, id: sessionId }});
    if(!session)throw new UnauthorizedError("Session does not exist");

    if(new Date(session.expiresAt) < new Date()) {
        await session.destroy();
        throw new UnauthorizedError("Session has expired");
    }
    
    if(session.userId !== userId)throw new UnauthorizedError("Session does not belong to the user");

    return session;
}

const refreshSession = async ({ rtoken, ipAddress, userAgent}) => {

    const { userId, sessionId } = verifyToken(rtoken);

    const user = await userService.getUserById({ id: userId }).catch(() => {
        throw new UnauthorizedError("Invalid refresh token");
    });
    const session = await verifySession({ userId, sessionId });
    if(session) await session.destroy();

    const newSession = await Session.create({ userId: user.id, ipAddress: ipAddress, userAgent: userAgent, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
    const accessToken = signAccessToken({ userId: user.id, role: user.role, gymId: user.gymId });
    const refreshToken = signRefreshToken({ userId: user.id, sessionId: newSession.id });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
    };
};

const revokeSession = async({ rtoken }) => {
    if(!rtoken)return true;

    const { userId, sessionId } = verifyToken(rtoken);
    const session = await verifySession({ userId, sessionId });
    if(session)await session.destroy();

    return true;
}

export default {
    createSession,
    refreshSession,
    revokeSession,
}