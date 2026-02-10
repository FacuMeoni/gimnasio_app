import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errorTemplates.js";
import { JWT_SECRET } from "./envProvider.js";


export const signAccessToken = ({ userId, role, gymId }) => {
    return jwt.sign(
        { 
            userId: userId, 
            role: role
        },
        JWT_SECRET,
        { expiresIn: "10m" }
    );
};

export const signRefreshToken = ({ userId, tokenId }) => {
    return jwt.sign(
        { userId: userId, tokenId: tokenId },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
}; 

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET, (err, data) => {
        if (err) throw new UnauthorizedError("Not authorized, invalid token")
        return data;
    });
}

