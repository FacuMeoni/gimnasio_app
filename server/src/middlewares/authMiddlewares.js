import { UnauthorizedError, ForbiddenError } from "../utils/errorTemplates.js";
import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/index.js";
import { tryCatch } from "../utils/tryCatch.js";

export const authenticate = async (req, res, next) => {   
    
    const token = req.headers['authorization'].split(" ")[1];

    if(!token)throw new UnauthorizedError("Not authorized, token is required");
    
    const { userId } = verifyToken(token);
    
    const currentUser = await User.findByPk(userId ,{ attributes: { exclude: ["password"] } });
    if (!currentUser) throw new UnauthorizedError("You are not authorized to access this resource");

    req.user = currentUser;
    next();
};

export const authorize = (...roles) => {
    return tryCatch(async (req, res, next) => {
        if (!roles.includes(req.user.role)) throw new ForbiddenError("You are not authorized to access this resource");
        next();
    });
}