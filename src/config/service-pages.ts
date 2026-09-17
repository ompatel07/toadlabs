/**
 * Dedicated service pages — /services/[slug] and /cybersecurity/[slug].
 *
 * WHY THESE EXIST
 * Search engines rank pages, not sites. Someone searching "VAPT company in
 * Ahmedabad" or "WhatsApp automation services" is matched against a page whose
 * title, heading and body are about exactly that. A row on a ten-service
 * overview page cannot compete with a competitor's dedicated page, however good
 * the row is. Each entry here becomes one crawlable page with its own title,
 * description, heading, FAQs and structured data.
 *
 * RULES FOR THIS CONTENT
 *  - Written for the buyer first. Keywords appear where a person would
 *    naturally use them — in the title, the heading and the opening — never
 *    stuffed into body copy.
 *  - Every page is genuinely different: its own problems, deliverables,
 *    process and questions. Near-duplicate "city pages" are what search
 *    engines demote.
 *  - Same honesty rules as the rest of the site: no invented statistics,
 *    clients, certifications, prices or guaranteed timelines.
 *
 * `serviceId` links each page to its summary card in config/services.ts or
 * config/security.ts, so the short description and capability list are
 * written once and shared.
 */

export type ServiceCategory = "build" | "security";

export interface ServicePage {
  slug: string;
  category: ServiceCategory;
  /** Id of the matching entry in services.ts or security.ts. */
  serviceId: string;
  /** <title>, before the " — Toad Labs" suffix. Keep under ~50 characters. */
  seoTitle: string;
  /** Meta description and link-preview text. 140–160 characters. */
  metaDescription: string;
  /** Short label used in breadcrumbs, related links and navigation. */
  name: string;
  /** Visible H1. Leads with the primary search phrase; under ~48 characters,
   *  because it is set at display size and longer ones wrap to five lines. */
  h1: string;
  intro: string[];
  /** "You probably need this if…" — the situations that bring people here. */
  signs: string[];
  included: { title: string; detail: string }[];
  process: { title: string; detail: string }[];
  faqs: { question: string; answer: string }[];
  related: string[];
}

export const servicePages: ServicePage[] = [
  /* ── Build ─────────────────────────────────────────────────────────── */
  {
    slug: "website-development",
    category: "build",
    serviceId: "websites",
    name: "Website development",
    seoTitle: "Website Development Company in Ahmedabad",
    metaDescription:
      "Fast, SEO-ready business websites built in Ahmedabad by Toad Labs. Next.js development, Core Web Vitals, accessibility and a CMS your team can edit.",
    h1: "Website development that loads fast and ranks",
    intro: [
      "Your website is usually the first thing a buyer checks, and most of them check it on a phone. We build business websites that load quickly on a mid-range handset, pass a technical SEO audit, and meet accessibility standards from the first release — not as a later project.",
      "We are a website development company in Ahmedabad working with businesses across India and abroad. You get a site built on a modern stack such as Next.js, content your team can update without calling a developer, and hosting, domains and analytics set up in your own name.",
    ],
    signs: [
      "Your current site is slow on mobile or scores poorly in PageSpeed Insights",
      "Every small text change needs a developer",
      "You are not appearing in Google for the services you actually sell",
      "The site looks dated next to the competitors your buyers compare you with",
    ],
    included: [
      { title: "Design and content structure", detail: "Page structure planned around what your buyers search for and ask about, not a generic template." },
      { title: "Performance budget", detail: "Core Web Vitals targets agreed up front and checked on every release, so the site stays fast after launch." },
      { title: "Technical SEO", detail: "Semantic HTML, titles and meta descriptions, structured data, XML sitemap, canonical URLs and clean redirects from your old site." },
      { title: "Editable content", detail: "A CMS or structured content files, chosen for how often your team actually updates the site." },
      { title: "Accessibility", detail: "WCAG 2.1 AA as the baseline: contrast, keyboard navigation, labels and screen-reader support." },
      { title: "Security and hosting", detail: "HTTPS, security headers and a content security policy, deployed to hosting you own." },
    ],
    process: [
      { title: "Discovery", detail: "We map your services, your buyers and what they search for, and agree what the site must achieve." },
      { title: "Structure and design", detail: "Sitemap, page wireframes and visual design, reviewed with you before build starts." },
      { title: "Build", detail: "Development with performance, SEO and accessibility checked continuously rather than audited at the end." },
      { title: "Launch and handover", detail: "Redirects, analytics and search console set up, then a walkthrough so your team can run it." },
    ],
    faqs: [
      { question: "How long does a business website take to build?", answer: "It depends on the number of pages, how much content already exists and how many integrations are involved. A focused marketing site is typically a matter of weeks, not months. We give you a timeline after scoping, and we say so plainly if yours will take longer." },
      { question: "Will the new website be SEO friendly?", answer: "Yes. Technical SEO is part of the build: fast load times, semantic markup, titles and descriptions, structured data, a sitemap and redirects from your old URLs so you keep the rankings you already have. Ranking also depends on content and competition, and we will tell you honestly where the gaps are." },
      { question: "Can we update the website ourselves?", answer: "Yes. We set up editing that matches how often you change the site — a CMS for teams that publish regularly, simpler structured content for sites that rarely change — and walk your team through it at handover." },
    ],
    related: ["web-mobile-app-development", "custom-software-development", "vapt-services"],
  },
  {
    slug: "web-mobile-app-development",
    category: "build",
    serviceId: "web-mobile-apps",
    name: "Web & mobile app development",
    seoTitle: "Web & Mobile App Development in Ahmedabad",
    metaDescription:
      "Web and mobile app development company in Ahmedabad. React and React Native apps for iOS, Android and web, built on one shared core and tested for security.",
    h1: "Web and mobile app development on one core",
    intro: [
      "Most businesses need their product on the web, on iPhone and on Android. Built as three separate projects, those versions drift apart until they disagree about basic things. We build web and mobile apps that share one core, so a feature or a fix lands everywhere at once.",
      "Toad Labs is a web and mobile app development company in Ahmedabad. Every app we ship is tested by the same team that runs our penetration tests, so authentication, data storage and APIs are built to withstand attack — not patched after someone finds a hole.",
    ],
    signs: [
      "You need the same product on web, iOS and Android without tripling the cost",
      "Your current app is slow, crashes, or falls apart on poor mobile networks",
      "Your web and mobile versions behave differently and users notice",
      "App store releases are painful, manual and rare",
    ],
    included: [
      { title: "Cross-platform apps", detail: "React for web and React Native for iOS and Android, sharing business logic and design components." },
      { title: "Backend and APIs", detail: "Secure APIs, authentication and role-based permissions designed with the apps, not bolted on." },
      { title: "Offline tolerance", detail: "State that survives weak connections and resolves conflicts sensibly when a device reconnects." },
      { title: "Store release pipeline", detail: "App Store and Play Store submission, signing and automated builds, so releases stop being events." },
      { title: "Security testing", detail: "Mobile and API testing against OWASP MASVS and ASVS before launch." },
    ],
    process: [
      { title: "Scope", detail: "User journeys, platforms and integrations agreed, with a written list of what is in and out." },
      { title: "Architecture", detail: "Data model, API design and trust boundaries settled before production code." },
      { title: "Iterative build", detail: "Working builds on your devices every sprint, not a big reveal at the end." },
      { title: "Test, release, support", detail: "Security testing, store submission, monitoring and a plan for ongoing releases." },
    ],
    faqs: [
      { question: "Do you build native or cross-platform apps?", answer: "Usually cross-platform with React Native, because one shared codebase is faster to build and cheaper to maintain for most products. Where a feature genuinely needs native code — some hardware, media or performance-critical work — we write that part natively." },
      { question: "Can you take over an app another company built?", answer: "Yes. We start with a code and security review so you know what you have, then agree whether to stabilise it, improve it gradually or rebuild specific parts. We will not recommend a full rewrite unless it is genuinely cheaper." },
      { question: "Who owns the source code?", answer: "You do, from the first commit. The repository, app store accounts, cloud accounts and signing keys are in your name." },
    ],
    related: ["mvp-development", "saas-development", "penetration-testing"],
  },
  {
    slug: "mvp-development",
    category: "build",
    serviceId: "mvp",
    name: "MVP development",
    seoTitle: "MVP Development Company for Startups in India",
    metaDescription:
      "MVP development for startups and new products. Toad Labs scopes, builds and launches your minimum viable product fast, with real auth, analytics and security.",
    h1: "MVP development while you still have runway",
    intro: [
      "A minimum viable product exists to answer one question: will people use this, and pay for it? We help founders and product teams cut scope to what answers that question, then build it properly enough to put in front of real users.",
      "Fast does not mean fragile. Authentication, permissions and analytics go in from the start, because an MVP that leaks data or cannot measure what users do teaches you nothing useful. The parts that can wait — polish, edge-case features, scale — are cut in writing, so everyone knows what was deferred and why.",
    ],
    signs: [
      "You have an idea and a budget, and need to test it before committing more",
      "Your scope keeps growing and launch keeps moving",
      "You need something investors or early customers can actually use",
      "A previous prototype worked in a demo but could not survive real users",
    ],
    included: [
      { title: "Scope workshop", detail: "What must exist to test your core assumption, what gets cut, and the reasoning — written down." },
      { title: "Production-grade foundations", detail: "Authentication, roles, audit logging and a data model that will not need to be thrown away." },
      { title: "Instrumentation", detail: "Product analytics from day one, so decisions after launch rest on evidence." },
      { title: "Launch", detail: "Deployment, monitoring and error tracking on infrastructure in your name." },
      { title: "Next-step plan", detail: "What to build, fix or drop next, based on what users actually did." },
    ],
    process: [
      { title: "Define the question", detail: "The assumption the MVP must test and the signal that will count as an answer." },
      { title: "Cut scope", detail: "Features ranked against that question; everything else deferred on paper." },
      { title: "Build in short cycles", detail: "A usable build early, then weekly iterations you can put in front of testers." },
      { title: "Launch and learn", detail: "Release to real users, measure, and decide the next phase with data." },
    ],
    faqs: [
      { question: "How long does MVP development take?", answer: "That depends almost entirely on scope, which is why scoping comes first. Our job is to cut the MVP down to what tests your idea, which usually shortens the timeline more than working faster ever could. You get a timeline for a defined scope before we start." },
      { question: "Will we have to rebuild the MVP later?", answer: "Not if it is built properly. We defer polish and features, not foundations. The data model, authentication and permissions are built to carry the product forward, so growth means adding to the MVP rather than replacing it." },
      { question: "Do you work with non-technical founders?", answer: "Yes, often. We explain trade-offs in plain language, put decisions in writing, and make sure you own every account and line of code, so you are never dependent on us to keep the product running." },
    ],
    related: ["saas-development", "web-mobile-app-development", "ai-automation"],
  },
  {
    slug: "saas-development",
    category: "build",
    serviceId: "saas",
    name: "SaaS development",
    seoTitle: "SaaS Development Company in India",
    metaDescription:
      "SaaS product development in India: multi-tenant architecture, role-based access, subscription billing and audit trails, security-tested by Toad Labs.",
    h1: "SaaS development for bigger customers",
    intro: [
      "The features that win a demo are rarely the ones that close a larger customer. Enterprise buyers ask about tenant isolation, roles and permissions, audit trails, uptime and security testing. We build SaaS products with those answers designed in from the beginning.",
      "As a SaaS development company with an in-house security practice, we can do something most product teams cannot: test your platform the way a buyer's security team will, before their questionnaire arrives.",
    ],
    signs: [
      "You are turning an internal tool or service business into a SaaS product",
      "Bigger customers are asking security and compliance questions you cannot answer",
      "Adding a customer means manual setup, or one customer's data could leak to another",
      "Billing, plans and usage limits are handled by hand",
    ],
    included: [
      { title: "Multi-tenant architecture", detail: "Tenant isolation enforced at the data layer, where a UI bug cannot bypass it." },
      { title: "Roles and permissions", detail: "Role-based access control that matches how your customers' teams really work." },
      { title: "Subscription billing", detail: "Plans, trials, usage metering and invoices integrated with your payment provider." },
      { title: "Audit trails", detail: "Who changed what and when — the record enterprise customers and auditors ask for." },
      { title: "Operations", detail: "Monitoring, error budgets, backups and a release process your team can run." },
      { title: "Security testing", detail: "Multi-tenant and authorisation testing before your first large customer does it for you." },
    ],
    process: [
      { title: "Product and tenancy model", detail: "Who your customers are, how their data is separated and what each role can do." },
      { title: "Core platform", detail: "Auth, tenancy, billing and audit built first, so features sit on solid ground." },
      { title: "Feature delivery", detail: "Iterative releases prioritised against what your customers pay for." },
      { title: "Harden and scale", detail: "Security testing, performance work and the documentation enterprise buyers request." },
    ],
    faqs: [
      { question: "Can you help us pass enterprise security questionnaires?", answer: "Yes. Because we build and test, we can design the controls those questionnaires ask about, test them, and help you answer the technical questions accurately. We prepare you for audits such as ISO 27001 or SOC 2; the certificate itself comes from an accredited auditor." },
      { question: "Which tech stack do you use for SaaS?", answer: "Typically TypeScript with React or Next.js on the front end, Node.js services, PostgreSQL and a major cloud provider. We choose based on your team and product rather than habit, and we document the reasoning." },
      { question: "Can you add multi-tenancy to our existing product?", answer: "Often, yes. We start by reviewing how data is stored and accessed today, then plan a migration that isolates tenants without a risky big-bang rewrite." },
    ],
    related: ["mvp-development", "custom-crm-development", "iso-27001-soc-2-readiness"],
  },
  {
    slug: "custom-crm-development",
    category: "build",
    serviceId: "crm",
    name: "Custom CRM development",
    seoTitle: "Custom CRM Development Company in India",
    metaDescription:
      "Custom CRM development for sales and service teams. Pipelines, permissions, WhatsApp and email integration, and data migration from spreadsheets or other CRMs.",
    h1: "Custom CRM development for how you really sell",
    intro: [
      "Off-the-shelf CRMs assume a sales process that may not be yours. Teams work around them with spreadsheets and WhatsApp messages until the CRM is out of date and nobody trusts it. A custom CRM fits your actual stages, records and permissions, so keeping it current saves your team time instead of costing it.",
      "We build CRMs that connect to where your conversations already happen — email, calendars and WhatsApp — and migrate your existing data carefully, so you do not start from zero.",
    ],
    signs: [
      "Your team tracks leads in spreadsheets alongside a CRM nobody updates",
      "Licence costs grow with every seat for features you never use",
      "Your sales or service process does not fit a generic pipeline",
      "Customer conversations on WhatsApp never make it into any system",
    ],
    included: [
      { title: "Your data model", detail: "Records, fields, stages and relationships designed around your business, not a vendor's template." },
      { title: "Permissions", detail: "Who can see and change what, by team, region or role." },
      { title: "Integrations", detail: "Email, calendar, WhatsApp Business Platform, accounting and your website forms." },
      { title: "Automation", detail: "Follow-up reminders, assignment rules and notifications that remove manual chasing." },
      { title: "Data migration", detail: "Cleaning and importing records from spreadsheets or your current CRM, verified before switch-over." },
      { title: "Reporting", detail: "Dashboards built around the numbers your managers actually review." },
    ],
    process: [
      { title: "Process mapping", detail: "We sit with the people who use the CRM and map how deals and requests really move." },
      { title: "Design", detail: "Data model, screens and automation rules agreed before development." },
      { title: "Build and migrate", detail: "Iterative build with a trial import of your real data early on." },
      { title: "Roll out", detail: "Training, switch-over and support while the team adopts it." },
    ],
    faqs: [
      { question: "Is a custom CRM better than Salesforce, HubSpot or Zoho?", answer: "Not always. If a standard CRM fits your process, it is usually the cheaper choice and we will tell you so. A custom CRM makes sense when your process is distinctive, per-seat costs are high, or you need integrations and data ownership an off-the-shelf tool cannot give you." },
      { question: "Can the CRM connect to WhatsApp?", answer: "Yes, through the official WhatsApp Business Platform, so conversations, templates and opt-ins are handled properly and your number is not at risk of being banned." },
      { question: "Can you move our data from our current system?", answer: "Yes. We clean, map and import it, run a trial migration you can check, and only switch over once the numbers reconcile." },
    ],
    related: ["whatsapp-automation", "ai-automation", "custom-software-development"],
  },
  {
    slug: "ai-automation",
    category: "build",
    serviceId: "ai-automation",
    name: "AI automation",
    seoTitle: "AI Automation Services for Businesses in India",
    metaDescription:
      "AI automation services that remove repetitive work: document extraction, triage, summaries and routing, with human review where mistakes are costly.",
    h1: "AI automation for your team's repetitive work",
    intro: [
      "Most businesses do not need an AI strategy deck. They need the invoice data typed in automatically, the support inbox sorted, the reports summarised and the right request sent to the right person. We find the specific repetitive work costing your team hours, and automate it.",
      "We build AI automation with a human checkpoint wherever a wrong answer would be expensive, and with an evaluation set so quality is measured rather than assumed. As a team that also does security testing, we design what data an AI system can see and do before it goes live.",
    ],
    signs: [
      "Staff spend hours copying data between documents, emails and systems",
      "Requests pile up because someone has to read and route each one manually",
      "You tried an AI tool, but could not trust its output enough to rely on it",
      "You worry about sending customer data to AI services without controls",
    ],
    included: [
      { title: "Workflow audit", detail: "Where time actually goes, and which tasks are worth automating first." },
      { title: "Document extraction", detail: "Pulling structured data from invoices, forms, contracts and emails." },
      { title: "Triage and routing", detail: "Classifying incoming requests and sending them to the right queue or person." },
      { title: "Human-in-the-loop review", detail: "Approval steps where an error would be costly, with clear escalation." },
      { title: "Evaluation and monitoring", detail: "A test set measuring accuracy before launch, and tracking after it." },
      { title: "Data controls", detail: "Least-privilege access, redaction and logging for what the AI can see and do." },
    ],
    process: [
      { title: "Find the work", detail: "We measure the manual tasks and pick those with the clearest return." },
      { title: "Prototype and evaluate", detail: "A working prototype tested against real examples before any rollout." },
      { title: "Integrate", detail: "Connected to your email, documents, CRM or ERP with review steps in place." },
      { title: "Monitor and improve", detail: "Quality tracked over time, with the evaluation set growing from real cases." },
    ],
    faqs: [
      { question: "What business processes can AI automate?", answer: "Good candidates are repetitive, high-volume tasks with clear inputs: extracting data from documents, sorting and routing requests, drafting replies for review, summarising reports and updating records across systems. Decisions with serious consequences keep a person in the loop." },
      { question: "Is our data safe with AI automation?", answer: "We design for it. That means sending models only the data a task needs, choosing providers and settings that do not train on your data, redacting sensitive fields where possible, and logging what the system accessed." },
      { question: "How do we know the automation is accurate?", answer: "We build an evaluation set from your real examples and measure the system against it before launch. You see the results, and the same test runs whenever the system changes." },
    ],
    related: ["ai-chatbot-development", "whatsapp-automation", "ai-voice-assistant-development"],
  },
  {
    slug: "whatsapp-automation",
    category: "build",
    serviceId: "whatsapp-automation",
    name: "WhatsApp automation",
    seoTitle: "WhatsApp Business API Automation Services",
    metaDescription:
      "WhatsApp automation on the official WhatsApp Business Platform: notifications, bookings, order updates, chatbots and CRM integration, with handover to your team.",
    h1: "WhatsApp automation on the official API",
    intro: [
      "Your customers already read WhatsApp. Order updates, appointment reminders, payment links and support replies get seen there when emails do not. We automate those conversations so they happen instantly, at any hour, without someone watching an inbox.",
      "We build on the official WhatsApp Business Platform (WhatsApp Business API), not unofficial tools that break or get numbers banned. Automated flows hand over cleanly to a person when a customer needs one, and conversations can sync to your CRM.",
    ],
    signs: [
      "Your team answers the same WhatsApp questions dozens of times a day",
      "Customers miss appointments or payments because reminders are manual",
      "You use an unofficial WhatsApp tool and worry about your number being blocked",
      "WhatsApp conversations never reach your CRM or order system",
    ],
    included: [
      { title: "Business Platform setup", detail: "WhatsApp Business API onboarding, number verification and provider configuration." },
      { title: "Message templates", detail: "Template design and approval for notifications, reminders and marketing with proper opt-in." },
      { title: "Conversation flows", detail: "Bookings, order status, lead capture, FAQs and payment links." },
      { title: "Human handover", detail: "Clean escalation to your team, with the conversation history attached." },
      { title: "System integration", detail: "Connected to your CRM, booking system, e-commerce store or database." },
    ],
    process: [
      { title: "Map conversations", detail: "Which messages customers send and receive most, and which can be automated." },
      { title: "Design flows and templates", detail: "Scripts, templates and handover rules agreed with you, then submitted for approval." },
      { title: "Build and integrate", detail: "Flows connected to your systems and tested with real scenarios." },
      { title: "Launch and tune", detail: "Go live, then refine flows based on where customers drop off or ask for a person." },
    ],
    faqs: [
      { question: "Will using WhatsApp automation get our number banned?", answer: "Not when it is done properly. We use the official WhatsApp Business Platform, follow Meta's messaging and opt-in policies, and use approved templates for outbound messages. Bans usually come from unofficial tools and unsolicited bulk messaging." },
      { question: "Can a WhatsApp chatbot hand over to a real person?", answer: "Yes, and it should. We define when the bot steps aside — on request, on complex questions or when it is unsure — and pass the full conversation to your team so the customer does not have to repeat themselves." },
      { question: "Can WhatsApp connect to our CRM or website?", answer: "Yes. Leads and conversations can create or update CRM records, website forms can trigger WhatsApp confirmations, and order or booking systems can send updates automatically." },
    ],
    related: ["ai-chatbot-development", "custom-crm-development", "ai-automation"],
  },
  {
    slug: "ai-chatbot-development",
    category: "build",
    serviceId: "ai-chatbots",
    name: "AI chatbot development",
    seoTitle: "AI Chatbot Development Company in India",
    metaDescription:
      "Custom AI chatbot development trained on your own content. Accurate answers with sources, safe refusals and escalation, for websites, WhatsApp and internal teams.",
    h1: "AI chatbots that answer from your content",
    intro: [
      "A chatbot that confidently invents an answer is worse than no chatbot. We build AI chatbots grounded in your own documentation, policies and product information, which cite where an answer came from and say \"I don't know\" when the answer is not there.",
      "Chatbots can serve customers on your website or WhatsApp, or help your own team find answers in internal documents. Because we also do security testing, we test for prompt injection and data leakage before launch — the ways chatbots most often go wrong in public.",
    ],
    signs: [
      "Support handles the same questions that your documentation already answers",
      "Customers wait hours for replies outside business hours",
      "Staff waste time searching internal documents and policies",
      "You tried a generic chatbot and it gave wrong or embarrassing answers",
    ],
    included: [
      { title: "Grounded answers", detail: "Retrieval over your own content, with citations so answers can be checked." },
      { title: "Refusal and escalation", detail: "Defined behaviour for out-of-scope questions and handover to a person." },
      { title: "Channels", detail: "Website chat, WhatsApp, or internal tools your team already uses." },
      { title: "Security testing", detail: "Prompt-injection and data-leakage testing before the chatbot is public." },
      { title: "Quality review", detail: "Conversation logs, feedback and an evaluation set to track accuracy over time." },
    ],
    process: [
      { title: "Collect knowledge", detail: "Gather and clean the documents the chatbot should answer from." },
      { title: "Define behaviour", detail: "Tone, scope, refusals and escalation rules agreed up front." },
      { title: "Build and evaluate", detail: "Tested against real questions before any customer sees it." },
      { title: "Launch and review", detail: "Go live, review conversations, and improve the content and rules." },
    ],
    faqs: [
      { question: "How is this different from a basic chatbot builder?", answer: "Rule-based builders follow fixed scripts and fail on questions they were not scripted for. A generic AI bot answers anything, including wrongly. We build a chatbot that understands natural questions but answers only from your approved content, with sources and clear limits." },
      { question: "Can the chatbot use our private documents securely?", answer: "Yes. Access is restricted to the content the chatbot is meant to use, permissions can follow your existing roles for internal bots, and we test that it cannot be tricked into revealing information it should not." },
      { question: "Which AI models do you use?", answer: "We select from leading commercial and open models based on accuracy, cost, latency and data-handling terms for your use case, and design the system so the model can be changed later." },
    ],
    related: ["whatsapp-automation", "ai-voice-assistant-development", "ai-automation"],
  },
  {
    slug: "ai-voice-assistant-development",
    category: "build",
    serviceId: "ai-voice",
    name: "AI voice assistants",
    seoTitle: "AI Voice Agent Development for Businesses",
    metaDescription:
      "AI voice agents that answer calls, qualify leads, book appointments and hand complex calls to your team. Low-latency speech, telephony integration, transcripts.",
    h1: "AI voice agents that answer your calls",
    intro: [
      "Many business calls follow a script: booking an appointment, checking an order, qualifying a lead, confirming a callback. We build AI voice assistants that handle those calls naturally and quickly, and pass everything else to a person with a summary of the call.",
      "Speed is what makes a voice agent usable. We build low-latency speech pipelines that let callers interrupt and speak naturally, integrated with your phone system and recording every call with a transcript.",
    ],
    signs: [
      "Calls go unanswered outside office hours or at peak times",
      "Your team spends much of the day on repetitive booking or status calls",
      "Leads call once, reach nobody, and do not call back",
      "You need call records and transcripts but have none today",
    ],
    included: [
      { title: "Call flows", detail: "Inbound answering, lead qualification, bookings, reminders and callbacks." },
      { title: "Natural conversation", detail: "Low-latency responses and barge-in handling so callers can interrupt." },
      { title: "Telephony integration", detail: "Connected to your phone numbers or cloud telephony provider." },
      { title: "Handover to people", detail: "Transfers with context when a caller needs a human." },
      { title: "Records and transcripts", detail: "Recordings, transcripts and summaries synced to your CRM." },
    ],
    process: [
      { title: "Pick the calls", detail: "Identify the call types that are frequent and predictable enough to automate." },
      { title: "Script and rules", detail: "Conversation design, languages, and when to transfer to a person." },
      { title: "Build and test", detail: "Test calls with real scenarios, accents and interruptions before launch." },
      { title: "Go live and refine", detail: "Launch on a subset of calls, review transcripts, then expand." },
    ],
    faqs: [
      { question: "Can an AI voice assistant speak Hindi or Gujarati?", answer: "Support varies by language and speech provider. We test the languages your callers use before committing, and tell you honestly if quality is not good enough for production yet." },
      { question: "What happens when the AI cannot handle a call?", answer: "It transfers the caller to your team or schedules a callback, and passes along a summary so nobody has to start the conversation again." },
      { question: "Will callers know they are talking to an AI?", answer: "We recommend telling them. Being upfront builds trust and is increasingly expected by regulators and platforms, and a well-designed assistant does not need to pretend to be a person to be useful." },
    ],
    related: ["ai-chatbot-development", "whatsapp-automation", "custom-crm-development"],
  },
  {
    slug: "custom-software-development",
    category: "build",
    serviceId: "custom",
    name: "Custom software development",
    seoTitle: "Custom Software Development in Ahmedabad",
    metaDescription:
      "Custom software development in Ahmedabad: internal tools, admin systems, integrations and legacy migrations, built securely by Toad Labs and owned by you.",
    h1: "Custom software development for operations",
    intro: [
      "Some of the most valuable software in a business is not a product at all. It is the internal tool that replaced three spreadsheets, the integration that stopped staff re-typing orders, or the migration that moved a fragile legacy system somewhere safer. That is the work we do under custom software development.",
      "Toad Labs is a custom software development company in Ahmedabad. We start from how your team works today, build the smallest system that fixes the real problem, and make sure you own the code and can run it without us.",
    ],
    signs: [
      "Critical processes depend on spreadsheets, manual copying or one person's knowledge",
      "Your systems do not talk to each other",
      "A legacy application is slow, unsupported or a security worry",
      "No off-the-shelf product fits how your business operates",
    ],
    included: [
      { title: "Internal tools", detail: "Admin panels, dashboards and workflow tools built for the people using them." },
      { title: "Integrations", detail: "Connecting ERPs, CRMs, payment gateways, logistics and third-party APIs." },
      { title: "Legacy modernisation", detail: "Improving or replacing old systems in stages rather than one risky switch." },
      { title: "Data migration", detail: "Platform moves planned and rehearsed to avoid downtime and data loss." },
      { title: "Security by design", detail: "Access control, audit logging and a security review before launch." },
    ],
    process: [
      { title: "Understand the operation", detail: "Time with the people doing the work to find the real bottleneck." },
      { title: "Propose the smallest fix", detail: "A written scope that solves the problem without building more than needed." },
      { title: "Build iteratively", detail: "Usable releases early, adjusted with feedback from real users." },
      { title: "Hand over", detail: "Documentation, training and code ownership, with support if you want it." },
    ],
    faqs: [
      { question: "What does custom software development cost?", answer: "It depends on scope, integrations and how much existing software is involved. We scope before quoting. Where the boundary is clear you get a fixed price for a defined phase; where it is not, we say so instead of pricing a guess." },
      { question: "Can you work with our existing systems?", answer: "Yes. Most custom work involves connecting to or improving systems you already have. We review them first, and we do not recommend replacing something that only needs integrating." },
      { question: "Do we own the software you build?", answer: "Yes. The source code, repositories, cloud accounts and documentation belong to you from the start." },
    ],
    related: ["custom-crm-development", "ai-automation", "secure-code-review"],
  },

  /* ── Cybersecurity ─────────────────────────────────────────────────── */
  {
    slug: "vapt-services",
    category: "security",
    serviceId: "vapt",
    name: "VAPT services",
    seoTitle: "VAPT Services Company in Ahmedabad, India",
    metaDescription:
      "VAPT services in Ahmedabad and across India. Manual vulnerability assessment and penetration testing of web apps, APIs, networks and cloud, with retesting included.",
    h1: "VAPT services, tested by hand",
    intro: [
      "Vulnerability assessment and penetration testing (VAPT) shows you how an attacker would get into your systems, and what they could reach once inside. Automated scanners find known weaknesses; the findings that matter most usually need a tester who understands how your application and business actually work.",
      "Toad Labs is a VAPT company in Ahmedabad testing web applications, APIs, networks and cloud environments for clients across India and abroad. Every finding comes with proof, real-world impact, and a fix your developers can apply — then we retest to confirm it is closed.",
    ],
    signs: [
      "A client, bank, regulator or auditor has asked for a VAPT report",
      "You are launching a new application or a major release",
      "You have never had an independent security test",
      "Your last report was a scanner export your developers could not act on",
    ],
    included: [
      { title: "Vulnerability assessment", detail: "Broad automated and manual coverage of known weaknesses and misconfigurations." },
      { title: "Penetration testing", detail: "Manual exploitation to prove impact, including chained low-severity issues." },
      { title: "Web application and API testing", detail: "Authenticated testing for every user role, against the OWASP Top 10 and ASVS." },
      { title: "Network testing", detail: "External and internal infrastructure, exposed services and segmentation." },
      { title: "Actionable report", detail: "Executive summary, reproducible findings, severity, impact and fixes." },
      { title: "Retest", detail: "Verification that fixes work, with an updated report for your records." },
    ],
    process: [
      { title: "Scope and rules of engagement", detail: "Targets, testing windows, access and emergency contacts agreed in writing." },
      { title: "Assessment", detail: "Reconnaissance, scanning and manual review to map the attack surface." },
      { title: "Exploitation", detail: "Controlled testing to confirm what is really exploitable and what it exposes." },
      { title: "Report, fix, retest", detail: "Critical issues reported immediately, full report delivered, fixes verified." },
    ],
    faqs: [
      { question: "What is the difference between a vulnerability assessment and a penetration test?", answer: "A vulnerability assessment identifies and lists weaknesses across your systems. A penetration test goes further: it attempts to exploit them, as an attacker would, to prove what is actually reachable and how serious it is. VAPT combines both, giving you coverage and proof." },
      { question: "How much do VAPT services cost in India?", answer: "Cost depends on scope: the number of applications, user roles, API endpoints and IP addresses, and whether testing is black-box or authenticated. We scope before quoting, and a fixed price covers the agreed targets including a retest." },
      { question: "Do you provide a VAPT certificate?", answer: "We provide a detailed VAPT report and, after retesting, a letter confirming which findings have been verified as fixed. Be cautious of anyone selling a VAPT \"certificate\" without real testing — auditors and clients increasingly check the report behind it." },
      { question: "How often should we get VAPT done?", answer: "At least once a year, and after any significant change such as a major release, new infrastructure or an acquisition. Many regulators and enterprise customers also require an annual test." },
    ],
    related: ["penetration-testing", "cloud-security-assessment", "iso-27001-soc-2-readiness"],
  },
  {
    slug: "penetration-testing",
    category: "security",
    serviceId: "pentesting",
    name: "Penetration testing",
    seoTitle: "Web & Mobile App Penetration Testing Services",
    metaDescription:
      "Manual web application, API and mobile app penetration testing for iOS and Android, against OWASP ASVS and MASVS, with reproducible findings and fixes.",
    h1: "Web and mobile app penetration testing",
    intro: [
      "Application penetration testing looks for the ways a real attacker would abuse your web or mobile app: getting into another user's account, reading another customer's data, skipping a payment step or escalating their permissions. Those flaws live in business logic, which scanners cannot understand.",
      "Our testers also build production software, so findings arrive with the context developers need — steps to reproduce, the root cause and a fix that works in your framework. Testing is mapped to OWASP ASVS for web and OWASP MASVS for iOS and Android.",
    ],
    signs: [
      "Your app handles payments, health, financial or personal data",
      "You have multiple user roles or multiple customers sharing one platform",
      "An enterprise customer or app store review demands a pentest",
      "You rely on automated scans and have never had manual testing",
    ],
    included: [
      { title: "Authentication and sessions", detail: "Login, password reset, multi-factor, tokens and session handling." },
      { title: "Authorisation", detail: "Horizontal and vertical access control, including multi-tenant isolation." },
      { title: "Business logic", detail: "Workflow abuse, race conditions, payment and pricing manipulation." },
      { title: "API security", detail: "REST and GraphQL endpoints, including undocumented ones the app uses." },
      { title: "Mobile apps", detail: "iOS and Android local storage, transport security, reverse engineering and certificate pinning." },
    ],
    process: [
      { title: "Understand the app", detail: "Walk through roles, flows and data so testing targets what matters." },
      { title: "Test", detail: "Authenticated, manual testing of each role and flow, supported by tooling." },
      { title: "Report", detail: "Reproducible findings ranked by real impact, with remediation guidance." },
      { title: "Retest", detail: "Confirm fixes and close findings in an updated report." },
    ],
    faqs: [
      { question: "How long does a web application penetration test take?", answer: "It depends on the number of features, user roles and API endpoints. Small applications may take days; complex platforms take longer. We estimate effort during scoping so the timeline and price reflect your actual application." },
      { question: "Do you test in production or staging?", answer: "We prefer a staging environment that mirrors production. If production testing is necessary, we agree safe testing windows, rate limits and excluded techniques, and you have a direct contact throughout." },
      { question: "What is OWASP ASVS and MASVS?", answer: "They are public standards from the OWASP Foundation defining security requirements for web applications (ASVS) and mobile apps (MASVS). Testing against them gives measurable coverage instead of an informal checklist." },
    ],
    related: ["vapt-services", "secure-code-review", "security-audit"],
  },
  {
    slug: "security-audit",
    category: "security",
    serviceId: "audits",
    name: "Security audits",
    seoTitle: "Application Security Audit Services in India",
    metaDescription:
      "Application and infrastructure security audits mapped to OWASP ASVS and CIS Benchmarks: architecture, access control, secrets, logging and monitoring gaps.",
    h1: "Security audits with measured coverage",
    intro: [
      "A security audit reviews how your system is designed, built and operated, and compares it with a published standard. Where a penetration test asks \"can we break in?\", an audit asks \"are the right controls in place, everywhere they should be?\"",
      "We map our security audits to OWASP ASVS for applications and CIS Benchmarks for infrastructure, so you get coverage you can measure, show to a customer or auditor, and improve against over time.",
    ],
    signs: [
      "You need an independent view of your security posture for a board, investor or customer",
      "You are preparing for ISO 27001, SOC 2 or an enterprise security review",
      "Your system grew quickly and nobody has reviewed its design since",
      "You want to prioritise security spending based on evidence",
    ],
    included: [
      { title: "Architecture review", detail: "Trust boundaries, data flows and where sensitive data lives." },
      { title: "Control coverage", detail: "Your controls assessed against a chosen OWASP ASVS level." },
      { title: "Secrets and keys", detail: "How credentials, API keys and encryption keys are stored and rotated." },
      { title: "Logging and monitoring", detail: "Whether an attack would be detected, and who would be told." },
      { title: "Prioritised roadmap", detail: "Gaps ranked by risk, with practical remediation steps." },
    ],
    process: [
      { title: "Choose the standard", detail: "Agree the scope and verification level that fits your risk and customers." },
      { title: "Review", detail: "Documentation, configuration, code sampling and interviews with your team." },
      { title: "Measure", detail: "Each requirement marked met, partial or missing, with evidence." },
      { title: "Report and roadmap", detail: "Findings, coverage summary and a prioritised plan to close gaps." },
    ],
    faqs: [
      { question: "What is the difference between a security audit and VAPT?", answer: "VAPT actively attacks your systems to find exploitable weaknesses. A security audit reviews design, configuration and processes against a standard to find missing or weak controls. Many organisations use both: the audit for coverage, VAPT for proof." },
      { question: "Is a security audit the same as ISO 27001 certification?", answer: "No. ISO 27001 certification is issued by an accredited certification body after its own audit. Our security audit and readiness work helps you prepare, but we do not issue certificates." },
      { question: "What do we receive at the end of a security audit?", answer: "A report showing your coverage against the chosen standard, detailed findings with evidence, and a prioritised remediation roadmap you can share with stakeholders." },
    ],
    related: ["iso-27001-soc-2-readiness", "secure-code-review", "cloud-security-assessment"],
  },
  {
    slug: "secure-code-review",
    category: "security",
    serviceId: "code-review",
    name: "Secure code review",
    seoTitle: "Secure Code Review Services",
    metaDescription:
      "Manual secure source code review for access control flaws, injection, SSRF and supply-chain risks, with fixes written for your codebase by engineers who ship.",
    h1: "Secure code review, line by line",
    intro: [
      "Some of the most damaging vulnerabilities are nearly invisible from outside an application and obvious once you read its code: a missing ownership check that lets one customer load another's records, a hidden admin route, a secret committed to the repository. Secure code review finds them at the source.",
      "Our reviewers are working software engineers, so the output is practical: the exact lines at risk, why they are exploitable, and a fix that fits your framework and conventions — not a generic warning pasted from a tool.",
    ],
    signs: [
      "You are about to launch, raise funding or be acquired and need assurance",
      "Your application handles sensitive data or money",
      "You inherited a codebase from another team or vendor",
      "Static analysis tools produce so much noise that real issues are ignored",
    ],
    included: [
      { title: "Access control review", detail: "Every path that checks — or forgets to check — who can do what." },
      { title: "Injection and unsafe input", detail: "SQL and command injection, deserialisation, SSRF and template injection." },
      { title: "Secrets and configuration", detail: "Hard-coded credentials, weak cryptography and risky defaults." },
      { title: "Dependency review", detail: "Vulnerable libraries and supply-chain risk in your dependencies." },
      { title: "Tuned static analysis", detail: "Rules configured for your codebase, so future scans are signal, not noise." },
    ],
    process: [
      { title: "Threat model", detail: "Identify the sensitive data and high-risk code paths to review first." },
      { title: "Manual review", detail: "Line-by-line review of prioritised areas, supported by tooling." },
      { title: "Validate", detail: "Confirm findings are exploitable, not theoretical, where possible." },
      { title: "Report and pair", detail: "Findings with fixes, and a session with your developers to walk through them." },
    ],
    faqs: [
      { question: "Which languages and frameworks do you review?", answer: "Commonly TypeScript and JavaScript (Node.js, React, Next.js), Python, Java, PHP and Go, plus mobile code. Tell us your stack during scoping and we will confirm fit before starting." },
      { question: "Is code review better than penetration testing?", answer: "They find different things. Code review excels at access control and logic flaws hidden inside the code; penetration testing proves what is exploitable in the running system. For high-risk applications, combining them gives the strongest assurance." },
      { question: "Do you need full access to our source code?", answer: "We need read access to the code in scope. Access is on named accounts you control, and we return or delete all copies at the end of the engagement." },
    ],
    related: ["penetration-testing", "security-audit", "custom-software-development"],
  },
  {
    slug: "cloud-security-assessment",
    category: "security",
    serviceId: "cloud",
    name: "Cloud security assessment",
    seoTitle: "Cloud Security Assessment: AWS, Azure, GCP",
    metaDescription:
      "Cloud security posture assessment for AWS, Azure and Google Cloud: IAM, public exposure, encryption, backups and infrastructure-as-code, benchmarked against CIS.",
    h1: "Cloud security for AWS, Azure and GCP",
    intro: [
      "Most cloud breaches do not need advanced hacking. They come from an over-permissive access role, a storage bucket left public, or a default nobody changed after the first deployment went out under deadline. A cloud security assessment finds those gaps before someone else does.",
      "We review AWS, Microsoft Azure and Google Cloud environments against CIS Benchmarks, and include your infrastructure-as-code so fixes stay fixed on the next deployment.",
    ],
    signs: [
      "Your cloud setup grew quickly and permissions were never reviewed",
      "Several people or vendors have admin access to production",
      "You are unsure what is exposed to the internet",
      "A customer or auditor has asked about your cloud security controls",
    ],
    included: [
      { title: "Identity and access", detail: "IAM roles, policies, unused credentials and privilege creep." },
      { title: "Public exposure", detail: "Internet-facing services, storage buckets, databases and network segmentation." },
      { title: "Data protection", detail: "Encryption at rest and in transit, key management and backups." },
      { title: "Logging and detection", detail: "Audit logging, alerting and whether suspicious activity would be noticed." },
      { title: "Infrastructure as code", detail: "Terraform or similar templates reviewed so misconfigurations are fixed at source." },
    ],
    process: [
      { title: "Read-only access", detail: "A scoped, read-only role you create and can revoke at any time." },
      { title: "Automated benchmarking", detail: "Configuration checked against CIS Benchmarks for your provider." },
      { title: "Manual analysis", detail: "Attack paths and real exposure traced beyond the checklist." },
      { title: "Remediation plan", detail: "Prioritised fixes, with infrastructure-as-code changes where relevant." },
    ],
    faqs: [
      { question: "Which cloud providers do you assess?", answer: "Amazon Web Services (AWS), Microsoft Azure and Google Cloud Platform, including multi-cloud setups." },
      { question: "Will the assessment affect our running systems?", answer: "No. The configuration review uses read-only access and does not change anything. Any active testing of exposed services is agreed separately in the rules of engagement." },
      { question: "What are CIS Benchmarks?", answer: "Consensus-based configuration guidelines published by the Center for Internet Security for cloud providers, operating systems and services. They give a recognised baseline to measure your setup against." },
    ],
    related: ["vapt-services", "security-audit", "incident-response-readiness"],
  },
  {
    slug: "iso-27001-soc-2-readiness",
    category: "security",
    serviceId: "compliance",
    name: "ISO 27001 & SOC 2 readiness",
    seoTitle: "ISO 27001 & SOC 2 Readiness Consulting",
    metaDescription:
      "ISO 27001 and SOC 2 readiness support: gap analysis, control mapping, evidence and policy preparation, and help answering auditors and security questionnaires.",
    h1: "ISO 27001 and SOC 2 readiness",
    intro: [
      "Customers increasingly ask for ISO 27001 certification, a SOC 2 report or a completed security questionnaire before they sign. Getting ready means knowing where your gaps are, fixing them, and producing evidence an auditor will accept.",
      "We help you prepare. We run the gap analysis, map your controls, organise evidence, support policy documentation and answer the technical questions auditors and enterprise buyers ask. We are clear about one thing: certification is issued by an accredited certification body, not by us, and nobody honest can promise you a pass.",
    ],
    signs: [
      "A large customer requires ISO 27001 or SOC 2 before signing",
      "Security questionnaires are slowing down your sales cycle",
      "You have policies on paper but little evidence they are followed",
      "You have an audit date and do not know where your gaps are",
    ],
    included: [
      { title: "Gap analysis", detail: "Your current controls assessed against ISO 27001 Annex A or the SOC 2 criteria." },
      { title: "Control mapping", detail: "Existing practices mapped to requirements, so work is not duplicated." },
      { title: "Evidence preparation", detail: "Organising the records auditors expect to see." },
      { title: "Policy support", detail: "Help drafting and aligning policies with how you actually operate." },
      { title: "Technical controls", detail: "Testing and fixing the controls your framework depends on." },
      { title: "Questionnaire support", detail: "Accurate answers to enterprise security questionnaires." },
    ],
    process: [
      { title: "Choose the framework", detail: "Confirm what your customers need and the scope of certification." },
      { title: "Gap analysis", detail: "Measure where you stand and what is missing." },
      { title: "Remediate", detail: "Close gaps in controls, documentation and evidence." },
      { title: "Audit support", detail: "Prepare for the certification body's audit and answer technical questions." },
    ],
    faqs: [
      { question: "Can Toad Labs certify us for ISO 27001?", answer: "No. ISO 27001 certificates are issued only by accredited certification bodies after their own audit. We get you ready for that audit. Be wary of any consultant who offers to \"provide\" a certificate." },
      { question: "What is the difference between ISO 27001 and SOC 2?", answer: "ISO 27001 is an international standard for an information security management system, certified by an accredited body. SOC 2 is an attestation report issued by a licensed CPA firm, common with US customers. Which one you need usually depends on where your customers are." },
      { question: "How long does ISO 27001 readiness take?", answer: "It depends on your size, scope and how mature your current practices are. A gap analysis early on gives you a realistic timeline based on your actual situation rather than a generic estimate." },
    ],
    related: ["security-audit", "vapt-services", "incident-response-readiness"],
  },
  {
    slug: "incident-response-readiness",
    category: "security",
    serviceId: "incident-response",
    name: "Incident response readiness",
    seoTitle: "Incident Response Readiness & Tabletop Exercises",
    metaDescription:
      "Incident response readiness: runbooks, escalation paths, tabletop exercises and forensic-readiness reviews, aligned to NIST SP 800-61, before a breach happens.",
    h1: "Incident response readiness, before 2am",
    intro: [
      "When a security incident happens, the first hours decide how much damage it does. Teams without a plan lose time working out who is in charge, who to call, what to preserve and what to tell customers. Incident response readiness settles those questions in advance.",
      "We build response runbooks and escalation paths aligned to NIST SP 800-61, run tabletop exercises with your team, and check that your logging would actually give investigators the evidence they need.",
    ],
    signs: [
      "Nobody has written down what happens if you are breached",
      "Your logs would not show what an attacker accessed",
      "Customers, insurers or regulators ask for an incident response plan",
      "You have had an incident before and it was handled ad hoc",
    ],
    included: [
      { title: "Response runbooks", detail: "Step-by-step plans for the incidents most likely to affect you." },
      { title: "Roles and escalation", detail: "Who decides, who investigates, who communicates, and how to reach them." },
      { title: "Tabletop exercises", detail: "Realistic scenarios practised with your team to find gaps safely." },
      { title: "Forensic readiness", detail: "Logging and retention reviewed so evidence exists when you need it." },
      { title: "Post-incident review", detail: "A blameless process for learning from incidents and near misses." },
    ],
    process: [
      { title: "Assess", detail: "Review current plans, logging, contacts and obligations." },
      { title: "Plan", detail: "Write runbooks and escalation paths that fit your team and systems." },
      { title: "Exercise", detail: "Run a tabletop scenario and record what worked and what did not." },
      { title: "Improve", detail: "Update plans and controls based on the exercise." },
    ],
    faqs: [
      { question: "What is a tabletop exercise?", answer: "A guided discussion where your team works through a realistic incident scenario, such as ransomware or a data leak, step by step. It tests your plan and decision-making without touching live systems." },
      { question: "Do small companies need an incident response plan?", answer: "Yes. Smaller teams often have less time and fewer people to improvise with during an incident, so a short, practical plan matters even more. We scale the plan to your size." },
      { question: "Do you respond to active incidents?", answer: "If you are dealing with an active incident, contact us immediately and we will tell you straight away whether we can help or who is better placed to. Our core service is preparing you before an incident happens." },
    ],
    related: ["cloud-security-assessment", "security-audit", "vapt-services"],
  },
];

export const buildPages = servicePages.filter((page) => page.category === "build");
export const securityPages = servicePages.filter((page) => page.category === "security");

export function servicePagePath(page: Pick<ServicePage, "category" | "slug">): string {
  return `/${page.category === "build" ? "services" : "cybersecurity"}/${page.slug}`;
}

export function getServicePage(category: ServiceCategory, slug: string) {
  return servicePages.find((page) => page.category === category && page.slug === slug);
}

/** Detail page for a summary card id from services.ts or security.ts. */
export function pageForServiceId(serviceId: string) {
  return servicePages.find((page) => page.serviceId === serviceId);
}
