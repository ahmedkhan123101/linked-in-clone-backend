const httpStatus = require('http-status').default;

const errorHandler = (err, req, res, next) => {
    const rawStatusCode = err?.statusCode ?? err?.status;
    const parsedStatusCode = Number(rawStatusCode);

    const statusCode = Number.isInteger(parsedStatusCode) ? parsedStatusCode : 500;
    const message =
        err?.message || httpStatus?.[statusCode] || 'Internal Server Error';

    res.locals.errorMessage = err?.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV !== "production" && { stack: err?.stack }),
    };

    res.status(statusCode).send(response);
};

module.exports = { errorHandler };