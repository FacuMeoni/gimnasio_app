import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errorTemplates.js";

export const authenticateUser = async (req, res, next) => {
    
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) throw new UnauthorizedError("Not authorized, token is required");
    
    const { id } = jwt.verify(token, JWT_SECRET);

    const currentUser = await User.findByPk(id);
    if (!currentUser) throw new UnauthorizedError("User no longer exists");

    req.user = currentUser;
    next();
}

export const checkUserRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) throw new ForbiddenError("You are not authorized to access this resource");
        next();
    }
}