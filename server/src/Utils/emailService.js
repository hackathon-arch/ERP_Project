import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailWithAttachment = async (to, subject, text, pdfBuffer) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: "receipt.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    console.log("Receipt email sent successfully.");
  } catch (error) {
    console.error("Error sending receipt email:", error);
  }
};
