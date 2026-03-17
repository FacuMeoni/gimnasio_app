import sessionServices from "../../services/sessionServices.js";
import authServices from "../../services/authServices.js";


const createSession = async (req, res) => {
     const { email, password } = req.body;

     const data = await authServices.login({ email, password, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

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
                accessToken: data.accessToken,
            },
        });
}
 
const refreshSession = async(req, res) => {
    const { rtoken } = req.cookies; 

    
    const data = await sessionServices.refreshSession({ rtoken, ipAddress: req.ip, userAgent: req.headers["user-agent"] });

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
            accessToken: data.accessToken,
        },
    });
}

const revokeSession = async (req, res) => {
    const rtoken = req.cookies.rtoken;
   
    await sessionServices.revokeSession({ rtoken });

    return res
        .clearCookie("rtoken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
        .status(200)
        .json({ status: "OK", message: "Session closed successfully" });
};

export default {
    createSession,
    refreshSession,
    revokeSession,
}