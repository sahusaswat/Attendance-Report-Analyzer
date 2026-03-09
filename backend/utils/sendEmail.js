const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth : {
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
}