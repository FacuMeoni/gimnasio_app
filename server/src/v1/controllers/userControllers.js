import userServices from "../../services/userServices.js";
import { signAccessToken } from "../../utils/jwt.js";
import RefreshTokenServices from "../../services/refreshTokenServices.js";

const createNewUser = async (req, res) => {
    const data = req.body;
    const user = await userServices.createUser(data);

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
            },
            accessToken,
        }, 
    });
}

const onBoardPartner = async (req, res) => {
    const { fullName, password, email, dni, birthDate, height, weightHistory, phone, observations, startDate, expirationDate, amount, planId } = req.body;
    const { gymId } = req.user;

    const result = await userServices.onBoardPartner({ userData: { fullName, password, email, dni, gymId, role: "partner", phone }, profileData: { birthDate, height, weightHistory, observations }, membershipData: { startDate, expirationDate, amount, planId, gymId: gymId } });

    return res.status(201).json({
        status: "OK",
        data: {
            user: {
                fullName: result.user.fullName,
                id: result.user.id,
                email: result.user.email,
                birthDate: result.profile.birthDate,
                height: result.profile.height,
                weightHistory: [...result.profile.weightHistory],
                phone: result.profile.phone,
                observations: result.profile.observations,
            },
            membership: {
                startDate: result.membership.startDate,
                expirationDate: result.membership.expirationDate,
                amount: result.membership.amount,  
                planId: result.membership.planId,
            },
        }, 
    });
}
 
const getAllPartnersByGym = async (req, res) => {
    const partners = await userServices.getAllPartnersDetail({ gymId: req.user.gymId });
    return res.status(200).json({ status: "OK", data: partners });
}


export default {
    createNewUser,
    onBoardPartner,
    getAllPartnersByGym,
}