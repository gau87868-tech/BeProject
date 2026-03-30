/**
 * @description Response Formatting Utility
 * Standardized response structure for all API endpoints
 */

exports.successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
    return res.status(statusCode).json({
        status: 'success',
        message,
        ...(data && { data })
    });
};

exports.errorResponse = (res, statusCode = 400, message = 'Error', errors = null) => {
    return res.status(statusCode).json({
        status: 'fail',
        message,
        ...(errors && { errors })
    });
};
