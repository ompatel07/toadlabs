import { product } from "@/config/playbook";
import { siteConfig } from "@/config/site";

/**
 * Terms, refund and privacy copy for /playbook.
 *
 * A payment processor will read these before approving the account, and a
 * buyer will read the refund page before paying. Both are better served by
 * plain sentences than by legal boilerplate, so this says exactly what happens
 * and nothing it cannot honour. Every page names the seller and the price.
 *
 * There is no contact page by request. Support runs through WhatsApp, which is
 * named on each policy page — a refund policy with no way to reach the seller
 * is not a refund policy.
 */

export interface PolicySection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface Policy {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: PolicySection[];
}

const SELLER = siteConfig.name;
const CITY = siteConfig.location.full;
const PRICE = product.priceLabel;

export const terms: Policy = {
  slug: "terms",
  title: "Terms of use",
  metaTitle: "Terms of Use — The Client Playbook",
  metaDescription: `Terms of use for The Client Playbook, a ${PRICE} digital bundle sold by ${SELLER}, Ahmedabad: licence, permitted use, and the limits of what is sold.`,
  intro: `These terms cover The Client Playbook, a digital bundle sold by ${SELLER} (${CITY}) for ${PRICE}, one time. Buying it means you accept what is written here.`,
  sections: [
    {
      heading: "What you are buying",
      paragraphs: [
        `A one-time purchase of downloadable files: a playbook (PDF), a lead tracker (Excel and Google Sheets), an outreach swipe file, an AI prompt pack, a 30-day launch plan, a niche research pack, a scraper quick-start card, four paperwork templates, and five website templates as single HTML files.`,
        "Access does not expire, and updates to these files are included at no extra cost. Nothing here is a subscription and nothing renews.",
      ],
    },
    {
      heading: "Your licence",
      paragraphs: [
        "The files are licensed to one person — you. You may use them for your own freelance or agency work, including work you deliver to your own paying clients.",
      ],
      list: [
        "You may edit the website templates and deliver them to your clients",
        "You may adapt the scripts, prompts and paperwork for your own business",
        "You may not resell, republish or redistribute the files themselves",
        "You may not share your download link or upload the files anywhere public",
        "You may not present the bundle, in whole or in part, as your own product",
      ],
    },
    {
      heading: "The paperwork templates are not legal advice",
      paragraphs: [
        `The proposal, service agreement, NDA and GST invoice are starting points written for a common case. ${SELLER} is not a law firm and this is not legal or tax advice. Have a professional review anything you intend to rely on.`,
      ],
    },
    {
      heading: "What is not promised",
      paragraphs: [
        "This bundle teaches an outreach method and gives you the materials to run it. It does not promise clients, income or any particular result. What you get out of it depends on your work, your market and how consistently you use it.",
        "No income figure is claimed anywhere on this page or inside the files.",
      ],
    },
    {
      heading: "Third-party tools",
      paragraphs: [
        "The method refers to tools and platforms run by other companies — email providers, WhatsApp, LinkedIn, Instagram, AI models, and search. Their rules and prices are theirs, they can change at any time, and following this bundle does not exempt you from them. Use every channel within the rules of the platform and the law that applies to you.",
      ],
    },
    {
      heading: "Liability",
      paragraphs: [
        `To the extent the law allows, ${SELLER}'s liability for anything connected with this product is limited to the amount you paid for it, ${PRICE}.`,
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        `These terms are governed by the laws of India, with courts in ${CITY} having jurisdiction.`,
      ],
    },
  ],
};

export const refund: Policy = {
  slug: "refund",
  title: "Refund policy",
  metaTitle: "Refund Policy — The Client Playbook",
  metaDescription: `Refund policy for The Client Playbook (${PRICE}) from ${SELLER}: the 30-day money-back guarantee, and the delivery faults we refund outright.`,
  intro: `This is the refund policy for The Client Playbook, a ${PRICE} digital download sold by ${SELLER} (${CITY}). It is written plainly so there is nothing to discover after you pay. The guarantee on the sales page and this page say the same thing; if they ever differ, this page governs.`,
  sections: [
    {
      heading: "The short version",
      paragraphs: [
        "There are two ways to get your money back. The first is the 30-day guarantee: do the work, show us, and if it opened no doors you do not pay for it. The second is any failure on our side to deliver what you bought.",
        "Outside those, the purchase is final — the whole bundle downloads the moment payment is confirmed.",
      ],
    },
    {
      heading: "The 30-day money-back guarantee",
      paragraphs: [
        "Work the 30-day launch plan that comes with the bundle — build the list, send the messages, run the follow-ups — and log what you did in the included lead tracker. If you finish that month without a single client conversation worth having, we refund you in full.",
        "We ask for the tracker because the guarantee is about doing the work, not about downloading the files. We are not judging the quality of your outreach and we will not argue about individual rows: we are checking that the month actually happened.",
      ],
      list: [
        "Ask within 45 days of the payment date",
        "Send the tracker showing leads contacted and follow-ups sent across the 30 days",
        "One claim per buyer",
      ],
    },
    {
      heading: "We will also refund you if",
      paragraphs: [],
      list: [
        "You were charged more than once for the same order",
        "Payment was taken but the download never unlocked, and we cannot deliver the files to you",
        "The files are corrupt or unopenable and we cannot supply working replacements",
      ],
    },
    {
      heading: "We will not refund",
      paragraphs: [],
      list: [
        "Change of mind, where the 30 days were not worked and logged",
        "Buying by mistake after the files have been downloaded",
        "Not having had the time to use it",
        "A claim made more than 45 days after payment",
      ],
    },
    {
      heading: "What we do not promise",
      paragraphs: [
        "We do not guarantee that you will get clients, and you should be wary of anyone selling you something who does. Whether outreach works depends on your niche, the quality of your work, your pricing and whether you actually send the messages every day — none of which is within our control.",
        "What we guarantee is this refund. The bundle is a set of files and a method, not an income promise, and nothing on this site should be read as one.",
      ],
    },
    {
      heading: "How to ask",
      paragraphs: [
        `Message us on WhatsApp at ${siteConfig.phoneDisplay} with your order id, and the tracker if you are claiming on the guarantee. We reply to every message about a payment.`,
        "Approved refunds go back to the original payment method through Razorpay, usually within 5 to 7 working days, depending on your bank.",
      ],
    },
    {
      heading: "Cancellations",
      paragraphs: [
        "There is nothing to cancel. This is a one-time purchase with no subscription and no recurring charge.",
      ],
    },
  ],
};

export const privacy: Policy = {
  slug: "privacy",
  title: "Privacy policy",
  metaTitle: "Privacy Policy — The Client Playbook",
  metaDescription: `What ${SELLER} collects when you buy The Client Playbook (${PRICE}): your email for delivery, and the payment details handled entirely by Razorpay.`,
  intro: `This covers the information ${SELLER} (${CITY}) handles when you buy The Client Playbook for ${PRICE}.`,
  sections: [
    {
      heading: "What we collect",
      paragraphs: [
        "Only what a purchase needs:",
      ],
      list: [
        "Your email address, so the order can be confirmed and the download sent",
        "Your name, if you enter one at checkout",
        "The order id, amount and payment status returned by Razorpay",
      ],
    },
    {
      heading: "What we never see",
      paragraphs: [
        "Your card number, UPI PIN, CVV, netbanking password or any other payment credential. The payment happens inside Razorpay's own checkout. Those details go to Razorpay and its banking partners, never to this website.",
      ],
    },
    {
      heading: "How it is used",
      paragraphs: [
        "To confirm your payment, give you the download, answer you if you message us about the order, and keep the records a business is required to keep. We do not sell your data, we do not share it for advertising, and we do not add you to a marketing list you did not ask for.",
      ],
    },
    {
      heading: "Who else processes it",
      paragraphs: [
        "Razorpay Software Private Limited processes the payment and holds the payment record under its own privacy policy. This site is hosted on Netlify, which logs requests as any web host does. Nobody else receives your information.",
      ],
    },
    {
      heading: "How long it is kept",
      paragraphs: [
        "Order records are kept as long as tax and accounting rules require. You can ask us to delete anything held beyond that.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        `Message us on WhatsApp at ${siteConfig.phoneDisplay} to see what is held about your order, correct it, or ask for deletion.`,
      ],
    },
    {
      heading: "Cookies",
      paragraphs: [
        "This page sets no advertising or analytics cookies. Razorpay's checkout sets what it needs to process the payment securely.",
      ],
    },
  ],
};

export const policies: Policy[] = [terms, refund, privacy];
