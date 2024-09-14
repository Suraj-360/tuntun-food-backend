const mongoose = require('mongoose');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const getRandomGradient = require('../utils/gradientGenerator');

const fetchUserData = async (req, res) => {
    try {
        // userId got after token verification
        const { userId } = req.body;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // Convert user to plain object and remove password field
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj._id;

        // Create a unique seed using firstName and lastName
        const seed = `${user.firstName.trim()}${user.lastName.trim()}`;
        
        // Generate a random gradient
        const randomGradient = getRandomGradient();

        const svgurl = `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&backgroundColor=${encodeURIComponent(randomGradient)}`;

        userObj.profilePic = svgurl;

        return res.status(200).json({
            message: "User data fetched successfully!",
            user: userObj
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
            error: error.message
        });
    }
}

/* HTML: <div class="loader"></div> */


const userDataUpdate = async (req, res) => {
    try {
        const { street, city, state, postalCode, country, dob, gender, userId } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { street, city, state, postal: postalCode, country, dob, gender } },
            { new: true }  // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "Data updation failed!!"
            });
        }

        // Convert user to plain object and remove sensitive fields
        const updatedUserData = updatedUser.toObject();
        delete updatedUserData.password;
        delete updatedUserData._id;

        return res.status(200).json({
            message: "User data updated!!",
            user: updatedUserData
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
            error: error.message
        });
    }
};


const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword, userId } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New passwords do not match."
            });
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        // Verify old password
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({
                message: "Incorrect old password."
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await User.findByIdAndUpdate(userId, { $set: { password: hashedPassword } });

        return res.status(200).json({
            message: "Password updated successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
            error:error.message
        });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const { reason, userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required."
            });
        }

        // Find and delete the user
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Account deleted successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
            error:error.message
        });
    }
}

module.exports = { fetchUserData, userDataUpdate, changePassword, deleteAccount };
