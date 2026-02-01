import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmailService = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // send to **your email** to receive all messages
    subject: subject,
    text: text,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
