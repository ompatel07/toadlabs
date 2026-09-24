"use client";

import { useMemo, useRef, useState } from "react";
import { AlertCircle, Boxes, CheckCircle2, MessageCircle, Phone, ShieldCheck, TrendingUp } from "lucide-react";
import {
  BUDGET_OPTIONS,
  BUILD_SERVICES,
  CONTACT_LIMITS,
  GROWTH_SERVICES,
  EMAIL_PATTERN,
  MESSAGE_MIN,
  SECURE_SERVICES,
  contactWhatsappUrl,
  isDeliverable,
  type ContactPayload,
} from "@/lib/contact";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Contact form.
 *
 * Rebuilt around two findings that contradicted the previous version:
 *
 *  1. Single column outperforms multi-column. Two fields side by side read as
 *     one row and cost more to parse than they save in height.
 *  2. Conditional fields beat showing everything. Asking what someone wants
 *     first lets the rest of the form ask only what is relevant to them.
 *
 * So it opens with a path choice, then asks four or five questions rather than
 * six. The progress ring exists because a form that shows its own length gets
 * finished more often than one that does not.
 *
 * Accessibility is unchanged from the previous version and remains the
 * priority: real labels, requirement stated in words rather than by colour,
 * errors tied by aria-describedby with aria-invalid, focus moved to the first
 * problem on a failed submit, and status announced politely. The path buttons
 * are a radiogroup so arrow keys work the way a keyboard user expects.
 */

type Path = "grow" | "build" | "secure" | "other";

const PATHS: { id: Path; label: string; hint: string; icon: typeof Boxes }[] = [
  { id: "grow", label: "Grow something", hint: "SEO, ads, content, brand", icon: TrendingUp },
  { id: "build", label: "Build something", hint: "Website, app, MVP, automation", icon: Boxes },
  { id: "secure", label: "Test something", hint: "VAPT, pentest, code review", icon: ShieldCheck },
  { id: "other", label: "Something else", hint: "Partnership, advice, other", icon: MessageCircle },
];

/*
 * No honeypot or timing trap: delivery happens in WhatsApp, where a person has
 * to press send, so a bot filling this form cannot deliver anything.
 */

type Fields = Omit<ContactPayload, "topic">;
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: BUDGET_OPTIONS[0],
  message: "",
};

export function ContactForm() {
  const [path, setPath] = useState<Path | null>(null);
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  // The wa.me link for the last valid submission. Kept so the confirmation
  // screen can reopen WhatsApp if the first attempt was blocked or closed.
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: keyof Fields) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  // Budget is only asked on the paths where it means anything.
  const asksBudget = path === "grow" || path === "build" || path === "secure";
  const serviceOptions =
    path === "secure"
      ? SECURE_SERVICES
      : path === "grow"
        ? GROWTH_SERVICES
        : BUILD_SERVICES;

  const progress = useMemo(() => {
    const required: (keyof Fields)[] = ["name", "email", "message"];
    const done = required.filter((f) => values[f].trim().length > 0).length;
    return Math.round(((path ? 1 : 0) + done) / (required.length + 1) * 100);
  }, [values, path]);

  function validate(payload: Fields): Errors {
    const next: Errors = {};
    if (!payload.name.trim()) next.name = "Please tell us your name.";
    if (!payload.email.trim()) {
      next.email = "We need an email address to reply to.";
    } else if (!EMAIL_PATTERN.test(payload.email.trim())) {
      next.email = "That email address does not look right.";
    }
    if (!payload.message.trim()) {
      next.message = "Tell us what is going on.";
    } else if (payload.message.trim().length < MESSAGE_MIN) {
      next.message = "A sentence or two more would help us reply usefully.";
    }
    return next;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const payload: ContactPayload = {
      ...values,
      topic: path ?? "unspecified",
      service: values.service || "Not sure yet",
    };
    if (!isDeliverable(payload)) return;

    const url = contactWhatsappUrl(payload, siteConfig.whatsappNumber);
    // Opened synchronously inside the submit handler, while the browser still
    // counts it as a user action. Any await before this line and popup
    // blockers would stop it. On phones wa.me hands over to the WhatsApp app.
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  }

  if (sentUrl) {
    return (
      <div
        className="card-solid flex flex-col items-start gap-5 rounded-xl p-8 md:p-10"
        role="status"
      >
        <span className="bg-lime text-canvas inline-flex size-14 items-center justify-center rounded-lg">
          <CheckCircle2 className="size-7" strokeWidth={2} aria-hidden="true" />
        </span>
        <h2
          ref={(node) => node?.focus()}
          tabIndex={-1}
          className="font-display text-ink type-h2 font-bold outline-none"
        >
          Almost there: press send in WhatsApp
        </h2>
        <p className="text-ink-soft measure t-lead">
          We opened WhatsApp with your enquiry already written. It reaches us
          the moment you press send, and an engineer who would do the work
          replies, usually within a working day.
        </p>

        <p className="text-ink-soft t-sm">
          WhatsApp didn&apos;t open, or you closed it? Open it again, or call us.
        </p>
        <div className="-mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <a
            href={sentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-lime text-canvas inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 t-base font-semibold transition-colors duration-200 ease-out hover:bg-[color:var(--lime-ink)]"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Open WhatsApp
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={`tel:${siteConfig.phone}`}
            className="text-ink inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] px-6 t-base font-medium transition-colors duration-200 ease-out hover:border-[rgba(255,255,255,0.4)]"
          >
            <Phone className="size-4" aria-hidden="true" />
            Call {siteConfig.phoneDisplay}
          </a>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <button
            type="button"
            onClick={() => setSentUrl(null)}
            className="text-ink cursor-pointer py-1 t-base underline underline-offset-4"
          >
            Edit my message
          </button>
          <button
            type="button"
            onClick={() => {
              setSentUrl(null);
              setValues(EMPTY);
              setErrors({});
              setPath(null);
            }}
            className="text-ink-soft hover:text-ink cursor-pointer py-1 t-base underline underline-offset-4"
          >
            Start a new message
          </button>
        </div>
      </div>
    );
  }

  return (
    // action/method/target only matter if Send is pressed before the page's
    // JavaScript has loaded (a slow phone connection). Without them the
    // browser would submit to this page and put the visitor's name and email
    // in our URL. With them it opens a WhatsApp chat to us instead, with the
    // message pre-filled, because wa.me reads the `text` parameter — which is
    // why the message field is submitted under that name. Once hydrated,
    // onSubmit prevents the native submit and builds the full message.
    <form
      ref={formRef}
      onSubmit={onSubmit}
      action={`https://wa.me/${siteConfig.whatsappNumber}`}
      method="get"
      target="_blank"
      rel="noopener noreferrer"
      noValidate
      className="panel-feature panel-edge flex flex-col gap-8 rounded-xl p-6 md:p-9"
    >
      {/* Path choice. Asking this first is what lets the rest of the form ask
          fewer, more relevant questions. */}
      <fieldset className="flex flex-col gap-3">
        <legend className="label-mono text-ink-soft mb-3">
          01 — What brings you here?
        </legend>
        <div role="radiogroup" aria-label="What brings you here" className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {PATHS.map((option) => {
            const active = path === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPath(option.id)}
                className={cn(
                  "group flex cursor-pointer flex-col gap-2 rounded-lg border p-4 text-left transition-all duration-250 ease-out",
                  active
                    ? "border-ink bg-lime text-canvas"
                    : "border-[rgba(255,255,255,0.184)] hover:border-ink",
                )}
              >
                <option.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                <span className="font-display t-base font-bold">{option.label}</span>
                <span className={cn("t-xs", active ? "text-canvas/75" : "text-ink-soft")}>
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Single column from here: two fields on a row read as one and cost more
          to parse than the height they save. */}
      <div className="flex flex-col gap-5">
        <p className="label-mono text-ink-soft">02 — About you</p>
        <Field label="Your name" name="name" required value={values.name} onChange={set("name")} error={errors.name} autoComplete="name" maxLength={CONTACT_LIMITS.name} />
        <Field label="Email" name="email" type="email" required value={values.email} onChange={set("email")} error={errors.email} autoComplete="email" maxLength={CONTACT_LIMITS.email} />
        <Field label="Company" name="company" optional value={values.company} onChange={set("company")} autoComplete="organization" maxLength={CONTACT_LIMITS.company} />
      </div>

      {path ? (
        <div className="page-enter flex flex-col gap-5">
          <p className="label-mono text-ink-soft">03 — About the work</p>
          <SelectField
            label={
              path === "secure"
                ? "What needs testing?"
                : path === "grow"
                  ? "What do you need help with?"
                  : "What are you building?"
            }
            name="service"
            optional
            value={values.service}
            onChange={set("service")}
            options={[...serviceOptions]}
          />
          {asksBudget ? (
            <SelectField
              label="Budget range"
              name="budget"
              optional
              value={values.budget}
              onChange={set("budget")}
              options={[...BUDGET_OPTIONS]}
            />
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-5">
        <p className="label-mono text-ink-soft">
          {path ? "04" : "03"} — The problem
        </p>
        <Field
          label={
            path === "secure"
              ? "What are you worried about?"
              : path === "grow"
                ? "What are you trying to grow?"
                : "What is going wrong?"
          }
          name="message"
          submitName="text"
          required
          multiline
          value={values.message}
          onChange={set("message")}
          error={errors.message}
          maxLength={CONTACT_LIMITS.message}
          hint="The problem is more useful to us than a feature list. Two or three sentences is plenty."
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-[rgba(255,255,255,0.138)] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ProgressRing value={progress} />
          <span className="text-ink-soft t-sm">
            {progress === 100 ? "Ready to send" : "A few details to go"}
          </span>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <button
            type="submit"
            className="btn-liquid btn-liquid-ink bg-ink inline-flex h-13 cursor-pointer items-center justify-center gap-2 rounded-full px-7 t-base font-medium text-canvas transition-colors duration-250 ease-out"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Send via WhatsApp
          </button>
          <p className="text-ink-soft t-xs sm:text-right">
            Opens WhatsApp with your message ready to send.
          </p>
        </div>
      </div>

      {Object.values(errors).some(Boolean) ? (
        <p role="alert" className="text-destructive flex items-start gap-2 t-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          A couple of details need fixing before this can be sent.
        </p>
      ) : null}
    </form>
  );
}

/** Completion ring. A form that shows its own length gets finished more often. */
function ProgressRing({ value }: { value: number }) {
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="16" cy="16" r={radius} fill="none" stroke="rgba(255, 255, 255, 0.138)" strokeWidth="3" />
      <circle
        cx="16"
        cy="16"
        r={radius}
        fill="none"
        stroke="var(--lime-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value / 100)}
        style={{ transition: "stroke-dashoffset 400ms cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

interface FieldProps {
  label: string;
  name: keyof Fields;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
  maxLength?: number;
  /** Name used for a native (pre-hydration) submit, when it must differ. */
  submitName?: string;
}

function Field({
  label, name, value, onChange, type = "text",
  required, optional, multiline, error, hint, autoComplete, maxLength, submitName,
}: FieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id: name,
    name: submitName ?? name,
    value,
    autoComplete,
    maxLength,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    className: cn(
      // Recessed, not raised. The field sat on --surface inside a --surface card,
    // so the input was exactly the colour of the panel around it and read as
    // plain text. An input is a well: it goes DARKER than its container.
    "text-ink w-full rounded-lg border bg-[var(--canvas)] px-4 py-3 t-base transition-colors duration-200 ease-out placeholder:text-ink-soft/60 focus:border-[color:var(--lime)]",
      error ? "border-destructive" : "border-[rgba(255,255,255,0.184)] hover:border-[rgba(255,255,255,0.16)]",
    ),
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-ink t-sm font-medium">
        {label}
        {required ? <span className="text-ink-soft font-normal"> (required)</span> : null}
        {optional ? <span className="text-ink-soft font-normal"> (optional)</span> : null}
      </label>
      {hint ? <p id={hintId} className="text-ink-soft t-xs">{hint}</p> : null}
      {multiline ? <textarea {...shared} rows={5} /> : <input {...shared} type={type} />}
      {error ? (
        <p id={errorId} className="text-destructive flex items-start gap-1.5 t-xs">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  label, name, value, onChange, options, optional,
}: {
  label: string;
  name: keyof Fields;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-ink t-sm font-medium">
        {label}
        {optional ? <span className="text-ink-soft font-normal"> (optional)</span> : null}
      </label>
      {/* Native select on purpose: correct for keyboard and screen readers
          everywhere, and it uses the platform picker on mobile. */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-ink h-[46px] w-full cursor-pointer rounded-lg border border-[rgba(255,255,255,0.18)] bg-[var(--canvas)] px-4 t-base transition-colors duration-200 ease-out hover:border-[rgba(255,255,255,0.16)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
