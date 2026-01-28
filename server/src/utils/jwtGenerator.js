import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "./envProvider.js";

export const signToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            role: user.role, 
            gymId: user.gymId || null 
        }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
    );
};