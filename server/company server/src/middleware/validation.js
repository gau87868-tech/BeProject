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

exports.validateOrgSignup = (req, res, next) => {
    const { companyName, companyEmail, password, confirmPassword } = req.body;

    if (!companyName || !companyEmail || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide company name, email, and password'
        });
    }

    if (!exports.validateEmail(companyEmail)) {
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

exports.validateOrgLogin = (req, res, next) => {
    const { companyEmail, password } = req.body;

    if (!companyEmail || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        });
    }

    if (!exports.validateEmail(companyEmail)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide a valid email address'
        });
    }

    next();
};
