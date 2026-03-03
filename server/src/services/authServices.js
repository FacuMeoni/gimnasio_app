import { BadRequestError, UnauthorizedError } from "../utils/errorTemplates.js";
import { signAccessToken } from "../utils/jwt.js";
import refreshTokenServices from "./refreshTokenServices.js";
import bcrypt from "bcrypt";
import userServices from "./userServices.js";


const checkUserCredentials = async({ email, password }) => {

    if(!email || !password) throw new BadRequestError("Email or password are missing");

    const user = await userServices.getOneUser({ email: email });
    if (!(await bcrypt.compare(password, user.password))) throw new UnauthorizedError("Invalid credentials"); 

    return user;
}

const createSession = async (data) => {

    const { email, password } = data;
    
    const user = await checkUserCredentials({ email, password });

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

    const user = await userServices.getOneUser({ id: storedToken.userId });

    await refreshTokenServices.revokeRefreshToken({ userId: user.id, tokenId: storedToken.id });

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