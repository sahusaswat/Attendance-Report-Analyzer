const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { SendVerificationEmail, SendForgotPaswordEmail } = require("../utils/sendEmail.js");
const User = require("../models/User.js");
const Organization = require("../models/Organization.js");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist && userExist.isVerified) {
            return res.status(400).json("User Already Exist");
        };
        const hashPassword = await bcrypt.hash(password, 10);
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        if (userExist && !userExist.isVerified) {

            userExist.name = name;
            userExist.password = hashPassword;
            userExist.VerificationCode = code;
            userExist.VerificationCodeExpires = Date.now() + 10 * 60 * 1000;
            userExist.verificationAttempts = 0;
            userExist.verificationBlockedUntil = undefined;

            await userExist.save();
            await SendVerificationEmail(email , code)
            return res.json({ message: "Verify Your Email!!" })
        } else {
            user = await User.create({
                name,
                email,
                password: hashPassword,
                VerificationCode: code,
                VerificationCodeExpires: Date.now() + 10 * 60 * 1000
            });
        }

        await SendVerificationEmail(email, code)

        res.status(201).json({ message: "Please verify your email" });

    } catch (error) {
        console.log(`There is an error : ${error}`);

        res.status(500).json({ message: error.message });

    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({
            email,
            VerificationCode: code,
            VerificationCodeExpires: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({ message: "User Not Found!" })
        };

        // check if blocked
        if (user.verificationBlockedUntil && user.verificationBlockedUntil > Date.now()) {
            return res.status(429).json({
                message: "Too many attempts. Please try again later."
            });
        }

        // check code
        if (
            user.VerificationCode !== code ||
            user.VerificationCodeExpires < Date.now()
        ) {

            user.verificationAttempts += 1;

            // block after 5 attempts
            if (user.verificationAttempts >= 5) {
                user.verificationBlockedUntil = Date.now() + 10 * 60 * 1000;
            }
            await user.save();
            return res.status(400).json({ message: "Invalid or Expired Code!" })
        }


        user.isVerified = true;
        user.VerificationCode = undefined;
        user.VerificationCodeExpires = undefined;
        user.verificationAttempts = 0;
        user.verificationBlockedUntil = undefined;

        await user.save();

        res.json({ message: "Email Verification Successful!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

exports.resendcode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.isVerified) {
            return res.status(400).json({ message: "User is already Verified" })
        };

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        user.VerificationCode = code;
        user.VerificationCodeExpires = Date.now() + 10 * 60 * 1000;
        user.verificationAttempts = 0;
        user.verificationBlockedUntil = undefined;

        await user.save();
        await SendVerificationEmail(email, code);

        res.status(200).json({ message: "Verification Code sent again!" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json("Account Not Found")
        };

        if (!user.isVerified) {
            return res.status(401).json({
                message: "Email is not Verified"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json("Invalid credentials!");
        };

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "Login Successful! :)", token });
    } catch (error) {
        console.log(`There is an error : ${error}`);
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.json({ user: null, orgId: null, role: null });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        const user = await User.findById(decoded.id).select("-password");
        const organization = await Organization.findById(decoded.orgId);
        console.log(user);
        console.log(organization);

        res.json({
            user,
            orgId: decoded.orgId || null,
            role: decoded.role || null,
            organization
        });

    } catch (error) {
        res.json({ user: null, orgId: null, role: null });
    }
};

exports.forgotpassword = async (req,res) => {
    try {
        const {email}= req.body
        const user = await User.findOne({email})

        if(!user) {
            return res.status(404).json({message: "User not found!"});
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({validateBeforeSave: false});

        const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

        await SendForgotPaswordEmail(user.email, resetURL)
        res.status(200).json({message: "Check your mail for reset link!"})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.resetpassword = async (req,res) => {
    try {
        const ResetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")


        const user = User.findOne({
            ResetPasswordToken,
            ResetPasswordTokenExpires: {
                $gt: Date.now()
            }
        });

        if(!user) {
            return res.status(404).jsom({message: "Invalid User or Token is Expired!"})
        };

        user.password = req.body.password;
        user.ResetPasswordToken = undefined;
        user.ResetPasswordTokenExpires = undefined;

        await user.save();

        res.status(200).json({message: "Password updated!"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}