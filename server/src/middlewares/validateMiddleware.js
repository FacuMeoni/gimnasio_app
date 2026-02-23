import { BadRequestError } from "../utils/errorTemplates.js";

export const validateSchema = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.issues
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(" | ");
        throw new BadRequestError(errorMessages);
    }

    req.body = result.data;
    next();
};

export const validatePartialSchema = (schema) => (req, res, next) => {
    const result = schema.partial().safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.issues
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(" | ");
        throw new BadRequestError(errorMessages);
    }

    req.body = result.data;
    next();
};