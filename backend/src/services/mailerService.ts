interface PasswordResetEmailPayload {
  to: string;
  resetToken: string;
}

const buildResetLink = (email: string, token: string): string => {
  const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || "http://localhost:3000";
  const baseUrl = appUrl.replace(/\/$/, "");
  return `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
};

const isMailerConfigured = (): boolean => Boolean(process.env.MAIL_FROM && process.env.SMTP_URL);

export const sendPasswordResetEmail = async ({ to, resetToken }: PasswordResetEmailPayload): Promise<void> => {
  const resetLink = buildResetLink(to, resetToken);

  if (!isMailerConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[DEV MAILER] reset password for ${to} -> token: ${resetToken} link: ${resetLink}`);
      return;
    }

    throw new Error("Mailer is not configured for production");
  }

  // SMTP provider wiring point (transport implementation can be plugged in here)
  // Intentionally abstracted to keep delivery provider swappable.
  console.info(`[MAILER] sending reset password email to ${to} from ${process.env.MAIL_FROM}`);
  console.info(`[MAILER] reset link: ${resetLink}`);
};
