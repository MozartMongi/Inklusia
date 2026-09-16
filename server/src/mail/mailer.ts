import nodemailer, { type Transporter } from "nodemailer";
import { isProduction, mailFromAddress, smtpUrl } from "../config/env.js";

export const mailDeliveryEnabled = smtpUrl.length > 0;

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!mailDeliveryEnabled) {
    return null;
  }
  transporter ??= nodemailer.createTransport(smtpUrl);
  return transporter;
}

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

/**
 * Mengirim email bila SMTP_URL disetel. Tanpa SMTP, isi email hanya
 * dicetak di log pengembangan — di production kegagalan dicatat sebagai
 * peringatan supaya operator tahu pengiriman belum aktif.
 */
export async function sendMail(message: MailMessage): Promise<boolean> {
  const transport = getTransporter();

  if (!transport) {
    if (isProduction) {
      console.warn(
        `[mail] SMTP_URL belum disetel, email "${message.subject}" tidak terkirim.`,
      );
    } else {
      console.info(
        `[mail] (dev, tanpa SMTP) untuk ${message.to} — ${message.subject}\n${message.text}`,
      );
    }
    return false;
  }

  try {
    await transport.sendMail({
      from: mailFromAddress,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return true;
  } catch (error) {
    // Kegagalan kirim tidak boleh membocorkan ada/tidaknya akun ke pemanggil.
    console.error("[mail] gagal mengirim email", error);
    return false;
  }
}
