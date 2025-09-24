import admin from "@/firebase/firebaseAdmin";
import { mailTransporter } from "@/lib/nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    // Generate Firebase reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: "http://localhost:3000/login", // redirect after reset
    });

    // Send email with Gmail SMTP
    await mailTransporter.sendMail({
      from: `"MyShop Support" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Reset your MyShop password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" 
           style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
          Reset Password
        </a>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    res.status(200).json({ message: "Reset link sent to email!" });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ error: "Failed to send reset email" });
  }
}
