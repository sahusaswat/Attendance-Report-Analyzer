const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.SendVerificationEmail = async (email, code) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification Code",
        html: `
       <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing:5px;">${code}</h1>
      <p>This code will expire in 10 minutes.</p>
      `
    });
};

exports.SendForgotPaswordEmail = async (email, resetURL) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Forgot Password",
        html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset.</p>
        <p>
        <a href="${resetURL}">
        Click here to reset your password
        </a>
        </p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not request this, ignore this email.</p>`
    })
}