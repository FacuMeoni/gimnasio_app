import userServices from "../../services/userServices.js";
import { signAccessToken } from "../../utils/jwt.js";
import RefreshTokenServices from "../../services/refreshTokenServices.js";

const createNewUser = async (req, res) => {
    const data = req.body;
 
     const user = await userServices.createNewUser(data);
 
     const accessToken = signAccessToken({ userId: user.id, role: user.role, gymId: user.gymId || null });
     const refreshToken = await RefreshTokenServices.createRefreshToken({ userId: user.id, ipAddress: req.ip, userAgent: req.headers["user-agent"] });
 
     return res
     .cookie("rtoken", refreshToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
      })
     .status(201).json({
         status: "OK",
         data: {
             user: {
                fullName: user.fullName,
                id: user.id,
                email: user.email,
             }, access_token: { accessToken }
         }, 
     });
}
 

export default {
    createNewUser,
}