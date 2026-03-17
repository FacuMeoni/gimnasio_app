import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { BadRequestError, UnauthorizedError } from "../utils/errorTemplates.js";
import sessionServices from "./sessionServices.js";

const validateCredentials = async ({ email, password }) => {
    if (!email || !password) throw new BadRequestError("Credentials are missing.");

    const user = await User.findOne({ where: { email } });
    if (!user) throw new UnauthorizedError("Invalid credentials, email or password are incorrect.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials, email or password are incorrect.");

    return user;
};

const login = async ({ email, password, ipAddress, userAgent }) => {
    const user = await validateCredentials({ email, password });
    return sessionServices.createSession({ userId: user.id, ipAddress, userAgent });
};

export default {
    login,
};

