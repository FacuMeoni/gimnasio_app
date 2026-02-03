import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errorTemplates.js";
import { RefreshToken } from "../models/index.js";

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    handler: async(req, res, next) => {
       const { rtoken } = req.cookies;
       if(!rtoken)  throw new UnauthorizedError("Invalid refresh token");

        const decoded = jwt.decode(rtoken);
        if(decoded && decoded.tokenId) {
         await RefreshToken.destroy({ where: { id: decoded.tokenId } });
       }

       return res.status(429).json({ message: "Too many requests, please try again later" });
    }
});