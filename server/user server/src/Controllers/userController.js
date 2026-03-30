
const User = require("../Model/userModel");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @desc   Get user profile
 * @route  GET /api/v1/users/profile/:id
 * @access Private
 */
exports.getUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

/**
 * @desc   Update user profile
 * @route  PUT /api/v1/users/profile/:id
 * @access Private
 */
exports.updateUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
            user
        }
    });
});

/**
 * @desc   Get user credits
 * @route  GET /api/v1/users/credits/:id
 * @access Private
 */
exports.getCredits = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id).select('credits email name');

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            credits: user.credits,
            email: user.email,
            name: user.name
        }
    });
});

/**
 * @desc   Buy/Add credits
 * @route  POST /api/v1/users/buy-credits/:id
 * @access Private
 */
exports.buyCredits = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide a valid credit amount'
        });
    }

    const user = await User.findByIdAndUpdate(
        id,
        { $inc: { credits: amount } },
        { new: true }
    ).select('credits email name');

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }

    res.status(200).json({
        status: 'success',
        message: `${amount} credits added successfully`,
        data: {
            credits: user.credits,
            email: user.email,
            name: user.name
        }
    });
});

/**
 * @desc   Get all users (admin only)
 * @route  GET /api/v1/users/all
 * @access Private
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');

    res.status(200).json({
        status: 'success',
        data: {
            users,
            total: users.length
        }
    });
});

/**
 * @desc   Delete user
 * @route  DELETE /api/v1/users/:id
 * @access Private
 */
exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'User not found'
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
    });
});
