import authServices from "../../services/authServices.js";
import refreshTokenServices from "../../services/refreshTokenServices.js";


const createSession = async (req, res) => {
     const { email, password } = req.body;

     const data = await authServices.createSession({ email, password, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

     return res
        .cookie("rtoken", data.refreshToken, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "lax",
        })
        .status(200).json({
            status: "OK",
            data: {
                user: data.user,
                access_token: data.accessToken 
            },
        });
}
 
const createNewTokens = async(req, res) => {
    const { rtoken } = req.cookies; 
    
    const data = await authServices.createNewTokens({ rtoken, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

    return res
    .cookie("rtoken", data.refreshToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
     })
    .status(200).json({
        status: "OK",
        data: { 
            user: {
                fullName: data.user.fullName,
                id: data.user.id,
                email: data.user.email,
                role: data.user.role,
            },
            access_token: data.accessToken
        },
    });
}

const revokeSession = async (req, res) => {
    const rtoken = req.cookies.rtoken;
    const { userId, tokenId } = refreshTokenServices.validateRefreshToken(rtoken);
    if (rtoken) await refreshTokenServices.revokeRefreshToken({ userId, tokenId });

    return res
        .clearCookie("rtoken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
        .status(200)
        .json({ message: "Session closed successfully" });
};

export default {
    createSession,
    createNewTokens,
    revokeSession,
}