/**
 * /playbook — every word of the sales page, typed.
 *
 * RULES THIS FILE FOLLOWS
 *  - No income claims, no guarantees, no "earn X in Y days". Not caution:
 *    it is untrue, it gets ads rejected, and it invites chargebacks.
 *  - No countdowns, no fake scarcity, no struck-through prices.
 *  - Every number describes the product itself (modules, scripts, prompts,
 *    niches, sites). Nothing is a claim about results.
 *  - The price appears ONCE, at the end. The page has to earn it first.
 *  - The reply screenshots prove the outreach gets answered. Nothing more.
 *
 * Hinglish in the headlines, where the buyer's own voice is. Plain English in
 * the body, because nothing should be ambiguous before a payment.
 */

export const product = {
  name: "The Client Playbook",
  // Also the meta description and the Product JSON-LD description, so it is
  // kept under 160 characters.
  summary:
    "A 10-module playbook, lead tracker, 75 outreach scripts, 37 AI prompts, a 30-day plan and 5 ready-made sites — for freelance web devs in India.",
  price: 1299,
  currency: "INR",
  priceLabel: "₹1,299",
  priceNote: "One-time. No subscription, no upsell, no renewal.",
  terms: ["Instant access", "Lifetime access", "Free updates"],
} as const;

export const hero = {
  eyebrow: "For freelance web developers in India",
  /** Two deliberate lines: left to itself the break lands mid-phrase. */
  headline: ["Coding seekh li.", "Client nahi mila?"],
  sub: "The problem isn't your skill. It's your first message.",
  body: "You can build the thing. You just have nobody to build it for. This is the system in between: who to contact, what to send, and what to say when they finally reply.",
  primaryCta: "Show me what's inside",
  secondaryCta: "What it costs",
  marks: ["10 modules", "75 scripts", "5 ready-made sites", "No paid tools needed"],
  /** Runs as a marquee under the hero: the bundle, at a glance. */
  ticker: [
    "87-page playbook",
    "10 modules",
    "75 outreach scripts",
    "37 AI prompts",
    "Lead tracker",
    "30-day plan",
    "12 researched niches",
    "Free scraping method",
    "4 legal templates",
    "5 ready-made websites",
    "Hinglish included",
    "Lifetime access",
  ],
} as const;

/**
 * The guarantee.
 *
 * DELIBERATELY A PROMISE ABOUT US, NOT ABOUT THE MARKET. "Guaranteed clients"
 * would be a claim about the buyer's niche, skill, pricing and follow-through,
 * none of which we control — and an unqualified outcome guarantee on a paid
 * digital product is the exact shape the CCPA's misleading-advertising rules
 * target, as well as the fastest route to a frozen payment account.
 *
 * What is here instead is a refund term: conditional, verifiable, and entirely
 * within our power to honour. /playbook/refund states the same thing, and the
 * two must never drift apart.
 */
export const guarantee = {
  badge: "30-day money-back guarantee",
  headline: "Do the 30 days. No client? Full refund.",
  copy: "Work the launch plan for a month — build the list, send the messages, run the follow-ups — and log it in the tracker that comes with the bundle. If you finish that month without a single client conversation worth having, send the tracker and we refund you in full.",
  conditions: [
    "Ask within 45 days of buying",
    "Show the tracker: leads contacted and follow-ups sent across the 30 days",
    "Full refund to the original payment method, inside 7 working days",
  ],
  honest:
    "We are not promising clients. Nobody honestly can — it depends on your niche, your work and your follow-through. We are promising that if you do the work and it does not open a single door, you do not pay for it.",
} as const;

/**
 * The before/after that carries the whole argument. Both messages are ours,
 * written for this page — the "after" is an illustration of the method, not a
 * line lifted from the swipe file.
 */
export const rewrite = {
  eyebrow: "The whole problem, in two messages",
  headline: "Same developer. Same skill. Different first line.",
  before: {
    label: "What everyone sends",
    message: "Hi sir, we provide web development services. Interested?",
    verdict: "Ignored",
    outcome: "No reply. No follow-up worth sending either — there is nothing to follow up on.",
    notes: [
      "Could be addressed to anyone",
      "Asks them to imagine the project, the price and the process",
      "Arrives for no reason, on no occasion",
      "Sells what you do, not what they get",
    ],
  },
  after: {
    label: "What the playbook teaches",
    message:
      "Hi Rajesh — saw Sharma Dental is running Google ads, but the link goes to a Facebook page. You're paying for clicks that can't book. I recorded a 90-second video showing the three places people drop off. Want me to send it?",
    verdict: "Gets a reply",
    outcome: "Hey, yes sure. Send it.",
    notes: [
      "Names the business and one specific thing you actually looked at",
      "Points at money they are already spending",
      "Asks for a yes to a video, not to a project",
      "Costs them nothing to say yes to",
    ],
  },
  close:
    "Everything in this bundle exists to make the second message easy to send, forty times a week, without writing it from scratch each time.",
} as const;

/** How the system runs, and which file powers each step. */
export const system = {
  eyebrow: "How it actually works",
  headline: "Four steps. Every file in the bundle serves one of them.",
  steps: [
    {
      step: "Pick",
      title: "Choose who you are for",
      copy: "A niche narrows what you say, what you charge and where you look. Generalists write generic messages, and generic messages get ignored.",
      powered: "Niche research pack · Modules 1–2",
    },
    {
      step: "Find",
      title: "Build a list of real businesses",
      copy: "Publicly listed businesses with a website problem you can name. The scraping method builds the list without a paid lead tool.",
      powered: "Scraper quick-start · Modules 3–4",
    },
    {
      step: "Send",
      title: "Reach out with a reason",
      copy: "Cold email, video audits, Instagram, WhatsApp, LinkedIn partnerships — each with its own script, cadence and follow-up.",
      powered: "Swipe file · Modules 5–9",
    },
    {
      step: "Close",
      title: "Handle the reply without fumbling",
      copy: "Price questions, 'send portfolio', silence, 'we'll think about it'. Then a proposal, an agreement and an invoice that look like a business.",
      powered: "Reply scripts · Paperwork · Module 10",
    },
  ],
} as const;

/** The 10 modules, titled exactly as the PDF's contents page lists them. */
export const modules = [
  { n: "01", title: "Niche & offer selection", copy: "Pick a niche you can defend, and an offer priced in outcomes rather than hours." },
  { n: "02", title: "Productizing your service", copy: "Turn what you do into a fixed package with a scope, a price and a delivery time." },
  { n: "03", title: "Lead sourcing & qualification", copy: "Where the businesses actually are, and how to tell a live lead from a dead listing." },
  { n: "04", title: "Free lead scraping methods", copy: "Build your own list from public listings — no paid lead tool, no monthly fee." },
  { n: "05", title: "Cold email systems", copy: "Subject lines, first lines, the ask, the follow-up sequence, and what to do with no reply." },
  { n: "06", title: "Video audit outreach", copy: "The 90-second screen recording that turns a cold message into a conversation." },
  { n: "07", title: "LinkedIn: profile, partnerships & outreach", copy: "Agencies and designers who already have clients and need someone who can build." },
  { n: "08", title: "Instagram: the demo-first method", copy: "Find local businesses by their own posts, then lead with a demo instead of a pitch." },
  { n: "09", title: "WhatsApp & local outreach", copy: "The channel Indian businesses actually answer — used without getting your number reported." },
  { n: "10", title: "Inbound: portfolio, referrals & marketplaces", copy: "The things that make work come to you, so outreach is not forever." },
] as const;

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
    what: "The whole method, one channel per module, from picking a niche to asking for the referral.",
    saves: "You stop guessing what to try this week.",
  },
  {
    id: "tracker",
    name: "Lead tracker",
    format: "Excel + Google Sheets",
    what: "Scores and grades every lead, then tells you which channel and which package fits it.",
    saves: "Leads stop living in your head and a notes app.",
  },
  {
    id: "swipe",
    name: "Swipe file",
    format: "75 scripts",
    what: "Every message for every channel, Hinglish included, plus the replies for price, delay and silence.",
    saves: "The blank message box stops being a reason not to send.",
  },
  {
    id: "prompts",
    name: "AI prompt pack",
    format: "37 prompts",
    what: "A master context that teaches the model your niche and offer, then prompts for research, audits and proposals.",
    saves: "Output you can send, not paragraphs you have to rewrite.",
  },
  {
    id: "launch",
    name: "30-day launch plan",
    format: "Day by day",
    what: "What to do each day for a month: set up, list, send, follow up, review.",
    saves: "Removes the daily 'what now', which is where most people stop.",
  },
  {
    id: "niches",
    name: "Niche research pack",
    format: "12 niches",
    what: "Twelve niches already researched: what they spend on, what to offer, where to find them.",
    saves: "A week of research you do not have to do first.",
  },
  {
    id: "scraper",
    name: "Scraper quick-start",
    format: "One card",
    what: "The free list-building method on a single page you can keep open while you work.",
    saves: "A real list of businesses at no monthly cost.",
  },
  {
    id: "paperwork",
    name: "Paperwork",
    format: "4 documents",
    what: "Proposal, service agreement, white-label NDA and a GST invoice template.",
    saves: "You look like a business on the day someone says yes.",
  },
  {
    id: "websites",
    name: "5 ready-made websites",
    format: "5 sectors",
    what: "Salon & spa, dental, gym, café & restaurant and physiotherapy. No build step, no dependencies, edit markers throughout.",
    saves: "Something to show in the first message, and a head start on delivery.",
  },
];

/** The tracker, shown as the thing it is rather than described. */
export const tracker = {
  eyebrow: "The file you will open every day",
  headline: "A pipeline that tells you who to chase",
  copy: "Paste a lead in and the sheet does the thinking: it scores the business on the signals that matter, grades it A to D, and suggests the channel and the package that fit. The dashboard shows the pipeline; the weekly log shows whether you actually sent anything.",
  columns: ["Business", "Signal", "Score", "Grade", "Channel", "Package", "Next action"],
  rows: [
    ["Dental clinic", "Ads → dead link", "88", "A", "Video audit", "Landing + booking", "Send audit"],
    ["Salon", "No website", "74", "B", "WhatsApp", "Starter site", "First message"],
    ["Café", "Site, no menu", "61", "C", "Instagram", "Menu + gallery", "Follow up Tue"],
  ],
  features: [
    "Scoring built from the signals that predict a reply",
    "A–D grading so you work the top of the list first",
    "Channel and package suggested per lead",
    "Pipeline dashboard: sent, replied, called, closed",
    "Weekly log that makes a slow week obvious",
    "Works in Excel or Google Sheets, no add-ons",
  ],
} as const;

/** Scripts and prompts, by category. */
export const library = {
  eyebrow: "Words, ready to send",
  headline: "75 scripts and 37 prompts, sorted by the moment you need them",
  scripts: {
    title: "Swipe file",
    groups: [
      { title: "First contact", copy: "Cold email, Instagram DM, WhatsApp, LinkedIn — English and Hinglish." },
      { title: "Video audit", copy: "The message that carries the recording, and the script for the recording itself." },
      { title: "Follow-up", copy: "Second, third and final touches that are not 'just checking in'." },
      { title: "Reply handling", copy: "Price, 'send portfolio', 'we already have someone', 'after Diwali', silence." },
      { title: "Closing", copy: "Moving from chat to call, confirming scope, and asking for the advance." },
      { title: "After delivery", copy: "Handover, the review ask, and the referral ask that does not feel like begging." },
    ],
  },
  prompts: {
    title: "AI prompt pack",
    groups: [
      { title: "Master context", copy: "One block that teaches the model your niche, offer, tone and constraints. Paste first, every time." },
      { title: "Research", copy: "Turn a business name into a usable angle: what they sell, what is broken, what to say." },
      { title: "Audit", copy: "Turn a page into a specific list of problems worth recording." },
      { title: "Writing", copy: "Proposals, follow-ups and replies drafted in your voice, not a chatbot's." },
    ],
  },
} as const;

/** The 30-day plan, as four weeks. */
export const plan = {
  eyebrow: "The first month, decided for you",
  headline: "30 days, already planned",
  copy: "Open the plan, do the day. No motivation required, and nothing to decide before you start.",
  weeks: [
    { label: "Week 1", title: "Set up", copy: "Niche, offer, pricing, the tracker, and the accounts you will send from." },
    { label: "Week 2", title: "Build the list", copy: "Scrape, qualify and score your first 100 leads. Record your first audits." },
    { label: "Week 3", title: "Send", copy: "Daily sends across two channels, with follow-ups landing on schedule." },
    { label: "Week 4", title: "Review", copy: "Read the log, cut what is silent, double what replies, and book the calls." },
  ],
} as const;

/** Research pack and scraper, paired. */
export const research = {
  eyebrow: "Before you send anything",
  headline: "Know who you are writing to",
  niches: {
    title: "12 niches, already researched",
    copy: "Each one covers what the business cares about, what it already spends money on, the offer that fits, where to find them, and the angle that opens a conversation.",
    fields: ["What they care about", "What they already spend on", "The offer that fits", "Where to find them", "The opening angle"],
  },
  scraper: {
    title: "The free scraping method",
    copy: "One card, one page: how to build your own list from public business listings using free tools. It is manual and rate-limited on purpose — it collects nothing that is not already public, and it costs nothing per month.",
    points: ["Public listings only", "No paid lead tool", "No monthly cost", "Fits on one page"],
  },
} as const;

/** Paperwork. */
export const paperwork = {
  eyebrow: "The day someone says yes",
  headline: "Paperwork that already exists",
  copy: "The four documents you otherwise write at 11pm, badly, on the night a client finally agrees.",
  docs: [
    { title: "Proposal", copy: "Scope, deliverables, timeline and price, in a shape a business owner will actually read." },
    { title: "Service agreement", copy: "What you will do, what they owe, what happens if either side stops." },
    { title: "White-label NDA", copy: "For the agency work you deliver under someone else's name." },
    { title: "GST invoice", copy: "A template that looks like a company sent it, because one did." },
  ],
  note: "Starting points written for the common case, not legal advice. Have a professional review anything you rely on.",
} as const;

export interface Shot {
  id: string;
  alt: string;
  caption: string;
}

/**
 * Reply screenshots. Every identifying mark — name, business name, number,
 * avatar, demo link — is blacked out in the master before it is generated.
 * See scripts/redact-proofs.mjs.
 */
export const replies: Shot[] = [
  {
    id: "reply-1",
    alt: "A WhatsApp thread: an opening message about a business with no website on its Google listing, answered with yes, send it",
    caption: "“Hey, yes sure. Send it.”",
  },
  {
    id: "reply-2",
    alt: "A WhatsApp thread: a salon owner replying that they did not know their website was broken, then asking whether their own photos can be used",
    caption: "“Can you use our Instagram photos?”",
  },
  {
    id: "reply-3",
    alt: "A WhatsApp thread: a gym owner asking for the demo, saying it looks good, then asking about pricing",
    caption: "“What about pricing?”",
  },
  {
    id: "reply-4",
    alt: "A WhatsApp thread: a clinic asking whether the demo was made specifically for them, then agreeing to a call",
    caption: "“Sure” — to a call",
  },
];

export const repliesSection = {
  eyebrow: "Replies, not results",
  headline: "Log reply dete hain. Bas message sahi hona chahiye.",
  disclaimer:
    "These are replies to the outreach in this bundle — nothing else. They are not earnings, and no income is claimed anywhere on this page. What happens after a reply depends on your work, your pricing and your follow-up.",
  privacyNote:
    "Names, business names, phone numbers, avatars and demo links are blacked out. Nothing either side said has been edited.",
} as const;

export interface DemoSite {
  id: string;
  name: string;
  sector: string;
  blurb: string;
  includes: string[];
  demoUrl?: string;
}

export const websites: DemoSite[] = [
  {
    id: "salon",
    name: "Salon & spa",
    sector: "Beauty",
    blurb: "Services, price list, timings, and a WhatsApp booking button that opens a pre-filled message.",
    includes: ["Service menu", "Price list", "WhatsApp booking", "Gallery"],
  },
  {
    id: "dental",
    name: "Dental clinic",
    sector: "Healthcare",
    blurb: "Treatments, doctor profile, appointment enquiry and directions — the four things patients look for.",
    includes: ["Treatments", "Doctor profile", "Appointment form", "Map"],
  },
  {
    id: "gym",
    name: "Gym & fitness",
    sector: "Fitness",
    blurb: "Membership plans, trainers, class timetable and a free-trial enquiry.",
    includes: ["Plans", "Trainers", "Timetable", "Trial enquiry"],
  },
  {
    id: "cafe",
    name: "Café & restaurant",
    sector: "Food",
    blurb: "Story, menu, gallery and a table reservation — the one shown above, built to load fast on a phone.",
    includes: ["Menu", "Gallery", "Reservation", "Reviews"],
  },
  {
    id: "physio",
    name: "Physiotherapy",
    sector: "Clinics",
    blurb: "Conditions treated, therapist profile, session packages and an appointment enquiry.",
    includes: ["Conditions", "Therapist", "Packages", "Enquiry"],
  },
];

export const websitesSection = {
  eyebrow: "Five sites, ready to send",
  headline: "Something to show in the first message",
  copy: "One self-contained file each. No build step, no npm install, no framework to learn. Open it, change the marked lines, and it belongs to a different business. Use them as demos to open conversations, or as the starting point you deliver.",
  note: "The café and restaurant template is shown above. Live demo links will be added here once they are deployed.",
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
      "You want someone else to do the outreach for you",
    ],
  },
} as const;

export const faqs = [
  {
    question: "What exactly do I get?",
    answer:
      "Nine files: the 87-page playbook (PDF), the lead tracker (Excel and Google Sheets), 75 outreach scripts, 37 AI prompts with a master context, a 30-day launch plan, a 12-niche research pack, the scraper quick-start card, four paperwork templates, and 5 ready-made websites — salon & spa, dental, gym, café & restaurant and physiotherapy. Everything downloads the moment the payment is confirmed.",
  },
  {
    question: "Is this India-specific?",
    answer:
      "Yes. The niches, the pricing conversations, the Hinglish scripts, the WhatsApp-first approach and the GST invoice template are written for the Indian market. The method travels; the examples are Indian.",
  },
  {
    question: "Do I need paid tools?",
    answer:
      "No. The list-building method is free, the tracker runs in Excel or Google Sheets, and the websites need nothing but a text editor. Paid tools can speed parts up; nothing here depends on them.",
  },
  {
    question: "Is the scraping method really free?",
    answer:
      "Yes. It uses publicly listed business information and free tools, and the quick-start card fits the whole process on one page. It is a manual, rate-limited way to build your own small list — not a bulk scraper — and it collects nothing that is not already public.",
  },
  {
    question: "How is this different from a YouTube video?",
    answer:
      "A video tells you what to do. This gives you the files that do it: the list of niches, the scripts for every reply, the tracker that scores leads, the plan for each of the next 30 days, and five sites you can show tomorrow. The method is not secret — assembling it is the work you are paying to skip.",
  },
  {
    question: "How soon do I get it?",
    answer:
      "Immediately. The download unlocks as soon as the payment is confirmed, and access does not expire.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes, on the guarantee. Work the 30-day launch plan, log it in the tracker, and if you finish the month without a single client conversation worth having, send us the tracker within 45 days of buying and we refund you in full. Separately, if the files do not download or you were charged twice, message us and we will fix it or refund it either way.",
  },
  {
    question: "So you guarantee I will get clients?",
    answer:
      "No, and be careful with anyone who does. Whether you get clients depends on your niche, the quality of your work, your pricing and whether you actually send the messages every day. What we guarantee is the refund: do the 30 days, log it, and if nothing opens up you do not pay for it.",
  },
  {
    question: "Is there any support?",
    answer:
      "Yes, over WhatsApp, for anything to do with the files: downloads, opening the tracker, editing the websites. It is not a coaching programme — no calls, no community, no mentoring at this price.",
  },
];

/** The price, revealed once, at the end. */
export const priceReveal = {
  eyebrow: "What it costs",
  headline: "One payment. Everything above.",
  lead: "Not a subscription, not a course with a locked second half, and not a call you have to book to hear the price.",
  recapTitle: "Unlocks the moment payment is confirmed",
  compare: {
    title: "For context, not as a claim",
    points: [
      "A single lead-gen tool subscription usually costs more per month than this does once.",
      "One delivered project at freelance rates is a multiple of it.",
      "The files are yours to keep, including updates, with nothing to renew.",
    ],
  },
} as const;

export const checkout = {
  button: "Pay ₹1,299 securely",
  processing: "Opening secure checkout…",
  secure: "Payment handled by Razorpay. Card details never touch this site.",
  afterNote:
    "You will land on a confirmation page with your download as soon as the payment is confirmed.",
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
    "If money has left your account it will either complete or be returned by your bank. Message us on WhatsApp with your order id and we will sort it out.",
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
