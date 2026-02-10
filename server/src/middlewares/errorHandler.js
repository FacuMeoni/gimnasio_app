import { AppError } from "../utils/errorTemplates.js";

export const errorHandler = (err, req, res, next) => {

    console.error(`[ERROR] ${req.method} ${req.url}`);
    
    if (err instanceof AppError) {
        console.error(`Message: ${err.message}`);

        return res.status(err.statusCode).json({
            status: "FAILED",
            success: false,
            type: err.name,
            message: err.message,
        });

        
    }
    
    console.error("Stack Trace:", err.stack);

    return res.status(500).json({
        status: "FAILED",
        message: "Something went wrong while processing your request",
        type: "Internal server Error",
        success: false,
    });
};