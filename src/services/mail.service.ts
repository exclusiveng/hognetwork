import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import { 
  welcomeEmail, 
  subscriptionActivatedEmail,
  subscriptionCancelledEmail,
  accountSuspendedEmail,
  teamInviteEmail,
  passwordResetEmail,
  passwordChangeOtpEmail,
  paymentFailedEmail
} from './email-templates';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Kedgr <no-reply@kedgr.xyz>';

class MailService {
  private async sendHtmlEmail(to: string, subject: string, html: string) {
    if (process.env.ENABLE_EMAILS !== 'true' || !process.env.RESEND_API_KEY) {
      console.log(`[Mail Mock] Discarding email to: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });

      if (error) {
        console.error('[Resend Error]', error);
      } else {
        console.log('[Resend Success] Email sent. ID:', data?.id);
      }
    } catch (e) {
      console.error('[Resend Exception]', e);
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const html = welcomeEmail({ name, email: to });
    await this.sendHtmlEmail(to, 'Welcome to Kedgr: Unit Initialized', html);
  }

  async sendSubscriptionActivatedEmail(
    to: string, 
    opts: {
      name: string;
      planName: string;
      planTier: string;
      billingPeriod: string;
      currency: string;
      amount: number;
      renewalDate: Date;
      transactionId: string;
    }
  ) {
    const html = subscriptionActivatedEmail(opts);
    await this.sendHtmlEmail(to, `Kedgr: Subscription Activated (${opts.planName})`, html);
  }

  async sendSubscriptionCancelledEmail(to: string, name: string, planName: string, reason?: string) {
    const html = subscriptionCancelledEmail({ name, planName, reason });
    await this.sendHtmlEmail(to, `Kedgr: Subscription Terminated`, html);
  }

  async sendAccountSuspendedEmail(to: string, name: string) {
    const html = accountSuspendedEmail({ name, email: to });
    await this.sendHtmlEmail(to, 'Kedgr: CRITICAL SYSTEM ALERT - Account Suspended', html);
  }

  async sendTeamInviteEmail(
    to: string, 
    opts: {
      inviteeName: string;
      inviterName: string;
      companyName: string;
      tempPassword: string;
    }
  ) {
    const html = teamInviteEmail({ ...opts, email: to });
    await this.sendHtmlEmail(to, `Kedgr: Workspace Access Granted - ${opts.companyName}`, html);
  }

  async sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
    const html = passwordResetEmail({ name, resetUrl });
    await this.sendHtmlEmail(to, 'Kedgr: Security Alert - Credential Reset', html);
  }

  async sendPasswordChangeOtpEmail(to: string, name: string, otp: string) {
    const html = passwordChangeOtpEmail({ name, otp });
    await this.sendHtmlEmail(to, 'Kedgr: Security Verification Required', html);
  }

  async sendPaymentFailedEmail(to: string, name: string, planName: string, amount: number, currency: string) {
    const html = paymentFailedEmail({ name, planName, amount, currency });
    await this.sendHtmlEmail(to, 'Kedgr: Payment Unsuccessful', html);
  }
}

export const mailService = new MailService();