import admin from "@/firebase/firebaseAdmin";
import { mailTransporter } from "@/lib/nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    // Generate Firebase reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: "https://animagine-app.vercel.app", // redirect after reset
    });

    // Send email with Gmail SMTP
 await mailTransporter.sendMail({
  from: `"Animagine" <${process.env.MAIL_USER}>`,
  to: email,
  subject: "Reset your Animagine password",
  html: `
  <div style="font-family: Arial, sans-serif; background-color:#f9fafb; padding:40px; color:#111827;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:#2563eb; padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:22px;">🔒 MyShop Password Reset</h1>
      </div>
      
      <!-- Body -->
      <div style="padding:30px;">
        <p style="font-size:16px; margin-bottom:20px;">Hi there,</p>
        <p style="font-size:16px; line-height:1.5; margin-bottom:25px;">
          We received a request to reset your password for your <strong>Animagine</strong> account.  
          Click the button below to create a new password:
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="${resetLink}" target="_blank" 
            style="display:inline-block; background:#2563eb; color:#ffffff; 
                   padding:14px 28px; font-size:16px; font-weight:bold;
                   border-radius:6px; text-decoration:none;">
            Reset Password
          </a>
        </div>

        <p style="font-size:14px; color:#6b7280;">
          If you didn’t request a password reset, you can safely ignore this email.  
          This link will expire in <strong>1 hour</strong> for security reasons.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background:#f3f4f6; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
        <p style="margin:0;">© ${new Date().getFullYear()} MyShop. All rights reserved.</p>
      </div>
    </div>
  </div>
  `,
});


    res.status(200).json({ message: "Reset link sent to email!" });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ error: "Failed to send reset email" });
  }
}
