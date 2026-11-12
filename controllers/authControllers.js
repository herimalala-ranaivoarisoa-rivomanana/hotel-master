import User from '../models/user'
import { uploadImages, deleteImages, cleanupImages } from '../utils/cloudinary'

import ErrorHandler from '../utils/errorHandler'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import sendEmail from '../utils/sendEmail'

import absoluteUrl from 'next-absolute-url'
import crypto from 'crypto'

// Register user   =>   /api/auth/register
const registerUser = catchAsyncErrors(async (req, res) => {

    const avatar = req.body.avatar
        ? (await uploadImages([req.body.avatar], { folder: 'bookit/avatars', width: 150, crop: 'scale' }))[0]
        : { public_id: 'default_avatar', url: '/images/default_avatar.jpg' };

    const { name, email, password } = req.body;

    try {
        await User.create({ name, email, password, avatar });
    } catch (error) {
        await cleanupImages([avatar]);
        throw error;
    }

    res.status(200).json({
        success: true,
        message: 'Account Registered successfully'
    })

})

// Cuurent user profile   =>   /api/me
const currentUserProfile = catchAsyncErrors(async (req, res) => {

    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user
    })

})

// Update user profile   =>   /api/me/update
const updateProfile = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    if (!user) return next(new ErrorHandler('User not found', 404));

    if (user) {
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.body.password) user.password = req.body.password;
    }

    const previousAvatar = user.avatar;
    let avatar;
    if (req.body.avatar) {
        avatar = (await uploadImages([req.body.avatar], {
            folder: 'bookit/avatars', width: 150, crop: 'scale'
        }))[0];
        user.avatar = avatar;
    }
    try {
        await user.save();
    } catch (error) {
        if (avatar) await cleanupImages([avatar]);
        throw error;
    }
    if (avatar) await cleanupImages([previousAvatar]);

    res.status(200).json({
        success: true
    })

})


// Forgot password   =>   /api/password/forgot
const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    // Get origin
    const { origin } = absoluteUrl(req)

    // Create reset password url
    const resetUrl = `${origin}/password/reset/${resetToken}`

    const message = `Your password reset url is as follow: \n\n ${resetUrl} \n\n\ If you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'BookIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})

// Reset password   =>   /api/password/reset/:token
const resetPassword = catchAsyncErrors(async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.query.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup the new password
    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    })

})


// Get all users   =>   /api/admin/users
const allAdminUsers = catchAsyncErrors(async (req, res) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

})


// Get user details  =>   /api/admin/users/:id
const getUserDetails = catchAsyncErrors(async (req, res) => {

    const user = await User.findById(req.query.id);

    if (!user) {
        return next(new ErrorHandler('User not found with this ID.', 400))
    }

    res.status(200).json({
        success: true,
        user
    })

})


// Update user details  =>   /api/admin/users/:id
const updateUser = catchAsyncErrors(async (req, res) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.query.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })

})


// Delete user    =>   /api/admin/users/:id
const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.query.id);

    if (!user) {
        return next(new ErrorHandler('User not found with this ID.', 400))
    }

    // Remove avatar 
    const image_id = user.avatar.public_id;
    await deleteImages([{ public_id: image_id }])


    await user.remove();

    res.status(200).json({
        success: true,
        user
    })

})


export {
    registerUser,
    currentUserProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    allAdminUsers,
    getUserDetails,
    updateUser,
    deleteUser
}