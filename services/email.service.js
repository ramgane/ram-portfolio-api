import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { MailerSend, Sender, Recipient, EmailParams } from "mailersend";


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

export const sendEmailServicesFun = async (body) => {
  try {
    const { name, email, subject, message } = body;

    const mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY, // ⛔ don't hardcode
    });

    const sentFrom = new Sender(
      "info@test-r9084zvyywjgw63d.mlsender.net",
      "From Portfolio Contact Form"
    );

    const recipients = [
      new Recipient("guru4567varan@gmail.com", "Admin"),
    ];

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Contact Message</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f4f7fa;
      margin: 0;
      padding: 0;
      color: #4a5566;
    }
    .container {
      max-width: 640px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 6px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.05);
      padding: 40px;
    }
    h1 {
      color: #111;
      font-size: 24px;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background-color: #1d021d;
      color: #fff;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 12px;
      border: 1px solid #ddd;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>New Message Received</h1>

    <p>Hello Admin,</p>
    <p>You have received a new message from the contact form.</p>

    <table>
      <tr>
        <th>Name</th>
        <td>${name}</td>
      </tr>
      <tr>
        <th>Email</th>
        <td>${email}</td>
      </tr>
      <tr>
        <th>Subject</th>
        <td>${subject}</td>
      </tr>
      <tr>
        <th>Message</th>
        <td>${message}</td>
      </tr>
    </table>

    <div class="footer">
      © Ram Kumar N
    </div>
  </div>
</body>
</html>
`;

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(new Sender(email, name)) // reply goes to sender
      .setSubject(subject || "New Contact Message")
      .setHtml(htmlTemplate);

    await mailerSend.email.send(emailParams);

    return {
      status: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.log(error)
    console.error("Error sending email:", error);
    return {
      status: false,
      message: "Failed to send email",
      error,
    };
  }
};

