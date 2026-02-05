import { BadRequestError } from "../utils/errorTemplates.js";

export const validateSchema = (schema) => async (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.issues
            .map((err) => `${err.message} on ${err.path.join(".")}`)
            .join("; ");
        throw new BadRequestError(errorMessages);
    }

    req.body = result.data;
    next();
};  