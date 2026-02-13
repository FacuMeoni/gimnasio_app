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

const createPartnerWithProfile = async (req, res) => {
    const { fullName, password, email, dni, birthDate, height, weight_history, phone, observations } = req.body;
    const { gymId } = req.user;

    const result = await userServices.createPartnerWithProfile({ userData: { fullName, password, email, dni, gymId, role: "partner" }, profileData: { birth_date: new Date(birthDate), height, weight_history, phone, observations } });

    return res.status(201).json({
        status: "OK",
        data: {
            user: {
            fullName: result.fullName,
            id: result.id,
            email: result.email,
        }
        }, 
    });
}
 
const getAllPartnersByGym = async (req, res) => {
    const users = await userServices.getAllUsersByGym(req.user.gymId, "partner");
    
    return res.status(200).json({
        status: "OK",
        data: {
            users: users,
        },
    });
}

export default {
    createNewUser,
    createPartnerWithProfile,
    getAllPartnersByGym,
}