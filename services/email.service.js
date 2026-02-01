import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmailService = async (to, subject, text) => {
  try {
    // 🔍 ENV DEBUG LOGS (VERY IMPORTANT FOR RENDER)
    console.log("📨 SMTP_HOST:", process.env.SMTP_HOST);
    console.log("📨 SMTP_PORT:", process.env.SMTP_PORT);
    console.log("📨 SMTP_USER:", process.env.SMTP_USER);
    console.log("📨 SMTP_PASS EXISTS:", !!process.env.SMTP_PASS);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // MUST be number
      secure: false, // false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    console.log("✅ Transporter created");

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // receive emails yourself
      subject,
      text,
    };

    console.log("📤 Sending email...");

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");
    console.log("📧 Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Email sending failed");
    console.error(error.message);
    throw error;
  }
};
