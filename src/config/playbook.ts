/**
 * /playbook — every word of the sales page, typed.
 *
 * RULES THIS FILE FOLLOWS
 *  - No income claims, no guarantees, no "earn X in Y days". Not because it is
 *    cautious: it is untrue, it gets ads rejected, and it invites chargebacks.
 *  - No countdowns, no fake scarcity, no struck-through prices.
 *  - Every number here describes the product itself (pages, scripts, prompts,
 *    niches, sites). Nothing is a claim about results, and no outside statistic
 *    appears without its source in the copy.
 *  - The reply screenshots are evidence that the outreach gets answered. They
 *    are labelled as exactly that, never as earnings.
 *
 * Hinglish belongs in the headlines, where the buyer's own voice is; the body
 * stays plain English so nothing is ambiguous before a payment.
 */

export const product = {
  name: "The Client Playbook",
  /** One line, used in metadata and the checkout recap. */
  summary:
    "A 10-module playbook, a lead tracker, 75 outreach scripts, 37 AI prompts and 5 ready-made websites, for freelance web developers in India who can build but cannot find clients.",
  price: 1299,
  currency: "INR",
  priceLabel: "₹1,299",
  priceNote: "One-time. No subscription.",
  terms: ["Instant access", "Lifetime access", "Free updates"],
} as const;

export const hero = {
  eyebrow: "For freelance web developers in India",
  headline: "Coding seekh li. Client nahi mila?",
  sub: "The problem isn't your skill. It's your first message.",
  body: "You can build the site. You just have nobody to build it for. This bundle is the outreach system — who to contact, where to find them, what to send, and what to send when they reply.",
  cta: "Get the bundle — ₹1,299",
  ctaNote: "Instant access · Lifetime access",
  /** Three facts, not promises. */
  marks: ["10 modules", "75 scripts", "5 ready-made sites"],
} as const;

export const problem = {
  eyebrow: "Why nobody replies",
  headline: "This message has never worked. Not once.",
  /** The DM every developer sends, shown as the buyer will recognise it. */
  message: "Hi sir, we provide web development services. Interested?",
  lead: "It gets ignored for four reasons, and all four are fixable in an afternoon.",
  reasons: [
    {
      title: "It could be for anyone",
      copy: "No name, no business, nothing that proves you looked. A message that fits every business fits none of them.",
    },
    {
      title: "It asks them to do the work",
      copy: "\"Interested?\" makes the reader imagine the project, the price and the process. Most will not bother.",
    },
    {
      title: "It arrives with no reason to exist",
      copy: "Nothing happened to prompt it. No new opening, no broken page, no ad they are already running.",
    },
    {
      title: "It sells a service, not a result",
      copy: "\"Web development\" is what you do. What they buy is bookings, enquiries, or an end to answering the same question on WhatsApp.",
    },
  ],
  close:
    "Everything in this bundle replaces that one message — with a list of who to write to, a reason to write, and the exact words to use.",
} as const;

export interface Asset {
  id: string;
  name: string;
  format: string;
  what: string;
  saves: string;
}

export const assets: Asset[] = [
  {
    id: "playbook",
    name: "The playbook",
    format: "PDF · 87 pages · 10 modules",
    what: "Niche and offer, lead sourcing, a free lead-scraping method, cold email, video audits, LinkedIn partnerships, Instagram, WhatsApp, inbound and referrals.",
    saves: "You stop guessing which channel to try this week. Each module is one channel, start to finish.",
  },
  {
    id: "tracker",
    name: "Lead tracker",
    format: "Excel + Google Sheets",
    what: "Scores and grades every lead, then suggests the channel and the package to pitch. Pipeline dashboard and a weekly log built in.",
    saves: "No more leads living in your head and a notes app. You can see who is worth a follow-up today.",
  },
  {
    id: "swipe",
    name: "Swipe file",
    format: "75 scripts",
    what: "Copy-ready outreach for every channel, including Hinglish versions, plus replies for the awkward parts: price, delay, \"send portfolio\", silence.",
    saves: "The blank-message problem disappears. Change the name and the specific detail, and send.",
  },
  {
    id: "prompts",
    name: "AI prompt pack",
    format: "37 prompts",
    what: "A reusable master context so the model knows your niche, offer and tone, then prompts for research, audits, proposals and follow-ups.",
    saves: "Prompts that produce something you can send, instead of paragraphs you have to rewrite.",
  },
  {
    id: "launch",
    name: "30-day launch plan",
    format: "Day-by-day",
    what: "What to do each day for a month: set up, build the list, send, follow up, review.",
    saves: "Removes the daily \"what should I do now\" decision, which is where most people stop.",
  },
  {
    id: "niches",
    name: "Niche research pack",
    format: "12 niches",
    what: "Twelve niches researched for you: what they care about, what they already spend on, what to offer, and where to find them.",
    saves: "A week of research you do not have to do before you can start.",
  },
  {
    id: "scraper",
    name: "Scraper quick-start",
    format: "One card",
    what: "The free lead-scraping method on a single page, so you can build a list without paying for a lead tool.",
    saves: "A list of real businesses to contact, at no monthly cost.",
  },
  {
    id: "paperwork",
    name: "Paperwork",
    format: "4 documents",
    what: "Proposal, service agreement, white-label NDA and a GST invoice template.",
    saves: "You look like a business on the day someone says yes, instead of writing a contract that night.",
  },
  {
    id: "websites",
    name: "5 ready-made websites",
    format: "Single HTML file each",
    what: "Salon, dental, gym, café and interiors. No build step, no dependencies, edit markers throughout.",
    saves: "You have something to show in the first message, and a starting point you can hand over in a day.",
  },
];

/**
 * Product screenshots. Sizes are the real dimensions the images will be
 * generated at, so the boxes are reserved before the files exist.
 */
export interface Shot {
  id: string;
  alt: string;
  caption: string;
}

export const snapshots: Shot[] = [
  { id: "playbook-contents", alt: "Contents page of the playbook PDF listing its ten modules", caption: "The 10 modules" },
  { id: "playbook-module", alt: "A page from the cold email module showing a worked example", caption: "Inside a module" },
  { id: "tracker-dashboard", alt: "Lead tracker dashboard showing pipeline stages and lead grades", caption: "Tracker dashboard" },
  { id: "tracker-scoring", alt: "Lead tracker scoring sheet with grades and suggested packages", caption: "Lead scoring" },
  { id: "swipe-file", alt: "Swipe file page showing outreach scripts in English and Hinglish", caption: "Swipe file" },
  { id: "prompt-pack", alt: "AI prompt pack showing the master context and a research prompt", caption: "Prompt pack" },
  { id: "launch-plan", alt: "30-day launch plan laid out day by day", caption: "30-day plan" },
  { id: "paperwork", alt: "Proposal and service agreement templates", caption: "Paperwork" },
];

export const replies: Shot[] = [
  { id: "reply-1", alt: "WhatsApp reply from a business owner asking for more detail", caption: "WhatsApp · asked for details" },
  { id: "reply-2", alt: "Instagram reply from a business owner asking about price", caption: "Instagram · asked the price" },
  { id: "reply-3", alt: "WhatsApp reply from a business owner agreeing to a call", caption: "WhatsApp · agreed to a call" },
  { id: "reply-4", alt: "Instagram reply from a business owner asking to see examples", caption: "Instagram · asked for examples" },
];

export const repliesSection = {
  eyebrow: "Replies, not results",
  headline: "Log mail ka reply dete hain. Bas message sahi hona chahiye.",
  /** The honest framing. This copy is not optional. */
  disclaimer:
    "These are replies to the outreach in this bundle — nothing more. They are not earnings, and no income is claimed anywhere on this page. What happens after a reply depends on your work, your pricing and your follow-up.",
  privacyNote:
    "Names, photos and business details have been removed. The screenshots are published with the senders' permission.",
} as const;

export interface DemoSite {
  id: string;
  name: string;
  sector: string;
  blurb: string;
  /** Filled in when a live demo is deployed; the card links only if set. */
  demoUrl?: string;
}

export const websites: DemoSite[] = [
  { id: "salon", name: "Salon", sector: "Beauty", blurb: "Services, price list, timings and a WhatsApp booking button." },
  { id: "dental", name: "Dental clinic", sector: "Healthcare", blurb: "Treatments, doctor profile, appointment enquiry and directions." },
  { id: "gym", name: "Gym", sector: "Fitness", blurb: "Membership plans, trainers, class timings and a trial enquiry." },
  { id: "cafe", name: "Café", sector: "Food", blurb: "Menu, gallery, timings and a table enquiry." },
  { id: "interiors", name: "Interiors", sector: "Home services", blurb: "Project gallery, services, process and a quote enquiry." },
];

export const websitesSection = {
  eyebrow: "Five sites, ready to send",
  headline: "Something to show in the first message",
  copy: "Each one is a single HTML file. No build step, no npm install, no framework to learn. Open it, change the marked lines, and it is a different business.",
  note: "Screenshots below. Demo links will be added here when they are live.",
} as const;

export const fit = {
  eyebrow: "Be honest with yourself",
  headline: "Who this is for, and who it isn't",
  forYou: {
    title: "This is for you if",
    points: [
      "You can build a website but have never sold one",
      "You are sending messages and getting no replies",
      "You freelance part-time and want a repeatable way to find work",
      "You run a two or three person agency with no outbound system",
      "You want scripts and a process, not motivation",
    ],
  },
  notForYou: {
    title: "This is not for you if",
    points: [
      "You cannot build a basic website yet — learn that first",
      "You want clients without contacting anyone",
      "You are looking for a guaranteed income or a job",
      "You expect results without sending messages daily for a month",
      "You want an agency to do the outreach for you",
    ],
  },
} as const;

export const faqs = [
  {
    question: "What exactly do I get?",
    answer:
      "Nine files: the 87-page playbook (PDF), the lead tracker (Excel and Google Sheets), 75 outreach scripts, 37 AI prompts with a master context, a 30-day launch plan, a 12-niche research pack, the scraper quick-start card, four paperwork templates, and 5 ready-made websites as single HTML files. Everything downloads straight after payment.",
  },
  {
    question: "Is this India-specific?",
    answer:
      "Yes. The niches, the pricing conversations, the scripts (including Hinglish versions), the WhatsApp-first approach and the GST invoice template are all written for the Indian market. The method works elsewhere, but the examples are Indian.",
  },
  {
    question: "Do I need paid tools?",
    answer:
      "No. The lead sourcing method is free, the tracker runs in Excel or Google Sheets, and the websites need nothing but a text editor. Paid tools can speed parts of it up; nothing here depends on them.",
  },
  {
    question: "Is the scraping method really free?",
    answer:
      "Yes — it uses publicly listed business information and free tools, and the quick-start card shows the whole process on one page. It is a manual, rate-limited method for building your own small list, not a bulk scraper, and it collects nothing that is not already public.",
  },
  {
    question: "How soon do I get it?",
    answer:
      "Immediately. The download unlocks as soon as the payment is confirmed, and access does not expire.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "This is a digital download that is delivered in full the moment you pay, so it is sold as final. If the files do not download, or you were charged twice, message us and we will fix it or refund it. The refund policy page sets this out in plain terms.",
  },
  {
    question: "Is there any support?",
    answer:
      "Yes, over WhatsApp, for anything to do with the files themselves: downloads, opening the tracker, editing the websites. It is not a coaching programme — there is no call, no community and no ongoing mentoring included at this price.",
  },
];

export const checkout = {
  eyebrow: "One payment, everything included",
  headline: "Get the bundle",
  recapTitle: "What unlocks straight away",
  button: "Pay ₹1,299 securely",
  processing: "Opening secure checkout…",
  secure: "Payment handled by Razorpay. Card details never touch this site.",
  afterNote:
    "You will be taken to a confirmation page with your download as soon as the payment is confirmed.",
  trust: [
    { title: "Instant access", copy: "The download unlocks the moment payment is confirmed." },
    { title: "Lifetime access", copy: "Yours to keep, including future updates to these files." },
    { title: "Secure payment", copy: "Processed by Razorpay. We never see your card details." },
  ],
  errors: {
    start: "We could not start the payment. Please try again in a moment.",
    failed: "That payment did not go through. Nothing has been charged.",
    blocked: "The payment window was blocked. Allow pop-ups and try again.",
  },
} as const;

export const thankYou = {
  headline: "Payment confirmed",
  sub: "Your download is ready below.",
  pending: "Confirming your payment…",
  pendingNote:
    "This takes a few seconds. Keep this page open — it updates on its own once the bank confirms.",
  failed: "We could not confirm this payment yet",
  failedNote:
    "If money has left your account, it will either complete or be returned by your bank. Message us on WhatsApp with your order id and we will sort it out.",
  downloadCta: "Download the bundle",
  linkNote: "This link is tied to your order. Keep it private.",
} as const;

export const playbookFooter = {
  byline: "a product by",
  links: [
    { label: "Terms", href: "/playbook/terms" },
    { label: "Refund policy", href: "/playbook/refund" },
    { label: "Privacy", href: "/playbook/privacy" },
  ],
} as const;
