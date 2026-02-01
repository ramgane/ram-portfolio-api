import { sendEmailService, sendEmailServicesFun } from "../services/email.service.js";

export const sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    // Compose email text
    const emailText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    const info = await sendEmailServicesFun(req.body);

    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};
