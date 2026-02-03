import { UnauthorizedError, ForbiddenError } from "../utils/errorTemplates.js";
import { validateToken } from "../utils/jwt.js";
import { User } from "../models/index.js";
import { tryCatch } from "../utils/tryCatch.js";

export const authenticateUser = async (req, res, next) => {   
    
    const token = req.headers['authorization'].split(" ")[1];
    
    if(!token)throw new UnauthorizedError("Not authorized, token is required");
    
    const { userId } = validateToken(token);

    const currentUser = await User.findByPk(userId ,{ attributes: { exclude: ["password"] } });
    if (!currentUser) throw new UnauthorizedError("User no longer exists");

    req.user = currentUser;
    next();
};

export const checkUserRole = (...roles) => {
    return tryCatch(async (req, res, next) => {
        if (!roles.includes(req.user.role)) throw new ForbiddenError("You are not authorized to access this resource");
        next();
    });
}