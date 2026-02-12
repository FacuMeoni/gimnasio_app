import gymServices from "../../services/gymServices.js";
import sequelize from "../../config/database.js";
import { signAccessToken } from "../../utils/jwt.js";
import RefreshTokenServices from "../../services/refreshTokenServices.js";

const setupGymAndAdmin = async(req, res) => {
    const { gymData, adminData } = req.body;

    const { gym, owner } = await gymServices.createGymAndUser({ gymData, adminData }, sequelize.transaction());

    const accessToken = signAccessToken({ userId: owner.id, role: owner.role, gymId: gym.id || null });
    const refreshToken = await RefreshTokenServices.createRefreshToken({ userId: owner.id, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

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
            gym: {
                name: gym.name,
                slug: gym.slug,
                location: gym.location,
                paymentSettings: gym.paymentSettings,
                subscriptionStatus: gym.subscriptionStatus,
            },
            user: {
                fullName: owner.fullName,
                id: owner.id,
                email: owner.email,
            }, access_token: { accessToken }
        }, 
    });
}


const getGymBySlug = async(req, res) => {
   const { slug } = req.params;

   const gymDetails = await gymServices.getOneGym( { slug: slug });

   return res.status(200).json({
    status: "OK",
    data: {
        gym: {
            name: gymDetails.name,
            slug: gymDetails.slug,
            location: gymDetails.location,
            paymentSettings: gymDetails.paymentSettings,
            subscriptionStatus: gymDetails.subscriptionStatus,
        },
    },
   })
}


export default {
    setupGymAndAdmin,
    getGymBySlug
}