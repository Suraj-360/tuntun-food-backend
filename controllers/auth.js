const User = require('../models/User');
const bcrypt = require('bcryptjs')
const saltRound = 10;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const tuntunLogo = process.env.tuntunLogo || "#";

// Set up Nodemailer (configure with your email service)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    },
});

const signup = async (req, res) => {
    try {
        const {
            firstName, lastName, email, street, city, state, postal, country,
            dob, gender, password, cpassword
        } = req.body;

        // Check if required fields are present
        if (!firstName || !lastName || !email || !password || !cpassword) {
            return res.status(400).json({
                message: "Please fill in all required fields",
            });
        }

        // Check if the email already exists
        const isAlreadyExist = await User.findOne({ email });

        if (isAlreadyExist) {
            // If the user exists but is not verified, resend the verification email
            if (!isAlreadyExist.isVerified) {
                const verificationToken = crypto.randomBytes(32).toString('hex');
                isAlreadyExist.verificationToken = verificationToken;
                await isAlreadyExist.save();

                const verificationLink1 = `${BASE_URL}/app/v1/verify-email?token=${verificationToken}&email=${email}`;
                // Resend verification email
                const mailOptions = {
                    from: 'donotreply@tuntunsfood.com',  // Use your verified sender email
                    to: email,
                    subject: 'Verify Your Email',
                    html: `
                        <html>
                        <head>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    color: #333;
                                    line-height: 1.6;
                                }
                                .container {
                                    width: 100%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    background-color: #f9f9f9;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                .header {
                                    text-align: center;
                                    padding: 20px;
                                    background-color: #007bff;
                                    color: #fff;
                                    border-radius: 8px 8px 0 0;
                                }
                                .header img {
                                    max-width: 150px;
                                }
                                .content {
                                    padding: 20px;
                                }
                                .content p {
                                    margin: 10px 0;
                                }
                                .button {
                                    display: inline-block;
                                    padding: 10px 20px;
                                    font-size: 16px;
                                    color: #fff;
                                    background-image: linear-gradient(to right, #D31027 0%, #EA384D 51%, #D31027 100%);
                                    text-decoration: none;
                                    border-radius: 5px;
                                }
                                .button:hover {
                                    background-color: #218838; /* Darker shade on hover */
                                    border-color: #1e7e34;
                                }
                                .footer {
                                    text-align: center;
                                    padding: 10px;
                                    color: #777;
                                    font-size: 14px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <img src="${tuntunLogo}" alt="Tuntun's Food Logo" />
                                    <h1>Tuntun's Food</h1>
                                </div>
                                <div class="content">
                                    <h2>Hello ${firstName},</h2>
                                    <p>Thank you for signing up with Tuntun's Food! To complete your registration, please verify your email address by clicking the link below:</p>
                                    <a href="${verificationLink1}" style="color: #ffffff;" class="button">Verify Your Email</a>
                                    <p>If you did not create an account, please ignore this email.</p>
                                </div>
                                <div class="footer">
                                    <p>&copy; 2024 Tuntun's Food. All rights reserved.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                };


                await transporter.sendMail(mailOptions);

                return res.status(400).json({
                    message: "Email already registered but not verified. Verification email has been resent.",
                });
            }

            // If user exists and is verified
            return res.status(400).json({
                message: "User Already Exists",
            });
        }

        // Check if passwords match
        if (password !== cpassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        // Encrypt password using bcrypt
        const saltRounds = 10;
        const hashPass = await bcrypt.hash(password, saltRounds);

        // Generate a unique verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user with the verification token
        const userCreate = await User.create({
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            postal,
            country,
            dob,
            gender,
            password: hashPass,
            verificationToken,
            isVerified: false // Add this field to indicate email verification status
        });

        // Send verification email
        const verificationLink = `${BASE_URL}/app/v1/verify-email?token=${verificationToken}&email=${email}`;

        const mailOptions = {
            from: 'donotreply@tuntunsfood.com',  // Use your verified sender email
            to: email,
            subject: 'Verify Your Email',
            html: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            color: #333;
                            line-height: 1.6;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px;
                            background-color: #007bff;
                            color: #fff;
                            border-radius: 8px 8px 0 0;
                        }
                        .header img {
                            max-width: 150px;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content p {
                            margin: 10px 0;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #fff;
                            background-image: linear-gradient(to right, #D31027 0%, #EA384D 51%, #D31027 100%);
                            text-decoration: none;
                            border-radius: 5px;
                        }
                            
                        .button:hover {
                            background-color: #218838; /* Darker shade on hover */
                            border-color: #1e7e34;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px;
                            color: #777;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="${tuntunLogo}" alt="Tuntun's Food Logo" />
                            <h1>Tuntun's Food</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${firstName},</h2>
                            <p>Thank you for signing up with Tuntun's Food! To complete your registration, please verify your email address by clicking the link below:</p>
                            <a href="${verificationLink}" style="color: #ffffff;" class="button">Verify Your Email</a>
                            <p>If you did not create an account, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Tuntun's Food. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };


        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "User created successfully! Please check your email to verify your account.",
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


const verifyEmail = async (req, res) => {
    try {
        const { token, email } = req.query;
        const user = await User.findOne({ email, verificationToken: token });

        if (!user) {
            res.redirect(`${FRONTEND_URL}/verify-email-failure`);
        }

        // Mark the user as verified
        user.isVerified = true;
        user.verificationToken = undefined; // Remove the token
        await user.save();

        // Redirect to React route for email verification success
        res.redirect(`${FRONTEND_URL}/verify-email-success`);

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill data carefully" });
        }

        // Check if the user exists
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
            return res.status(400).json({ message: "Email not registered!" });
        }

        // Check if the user is verified
        if (!isUserExist.isVerified) {
            // Resend verification email if the user hasn't verified yet
            const verificationToken = generateVerificationToken();
            isUserExist.verificationToken = verificationToken;
            await isUserExist.save();
            sendVerificationEmail(email, verificationToken);

            return res.status(400).json({
                message: "Email not verified! A new verification email has been sent to your email.",
            });
        }

        // Verify the password
        const match = await bcrypt.compare(password, isUserExist.password);
        if (!match) {
            return res.status(400).json({ message: "Incorrect Password!" });
        }

        // Create token
        const payload = {
            id: isUserExist._id,
            email: isUserExist.email,
            firstName: isUserExist.firstName,
            lastName: isUserExist.lastName
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

        return res.status(200).json({
            message: "User login successfully!",
            token: token,
            expiresIn: "2h",
            userId: isUserExist._id,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};



module.exports = { signup, login, verifyEmail };
