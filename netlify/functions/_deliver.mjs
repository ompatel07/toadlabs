import { Resend } from "resend";
import { DOWNLOAD_TTL_MS, signDownloadToken } from "./_shared.mjs";
import { updateOrder } from "./_orders-db.mjs";

/**
 * Sends a buyer their download link.
 *
 * WHY THE LINK IN THE EMAIL IS NOT THE FILE
 * The email carries a signed, expiring link to our own download function, not
 * the bundle and not the private storage URL. An email is forwarded, archived
 * and read on devices we know nothing about; a link that expires and is bound
 * to one order limits what a forwarded copy is worth. The function still
 * re-checks that the order is paid every time it is opened.
 *
 * WHY FAILURE IS RECORDED RATHER THAN THROWN
 * The webhook calls this. If sending fails, the payment is still real and the
 * order is still paid — the buyer needs a retry, not a 500 that makes Razorpay
 * redeliver the whole event. So this records what happened and returns.
 */

const FROM_FALLBACK = "OFFSCRIPT <onboarding@resend.dev>";

export const mailConfigured = () => Boolean(process.env.RESEND_API_KEY);

/** Absolute, because an email client has no origin to resolve against. */
function downloadUrl(orderId, secret) {
  const base = (process.env.SITE_URL || "").replace(/\/+$/, "");
  const expiresAt = Date.now() + DOWNLOAD_TTL_MS;
  const token = signDownloadToken(orderId, expiresAt, secret);
  const query = `order_id=${encodeURIComponent(orderId)}&t=${token}`;
  return `${base}/.netlify/functions/download?${query}`;
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function body(orderId, link, hours) {
  const support = process.env.SUPPORT_EMAIL || "";
  return {
    subject: "Your Client Playbook download",
    text: [
      "Your payment is confirmed. Here is everything you bought:",
      "",
      link,
      "",
      `That link is tied to your order and works for ${hours} hours. If it expires, reply to this email and we will send a fresh one — you do not pay again.`,
      "",
      "Inside: the 87-page playbook, the lead tracker, 75 outreach scripts, 37 AI prompts, the 30-day launch plan, 12 researched niches, the scraping quick-start, four paperwork templates and five ready-made websites.",
      "",
      "Start with the 30-day plan. It tells you what to do on day one so you do not have to decide.",
      "",
      `Order: ${orderId}`,
      support ? `Questions: ${support}` : "",
      "",
      "— OFFSCRIPT",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#fbf7ef;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#16130e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px" cellpadding="0" cellspacing="0">
<tr><td style="padding-bottom:20px;font:700 13px/1.4 ui-monospace,monospace;letter-spacing:.08em;color:#bf3200">OFFSCRIPT</td></tr>
<tr><td style="font:800 28px/1.15 inherit;letter-spacing:-.02em;padding-bottom:14px">Payment confirmed. Here is your bundle.</td></tr>
<tr><td style="font:400 16px/1.55 inherit;color:#5a5347;padding-bottom:22px">The 87-page playbook, the lead tracker, 75 scripts, 37 prompts, the 30-day plan, 12 niches, the scraping card, four paperwork templates and five ready-made websites.</td></tr>
<tr><td style="padding-bottom:18px">
  <a href="${esc(link)}" style="display:inline-block;background:#ff5a1f;color:#16130e;border:2px solid #16130e;padding:14px 26px;font:700 16px/1 inherit;text-decoration:none">Download the bundle</a>
</td></tr>
<tr><td style="font:400 13px/1.55 inherit;color:#5a5347;padding-bottom:22px">
  This link is tied to your order and works for ${hours} hours. If it expires, reply to this email and we will send a fresh one &mdash; you do not pay again.
</td></tr>
<tr><td style="border-top:2px solid #16130e;padding-top:16px;font:400 13px/1.55 inherit;color:#5a5347">
  Start with the 30-day plan &mdash; it tells you what to do on day one.<br>
  Order ${esc(orderId)}${support ? ` &middot; Questions: <a href="mailto:${esc(support)}" style="color:#bf3200">${esc(support)}</a>` : ""}
</td></tr>
</table></td></tr></table></body></html>`,
  };
}

/**
 * @returns {Promise<{status: "sent"|"failed"|"skipped", error?: string}>}
 */
export async function deliverDownload({ orderId, email, secret }) {
  if (!email) {
    await updateOrder(orderId, { email_status: "skipped", email_error: "no address on the payment" });
    return { status: "skipped", error: "no address on the payment" };
  }
  if (!mailConfigured()) {
    await updateOrder(orderId, { email_status: "skipped", email_error: "RESEND_API_KEY not set" });
    return { status: "skipped", error: "RESEND_API_KEY not set" };
  }
  if (!process.env.SITE_URL) {
    // A relative link in an email goes nowhere. Better to record that and let
    // the retry pick it up once the variable is set than to send a dead link.
    await updateOrder(orderId, { email_status: "failed", email_error: "SITE_URL not set" });
    return { status: "failed", error: "SITE_URL not set" };
  }

  const hours = Math.round(DOWNLOAD_TTL_MS / 3_600_000);
  const message = body(orderId, downloadUrl(orderId, secret), hours);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM || FROM_FALLBACK,
      to: [email],
      replyTo: process.env.SUPPORT_EMAIL || undefined,
      ...message,
    });
    if (error) {
      console.error(`deliver: ${orderId} send failed`, error.message);
      await updateOrder(orderId, { email_status: "failed", email_error: error.message });
      return { status: "failed", error: error.message };
    }
    await updateOrder(orderId, {
      email_status: "sent",
      email_error: null,
      email_sent_at: new Date().toISOString(),
    });
    console.log(`deliver: ${orderId} sent`);
    return { status: "sent" };
  } catch (error) {
    console.error(`deliver: ${orderId} threw`, error);
    await updateOrder(orderId, { email_status: "failed", email_error: String(error).slice(0, 300) });
    return { status: "failed", error: String(error) };
  }
}
