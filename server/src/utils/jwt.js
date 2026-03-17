import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errorTemplates.js";
import { JWT_SECRET } from "./envProvider.js";


export const signAccessToken = ({ userId, role, gymId }) => {
    return jwt.sign(
        { 
            userId: userId, 
            role: role,
            gymId: gymId
        },
        JWT_SECRET,
        { expiresIn: "10m" }
    );
};

export const signRefreshToken = ({ userId, sessionId }) => {
    return jwt.sign(
        { userId: userId, sessionId: sessionId },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
}; 

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        throw new UnauthorizedError("Not authorized, invalid token");
    }
}