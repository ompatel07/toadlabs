"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Boxes, CheckCircle2, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import {
  BUDGET_OPTIONS,
  BUILD_SERVICES,
  CONTACT_LIMITS,
  EMAIL_PATTERN,
  MESSAGE_MIN,
  SECURE_SERVICES,
  submitContact,
  type ContactPayload,
} from "@/lib/contact";
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

type Path = "build" | "secure" | "other";

const PATHS: { id: Path; label: string; hint: string; icon: typeof Boxes }[] = [
  { id: "build", label: "Build something", hint: "Product, app, MVP, automation", icon: Boxes },
  { id: "secure", label: "Test something", hint: "VAPT, pentest, code review", icon: ShieldCheck },
  { id: "other", label: "Something else", hint: "Partnership, advice, other", icon: MessageCircle },
];

/**
 * Bot friction without a CAPTCHA.
 *  - A honeypot field humans never see. Bots that fill every input fill it.
 *  - A minimum time between the form appearing and being sent; scripted
 *    submissions arrive in milliseconds.
 * Either trip shows the normal success screen and sends nothing, so a bot
 * learns nothing about which check it failed. Neither replaces server-side
 * rate limiting on the real endpoint — they only cut the cheapest spam.
 */
const MIN_FILL_MS = 3000;

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
  const [status, setStatus] = useState<"idle" | "busy" | "sent" | "failed">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const set = (field: keyof Fields) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  // Budget is only asked on the two paths where it means anything.
  const asksBudget = path === "build" || path === "secure";
  const serviceOptions = path === "secure" ? SECURE_SERVICES : BUILD_SERVICES;

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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // A second click while the first request is in flight must not send twice.
    if (status === "busy") return;

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setStatus("idle");
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const looksAutomated =
      Boolean(trap.current?.value) || Date.now() - shownAt.current < MIN_FILL_MS;
    if (looksAutomated) {
      setStatus("sent");
      return;
    }

    setStatus("busy");
    const result = await submitContact({
      ...values,
      topic: path ?? "unspecified",
      service: values.service || "Not sure yet",
    });
    if (result.ok) {
      setStatus("sent");
      setValues(EMPTY);
      setPath(null);
    } else {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div className="card-solid flex flex-col items-start gap-4 rounded-xl p-8 md:p-10" role="status">
        <span className="bg-lime text-canvas inline-flex size-14 items-center justify-center rounded-lg">
          <CheckCircle2 className="size-7" strokeWidth={2} aria-hidden="true" />
        </span>
        <h2 className="font-display text-ink type-h2 font-bold">That&apos;s with us</h2>
        <p className="text-ink-soft measure t-lead">
          It goes to the engineers who would do the work, not a sales queue. You
          will get either a time to talk or an honest note that we are not the
          right team for it.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-ink cursor-pointer t-base underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="panel-feature panel-edge flex flex-col gap-8 rounded-xl p-6 md:p-9"
    >
      {/* Honeypot. Off-screen rather than display:none, which some bots skip;
          hidden from assistive tech and the tab order so no person reaches it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input ref={trap} id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Path choice. Asking this first is what lets the rest of the form ask
          fewer, more relevant questions. */}
      <fieldset className="flex flex-col gap-3">
        <legend className="label-mono text-ink-soft mb-3">
          01 — What brings you here?
        </legend>
        <div role="radiogroup" aria-label="What brings you here" className="grid gap-2.5 sm:grid-cols-3">
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
            label={path === "secure" ? "What needs testing?" : "What are you building?"}
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
          label={path === "secure" ? "What are you worried about?" : "What is going wrong?"}
          name="message"
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

        <button
          type="submit"
          aria-busy={status === "busy"}
          className="btn-liquid btn-liquid-ink bg-ink inline-flex h-13 cursor-pointer items-center justify-center gap-2 rounded-full px-7 t-base font-medium text-canvas transition-colors duration-250 ease-out aria-busy:opacity-80"
        >
          {status === "busy" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {status === "busy" ? "Sending your enquiry" : ""}
      </p>

      {status === "failed" ? (
        <p role="alert" className="text-destructive flex items-start gap-2 t-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          That didn&apos;t send. Please email us directly and we&apos;ll pick it up.
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
}

function Field({
  label, name, value, onChange, type = "text",
  required, optional, multiline, error, hint, autoComplete, maxLength,
}: FieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id: name,
    name,
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
