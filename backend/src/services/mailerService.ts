import nodemailer, { Transporter } from "nodemailer";

interface PasswordResetEmailPayload {
  to: string;
  resetToken: string;
}

class MailerConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MailerConfigError";
  }
}

const buildResetLink = (email: string, token: string): string => {
  const appUrl = process.env.APP_URL || process.env.FRONTEND_URL;
  if (!appUrl) {
    throw new MailerConfigError("APP_URL or FRONTEND_URL must be configured for reset link generation");
  }

  const baseUrl = appUrl.replace(/\/$/, "");
  return `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
};

let cachedTransporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const smtpUrl = process.env.SMTP_URL;
  if (!smtpUrl) {
    throw new MailerConfigError("SMTP_URL is required to send password reset emails");
  }

  cachedTransporter = nodemailer.createTransport(smtpUrl);
  return cachedTransporter;
};

export const sendPasswordResetEmail = async ({ to, resetToken }: PasswordResetEmailPayload): Promise<void> => {
  const mailFrom = process.env.MAIL_FROM;
  if (!mailFrom) {
    throw new MailerConfigError("MAIL_FROM is required to send password reset emails");
  }

  const transporter = getTransporter();
  const resetLink = buildResetLink(to, resetToken);

  await transporter.sendMail({
    from: mailFrom,
    to,
    subject: "Saleh Zone password reset",
    text: `Reset your password using this link: ${resetLink}`,
    html: `
      <p>You requested a password reset for your Saleh Zone account.</p>
      <p>Use this link to reset your password:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `
  });
};

export { MailerConfigError };
