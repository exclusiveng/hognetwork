/**
 * KEDGR Email Templates
 * Industrial dark-theme HTML emails matching the frontend UI.
 * Color palette:
 *   Background:   #0a0a0a (industrial-black)
 *   Surface:      #111111 (industrial-charcoal)
 *   Accent:       #00ffaa (industrial-crt / teal-green)
 *   Text:         #e5e5e5 (industrial-paper)
 *   Muted:        #6b7280 (industrial-subtle)
 *   Border:       rgba(0,255,170,0.15)
 */

const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@700;900&display=swap');
`;

function wrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Kedgr</title>
  <style>${BASE_STYLES}</style>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Space Mono',monospace,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="padding-bottom:0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#111111;border:1px solid rgba(0,255,170,0.2);border-bottom:none;padding:28px 36px;">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right:12px;">
                          <div style="width:32px;height:32px;border:1px solid rgba(0,255,170,0.4);display:flex;align-items:center;justify-content:center;">
                            <div style="width:16px;height:16px;background:#00ffaa;clip-path:polygon(50% 0%,100% 100%,0% 100%);margin:auto;"></div>
                          </div>
                        </td>
                        <td>
                          <span style="font-family:'Orbitron','Space Mono',monospace;font-size:18px;font-weight:900;color:#e5e5e5;letter-spacing:0.2em;text-transform:uppercase;">
                            KEDGR
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="font-family:'Space Mono',monospace;font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.2em;">
                      SYSTEM_NOTIFICATION
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT BLOCK -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#111111;border:1px solid rgba(0,255,170,0.2);border-top:3px solid #00ffaa;padding:36px;">
                <tr><td>${content}</td></tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding-top:0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#0d0d0d;border:1px solid rgba(0,255,170,0.1);border-top:none;padding:20px 36px;">
                <tr>
                  <td>
                    <p style="margin:0;font-family:'Space Mono',monospace;font-size:9px;color:#4b5563;text-transform:uppercase;letter-spacing:0.15em;line-height:1.8;">
                      © ${new Date().getFullYear()} KEDGR Systems · AI-Powered Code Intelligence Platform<br/>
                      This is an automated system message. Do not reply to this email.<br/>
                      <a href="${process.env.FRONTEND_URL || 'https://kedgr.xyz'}" style="color:#00ffaa;text-decoration:none;">
                        kedgr.xyz
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function label(text: string): string {
  return `<p style="margin:0 0 6px 0;font-family:'Space Mono',monospace;font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.2em;">${text}</p>`;
}

function divider(): string {
  return `<div style="height:1px;background:linear-gradient(90deg,rgba(0,255,170,0.3),transparent);margin:28px 0;"></div>`;
}

function crtButton(text: string, url: string): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
      <tr>
        <td style="background:#00ffaa;padding:0;">
          <a href="${url}" target="_blank"
            style="display:inline-block;padding:14px 32px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#0a0a0a;text-transform:uppercase;letter-spacing:0.25em;text-decoration:none;">
            ${text}
          </a>
        </td>
      </tr>
    </table>`;
}

function infoRow(key: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        ${label(key)}
        <p style="margin:0;font-family:'Space Mono',monospace;font-size:13px;color:#e5e5e5;">${value}</p>
      </td>
    </tr>`;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  1. WELCOME / REGISTRATION EMAIL                                            */
/* ─────────────────────────────────────────────────────────────────────────── */
export function welcomeEmail(opts: { name: string; email: string }): string {
  const frontendUrl = process.env.FRONTEND_URL || 'https://kedgr.xyz';
  const content = `
    <!-- Badge -->
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(0,255,170,0.3);background:rgba(0,255,170,0.06);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#00ffaa;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; UNIT_INITIALIZED
      </span>
    </div>

    <h1 style="margin:0 0 8px 0;font-family:'Orbitron','Space Mono',monospace;font-size:26px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;line-height:1.2;">
      Welcome to<br/><span style="color:#00ffaa;">Kedgr</span>
    </h1>
    <p style="margin:0 0 28px 0;font-family:'Space Mono',monospace;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;">
      Your AI-Powered Code Intelligence Platform
    </p>

    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.name}</span>, your unit has been successfully registered and is ready for deployment.
    </p>

    ${divider()}

    <!-- Features grid -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td width="48%" style="padding:16px;background:rgba(0,255,170,0.04);border:1px solid rgba(0,255,170,0.12);vertical-align:top;">
          <p style="margin:0 0 6px 0;font-size:14px;">🔍</p>
          <p style="margin:0 0 4px 0;font-family:'Orbitron',monospace;font-size:10px;font-weight:700;color:#00ffaa;text-transform:uppercase;letter-spacing:0.1em;">AI Analysis</p>
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#6b7280;line-height:1.6;">25 free AI code analyses per month to start</p>
        </td>
        <td width="4%"></td>
        <td width="48%" style="padding:16px;background:rgba(0,255,170,0.04);border:1px solid rgba(0,255,170,0.12);vertical-align:top;">
          <p style="margin:0 0 6px 0;font-size:14px;">⚡</p>
          <p style="margin:0 0 4px 0;font-family:'Orbitron',monospace;font-size:10px;font-weight:700;color:#00ffaa;text-transform:uppercase;letter-spacing:0.1em;">GitHub Integration</p>
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#6b7280;line-height:1.6;">Connect your repos for seamless PR analysis</p>
        </td>
      </tr>
    </table>

    ${divider()}
    ${label('Registered Email')}
    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:13px;color:#00ffaa;">${opts.email}</p>

    ${crtButton('&gt;_ LAUNCH_TERMINAL', frontendUrl + '/dashboard')}
  `;
  return wrapper(content);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  2. EMAIL VERIFICATION                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
export function emailVerificationEmail(opts: { name: string; verificationUrl: string }): string {
  const content = `
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(0,255,170,0.3);background:rgba(0,255,170,0.06);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#00ffaa;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; IDENTITY_VERIFICATION_REQUIRED
      </span>
    </div>

    <h1 style="margin:0 0 16px 0;font-family:'Orbitron','Space Mono',monospace;font-size:24px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;">
      Verify Your<br/><span style="color:#00ffaa;">Email Address</span>
    </h1>

    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.name}</span>,<br/>
      Before we can fully activate your unit, we need to verify your identity. Please confirm your email address by clicking the button below.
    </p>

    ${divider()}

    <p style="margin:0 0 8px 0;font-family:'Space Mono',monospace;font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:0.15em;">⚠ This link expires in 24 hours</p>

    ${crtButton('&gt;_ CONFIRM_IDENTITY', opts.verificationUrl)}

    ${divider()}
    <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#4b5563;line-height:1.8;">
      If you did not create a Kedgr account, you can safely ignore this message. No changes will be made to any account.
    </p>
  `;
  return wrapper(content);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  3. PASSWORD RESET EMAIL                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
export function passwordResetEmail(opts: { name: string; resetUrl: string }): string {
  const content = `
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(255,60,60,0.3);background:rgba(255,60,60,0.05);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#f87171;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; SECURITY_ALERT: CREDENTIAL_RESET
      </span>
    </div>

    <h1 style="margin:0 0 16px 0;font-family:'Orbitron','Space Mono',monospace;font-size:24px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;">
      Reset Your<br/><span style="color:#00ffaa;">Password</span>
    </h1>

    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.name}</span>,<br/>
      We received a request to reset the credentials for this Kedgr account. Click the button below to set a new password.
    </p>

    ${divider()}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:16px;background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.2);border-left:3px solid #f87171;">
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#f87171;text-transform:uppercase;letter-spacing:0.1em;">
            ⚠ This reset link expires in <strong>1 hour</strong>.<br/>
            If you did not request this, your account is still secure — no action is needed.
          </p>
        </td>
      </tr>
    </table>

    ${crtButton('&gt;_ RESET_CREDENTIALS', opts.resetUrl)}

    ${divider()}
    <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#4b5563;line-height:1.8;">
      For security, this link can only be used once. If you need assistance, contact our support team.
    </p>
  `;
  return wrapper(content);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  3b. PASSWORD CHANGE OTP EMAIL                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
export function passwordChangeOtpEmail(opts: { name: string; otp: string }): string {
  const content = `
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(0,255,170,0.3);background:rgba(0,255,170,0.06);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#00ffaa;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; SECURITY_VERIFICATION: OTP_REQUIRED
      </span>
    </div>

    <h1 style="margin:0 0 16px 0;font-family:'Orbitron','Space Mono',monospace;font-size:24px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;">
      Verify Your<br/><span style="color:#00ffaa;">Identity</span>
    </h1>

    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.name}</span>,<br/>
      We received a request to update the password for your Kedgr account. Use the authorization code below to verify this action.
    </p>

    ${divider()}

    <!-- OTP BOX -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td align="center" style="padding:40px;background:#0a0a0a;border:1px solid rgba(0,255,170,0.2);">
          <p style="margin:0 0 8px 0;font-family:'Space Mono',monospace;font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.2em;">Verification Code</p>
          <p style="margin:0;font-family:'Orbitron',monospace;font-size:36px;font-weight:900;color:#00ffaa;letter-spacing:0.4em;">${opts.otp}</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:16px;background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.2);border-left:3px solid #f87171;">
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#f87171;text-transform:uppercase;letter-spacing:0.1em;">
            ⚠ This code expires in <strong>15 minutes</strong>.<br/>
            If you did not request this, please change your password immediately or contact support.
          </p>
        </td>
      </tr>
    </table>

    ${divider()}
    <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#4b5563;line-height:1.8;">
      This is an automated security notification. For your protection, do not share this code with anyone.
    </p>
  `;
  return wrapper(content);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  4. SUBSCRIPTION ACTIVATED EMAIL                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
export function subscriptionActivatedEmail(opts: {
  name: string;
  planName: string;
  planTier: string;
  billingPeriod: string;
  currency: string;
  amount: number;
  renewalDate: Date;
  transactionId: string;
}): string {
  const frontendUrl = process.env.FRONTEND_URL || 'https://kedgr.xyz';
  const currencySymbol = opts.currency === 'USD' ? '$' : '₦';
  const formattedAmount = `${currencySymbol}${opts.amount.toLocaleString()}`;
  const formattedDate = new Date(opts.renewalDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const planCredits: Record<string, string> = {
    free: '25', pro: '500', team: '500', enterprise: '2,000',
  };

  const content = `
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(0,255,170,0.3);background:rgba(0,255,170,0.06);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#00ffaa;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; SUBSCRIPTION_ACTIVATED
      </span>
    </div>

    <h1 style="margin:0 0 8px 0;font-family:'Orbitron','Space Mono',monospace;font-size:26px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;line-height:1.2;">
      Plan Activated<br/>
      <span style="color:#00ffaa;">${opts.planName}</span>
    </h1>
    <p style="margin:0 0 28px 0;font-family:'Space Mono',monospace;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;">
      Your capabilities have been upgraded successfully
    </p>

    <p style="margin:0 0 28px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.name}</span>, your <strong style="color:#00ffaa;">${opts.planName}</strong> subscription is now live. Your AI executions and advanced features are ready to deploy.
    </p>

    ${divider()}

    <!-- Receipt Table -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      ${infoRow('Plan', `${opts.planName} (${opts.planTier.toUpperCase()})`)}
      ${infoRow('Billing Cycle', opts.billingPeriod.charAt(0).toUpperCase() + opts.billingPeriod.slice(1))}
      ${infoRow('Amount Charged', formattedAmount)}
      ${infoRow('Currency', opts.currency)}
      ${infoRow('Next Renewal', formattedDate)}
      ${infoRow('Transaction Reference', `<span style="color:#6b7280;font-size:11px;">${opts.transactionId}</span>`)}
      ${infoRow('AI Executions / Month', `<span style="color:#00ffaa;">${planCredits[opts.planTier] || '—'}</span>`)}
    </table>

    ${divider()}

    <!-- Feature highlights -->
    <p style="margin:0 0 16px 0;font-family:'Space Mono',monospace;font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.2em;">Unlocked Capabilities</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;background:rgba(0,255,170,0.03);border:1px solid rgba(0,255,170,0.12);padding:16px;">
      <tr>
        <td style="padding:8px 0;">
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:11px;color:#9ca3af;line-height:2.2;">
            <span style="color:#00ffaa;">✓</span> &nbsp;AI Code Analysis &amp; Feedback<br/>
            <span style="color:#00ffaa;">✓</span> &nbsp;GitHub Repository Integration<br/>
            <span style="color:#00ffaa;">✓</span> &nbsp;Community &amp; Custom Rulesets<br/>
            <span style="color:#00ffaa;">✓</span> &nbsp;Advanced Analytics Dashboard<br/>
            <span style="color:#00ffaa;">✓</span> &nbsp;Production API Access
          </p>
        </td>
      </tr>
    </table>

    ${crtButton('&gt;_ LAUNCH_DASHBOARD', frontendUrl + '/dashboard')}
  `;
  return wrapper(content);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  5. SUBSCRIPTION CANCELLED EMAIL                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
export function subscriptionCancelledEmail(opts: {
  name: string;
  planName: string;
  reason?: string;
}): string {
  const frontendUrl = process.env.FRONTEND_URL || 'https://kedgr.xyz';
  const content = `
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(255,160,0,0.3);background:rgba(255,160,0,0.05);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#fbbf24;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; SUBSCRIPTION_TERMINATED
      </span>
    </div>

    <h1 style="margin:0 0 16px 0;font-family:'Orbitron','Space Mono',monospace;font-size:24px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;">
      Subscription<br/><span style="color:#fbbf24;">Cancelled</span>
    </h1>

    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.name}</span>,<br/>
      Your <strong style="color:#fbbf24;">${opts.planName}</strong> subscription has been cancelled. You'll retain access to your current plan features until the end of your billing period.
    </p>

    ${divider()}

    ${opts.reason ? `
    ${label('Cancellation Reason')}
    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:12px;color:#9ca3af;padding:12px 16px;background:rgba(255,255,255,0.03);border-left:2px solid rgba(251,191,36,0.4);">
      ${opts.reason}
    </p>
    ` : ''}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:16px;background:rgba(0,255,170,0.04);border:1px solid rgba(0,255,170,0.12);">
          <p style="margin:0 0 8px 0;font-family:'Orbitron',monospace;font-size:10px;font-weight:700;color:#00ffaa;text-transform:uppercase;letter-spacing:0.1em;">Re-activate anytime</p>
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:11px;color:#6b7280;line-height:1.7;">
            You can re-subscribe at any time from your dashboard Pricing page. We'll pick up right where you left off.
          </p>
        </td>
      </tr>
    </table>

    ${crtButton('&gt;_ VIEW_PRICING', frontendUrl + '/pricing')}
  `;
  return wrapper(content);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  6. TEAM MEMBER INVITED EMAIL                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
export function teamInviteEmail(opts: {
  inviteeName: string;
  inviterName: string;
  companyName: string;
  tempPassword: string;
  email: string;
}): string {
  const frontendUrl = process.env.FRONTEND_URL || 'https://kedgr.xyz';
  const content = `
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(0,255,170,0.3);background:rgba(0,255,170,0.06);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#00ffaa;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; TEAM_ACCESS_GRANTED
      </span>
    </div>

    <h1 style="margin:0 0 8px 0;font-family:'Orbitron','Space Mono',monospace;font-size:24px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;line-height:1.2;">
      You've Been Added<br/>to <span style="color:#00ffaa;">${opts.companyName}</span>
    </h1>

    <p style="margin:0 0 28px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.inviteeName}</span>,<br/>
      <strong style="color:#e5e5e5;">${opts.inviterName}</strong> has added you to the <strong style="color:#00ffaa;">${opts.companyName}</strong> workspace on Kedgr. Your account credentials are below.
    </p>

    ${divider()}

    <!-- Credentials Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:24px;background:#0a0a0a;border:1px solid rgba(0,255,170,0.2);">
          <p style="margin:0 0 4px 0;font-family:'Space Mono',monospace;font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.2em;">Login Email</p>
          <p style="margin:0 0 20px 0;font-family:'Space Mono',monospace;font-size:14px;color:#00ffaa;">${opts.email}</p>
          <p style="margin:0 0 4px 0;font-family:'Space Mono',monospace;font-size:9px;color:#6b7280;text-transform:uppercase;letter-spacing:0.2em;">Temporary Password</p>
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:14px;color:#00ffaa;letter-spacing:0.1em;">${opts.tempPassword}</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:14px 16px;background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.2);border-left:3px solid #f87171;">
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#f87171;line-height:1.7;">
            ⚠ Please change your password immediately after your first login for security.
          </p>
        </td>
      </tr>
    </table>

    ${crtButton('&gt;_ ACCESS_WORKSPACE', frontendUrl + '/login')}
  `;
  return wrapper(content);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  7. ACCOUNT SUSPENDED EMAIL                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
export function accountSuspendedEmail(opts: { name: string; email: string }): string {
  const content = `
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(248,113,113,0.3);background:rgba(248,113,113,0.05);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#f87171;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; CRITICAL: UNIT_SUSPENDED
      </span>
    </div>

    <h1 style="margin:0 0 16px 0;font-family:'Orbitron','Space Mono',monospace;font-size:24px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;">
      Account<br/><span style="color:#f87171;">Suspended</span>
    </h1>

    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.name}</span>,<br/>
      Your Kedgr account <strong style="color:#f87171;">(${opts.email})</strong> has been suspended by a platform administrator. Access to all services has been temporarily restricted.
    </p>

    ${divider()}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:16px;background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.2);">
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:11px;color:#9ca3af;line-height:1.8;">
            If you believe this is an error or would like to appeal this decision, please contact our support team directly. Provide your registered email address and any relevant context.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#4b5563;line-height:1.8;">
      Contact: <a href="mailto:support@kedgr.xyz" style="color:#00ffaa;text-decoration:none;">support@kedgr.xyz</a>
    </p>
  `;
  return wrapper(content);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  8. PAYMENT FAILED EMAIL                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
export function paymentFailedEmail(opts: {
  name: string;
  planName: string;
  amount: number;
  currency: string;
}): string {
  const frontendUrl = process.env.FRONTEND_URL || 'https://kedgr.xyz';
  const currencySymbol = opts.currency === 'USD' ? '$' : '₦';
  const content = `
    <div style="display:inline-block;padding:4px 12px;border:1px solid rgba(248,113,113,0.3);background:rgba(248,113,113,0.05);margin-bottom:24px;">
      <span style="font-family:'Space Mono',monospace;font-size:9px;color:#f87171;text-transform:uppercase;letter-spacing:0.3em;">
        &gt; PAYMENT_FAILED
      </span>
    </div>

    <h1 style="margin:0 0 16px 0;font-family:'Orbitron','Space Mono',monospace;font-size:24px;font-weight:900;color:#e5e5e5;text-transform:uppercase;letter-spacing:-0.02em;">
      Payment<br/><span style="color:#f87171;">Unsuccessful</span>
    </h1>

    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:13px;color:#9ca3af;line-height:1.8;">
      Hi <span style="color:#e5e5e5;">${opts.name}</span>,<br/>
      We were unable to process your payment of <strong style="color:#f87171;">${currencySymbol}${opts.amount.toLocaleString()}</strong> for the <strong style="color:#e5e5e5;">${opts.planName}</strong> plan.
    </p>

    ${divider()}

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:16px;background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.2);border-left:3px solid #f87171;">
          <p style="margin:0 0 8px 0;font-family:'Space Mono',monospace;font-size:10px;color:#f87171;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Common reasons for failure:</p>
          <p style="margin:0;font-family:'Space Mono',monospace;font-size:10px;color:#9ca3af;line-height:1.9;">
            · Insufficient funds on card<br/>
            · Card declined by issuing bank<br/>
            · Incorrect billing details<br/>
            · Expired payment method
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px 0;font-family:'Space Mono',monospace;font-size:12px;color:#9ca3af;line-height:1.8;">
      Your current plan access remains unchanged. Please retry with a valid payment method.
    </p>

    ${crtButton('&gt;_ RETRY_PAYMENT', frontendUrl + '/pricing')}
  `;
  return wrapper(content);
}
