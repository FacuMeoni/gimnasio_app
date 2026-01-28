import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errorTemplates.js";

export const protect = async (req, res, next) => {
    let token;

    if(req.cookies.token) { 
        token = req.cookies.token; 
    }
    else if(req.headers.authorization?.startsWith("Bearer ")) { 
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw new UnauthorizedError("Not authorized, token is required");
    
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) throw new UnauthorizedError("Not authorized, invalid token");

    req.user = decoded;
    next();
}

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) throw new ForbiddenError("You are not authorized to access this resource");
        next();
    }
}