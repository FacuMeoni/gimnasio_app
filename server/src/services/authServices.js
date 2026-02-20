import { BadRequestError, UnauthorizedError } from "../utils/errorTemplates.js";
import { signAccessToken } from "../utils/jwt.js";
import refreshTokenServices from "./refreshTokenServices.js";
import bcrypt from "bcrypt";
import { RefreshToken, User } from "../models/index.js";

const createSession = async (data) => {

    const { email, password } = data;
    if(!email || !password) throw new BadRequestError("Email or password are missing");
    
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedError("Invalid credentials"); 

    const accessToken = signAccessToken({ userId: user.id, role: user.role, gymId: user.gymId });
    const refreshToken = await refreshTokenServices.createRefreshToken({ userId: user.id, ipAddress: data.ipAddress, userAgent: data.userAgent });
    
    return {
        accessToken,
        refreshToken,
        user: {
            fullName: user.fullName,
            id: user.id,
            email: user.email,
        },
    }
}

const createNewTokens = async (data) => {
    const storedToken = await refreshTokenServices.validateRefreshToken(data.rtoken);

    const user = await User.findByPk(storedToken.userId, { attributes: { exclude: ["password"] } });
    if (!user) throw new UnauthorizedError("Access denied");

    await RefreshToken.destroy({ where: { userId: storedToken.userId, ipAddress: data.ipAddress } });

    const accessToken = signAccessToken({ userId: user.id, role: user.role, gymId: user.gymId ?? null });
    const refreshToken = await refreshTokenServices.createRefreshToken({
        userId: user.id,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
    });

    return {
        accessToken,
        refreshToken,
        user: {
            fullName: user.fullName,
            id: user.id,
            email: user.email,
        },
    };
};

export default { 
    createSession,
    createNewTokens,
}