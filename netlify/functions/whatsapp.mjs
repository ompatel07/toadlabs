import { clientIp, fail, rateLimited } from "./_shared.mjs";

/**
 * Opens a WhatsApp chat without putting the number in the page.
 *
 * THE PROBLEM THIS SOLVES
 * A wa.me link carries the number in its own href. Removing the number from
 * the visible text while linking to wa.me/<number> changes nothing a scraper
 * cares about — it reads the markup, not the rendering. So the button points
 * here, and this redirects. The number lives in a Netlify environment variable
 * and never reaches the browser until somebody actually clicks.
 *
 * That is not secrecy, and it is not meant to be: anyone who clicks sees it,
 * as they must in order to message. It removes the number from the static
 * HTML of every page, which is where automated harvesting happens.
 */

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return fail(405, "whatsapp: wrong method", "Method not allowed.");
  }

  const ip = clientIp(event);
  if (await rateLimited(`wa:${ip}`, { limit: 30, windowMs: 10 * 60 * 1000 })) {
    return fail(429, `whatsapp: rate limited ${ip}`, "Too many requests.");
  }

  const number = (process.env.WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
  if (!number) {
    return fail(500, "whatsapp: WHATSAPP_NUMBER is not set", "Chat is not configured yet.");
  }

  // The prefilled message is ours, chosen from a fixed set. Nothing a visitor
  // sends is interpolated: a free-text parameter here would let anyone hand out
  // a link that opens a chat to us saying whatever they wrote.
  const PRESETS = {
    playbook: "Hi OFFSCRIPT, I have a question about The Client Playbook.",
    order: "Hi OFFSCRIPT, I need help with my Client Playbook order.",
    default: "Hi OFFSCRIPT, I'd like to talk about a project.",
  };
  const topic = String(event.queryStringParameters?.topic || "default");
  const text = PRESETS[topic] || PRESETS.default;

  return {
    statusCode: 302,
    headers: {
      Location: `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
      // Not cached anywhere: a cached 302 would park the number in a shared
      // proxy, which is the thing this exists to avoid.
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
    },
    body: "",
  };
};
