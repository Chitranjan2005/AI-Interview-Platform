import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendOtpEmail = async (toEmail, otp) => {
    await transporter.sendMail({
        from: `"AI Interview Prep" <${process.env.SMTP_EMAIL}>`,
        to: toEmail,
        subject: "Verify your email",
        html: `<p>Your verification code is:</p><h2>${otp}</h2><p>This code expires in 10 minutes.</p>`,
    });
};