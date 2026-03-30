/**
 * @description Input Validation Middleware
 */

exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

exports.validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

exports.validateSignup = (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide name, email, and password'
        });
    }

    if (!exports.validateEmail(email)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide a valid email address'
        });
    }

    if (!exports.validatePassword(password)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Password must be at least 6 characters long'
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            status: 'fail',
            message: 'Passwords do not match'
        });
    }

    next();
};

exports.validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        });
    }

    if (!exports.validateEmail(email)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide a valid email address'
        });
    }

    next();
};
