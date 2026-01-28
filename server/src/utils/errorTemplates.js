export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}