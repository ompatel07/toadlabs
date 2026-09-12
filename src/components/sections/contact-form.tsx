"use client";

import { useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  submitContact,
  type ContactPayload,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

/**
 * Contact form.
 *
 * Accessibility is the priority here, so the details matter:
 *  - every field has a real <label>; placeholders are never the label
 *  - required is stated in the label text, not by colour or an asterisk alone
 *  - errors are text, tied by aria-describedby, with aria-invalid set
 *  - focus moves to the first invalid field on a failed submit
 *  - status is announced through a polite live region
 *  - the submit button stays focusable while busy rather than being disabled,
 *    which would drop focus and strand a keyboard user mid-form
 */

type Errors = Partial<Record<keyof ContactPayload, string>>;

const EMPTY: ContactPayload = {
  name: "",
  email: "",
  company: "",
  service: SERVICE_OPTIONS[0],
  budget: BUDGET_OPTIONS[0],
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "busy" | "sent" | "failed">(
    "idle",
  );
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: keyof ContactPayload) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  function validate(payload: ContactPayload): Errors {
    const next: Errors = {};
    if (!payload.name.trim()) next.name = "Please tell us your name.";
    if (!payload.email.trim()) {
      next.email = "We need an email address to reply to.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
      next.email = "That email address does not look right.";
    }
    if (!payload.message.trim()) {
      next.message = "Tell us a little about what you need.";
    } else if (payload.message.trim().length < 20) {
      next.message = "A sentence or two more would help us reply usefully.";
    }
    return next;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setStatus("idle");
      // Move focus to the first problem so it is not just announced but reached.
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    setStatus("busy");
    const result = await submitContact(values);
    if (result.ok) {
      setStatus("sent");
      setValues(EMPTY);
    } else {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="card-solid flex flex-col items-start gap-4 p-8"
        role="status"
      >
        <span className="bg-lime text-ink inline-flex size-12 items-center justify-center rounded-2xl">
          <CheckCircle2 className="size-6" strokeWidth={2} aria-hidden="true" />
        </span>
        <h2 className="font-display text-ink type-h3 font-bold">
          Thanks — that&apos;s with us
        </h2>
        <p className="text-ink-soft measure t-base">
          We read every enquiry ourselves and reply with either a time to talk
          or an honest note that we are not the right fit.
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
      className="card-solid flex flex-col gap-5 p-6 md:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your name"
          name="name"
          required
          value={values.name}
          onChange={set("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={set("email")}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <Field
        label="Company"
        name="company"
        optional
        value={values.company}
        onChange={set("company")}
        autoComplete="organization"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Service interest"
          name="service"
          value={values.service}
          onChange={set("service")}
          options={[...SERVICE_OPTIONS]}
        />
        <SelectField
          label="Budget range"
          name="budget"
          optional
          value={values.budget}
          onChange={set("budget")}
          options={[...BUDGET_OPTIONS]}
        />
      </div>

      <Field
        label="What do you need?"
        name="message"
        required
        multiline
        value={values.message}
        onChange={set("message")}
        error={errors.message}
        hint="The problem you're solving is more useful to us than a feature list."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          aria-busy={status === "busy"}
          className="bg-ink inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-7 t-base font-medium text-white transition-colors duration-250 ease-out hover:bg-[#242720] aria-busy:opacity-80"
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
        <p className="text-ink-soft t-xs">
          We reply personally. No newsletter, no drip sequence.
        </p>
      </div>

      {/* Announced politely rather than interrupting. */}
      <p role="status" aria-live="polite" className="sr-only">
        {status === "busy" ? "Sending your enquiry" : ""}
      </p>

      {status === "failed" ? (
        <p
          role="alert"
          className="text-destructive flex items-start gap-2 t-sm"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          That didn&apos;t send. Please email us directly and we&apos;ll pick it
          up.
        </p>
      ) : null}
    </form>
  );
}

interface FieldProps {
  label: string;
  name: keyof ContactPayload;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  optional,
  multiline,
  error,
  hint,
  autoComplete,
}: FieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id: name,
    name,
    value,
    autoComplete,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    className: cn(
      "w-full rounded-xl border bg-white px-4 py-3 t-base text-ink transition-colors duration-200 ease-out placeholder:text-ink-soft/60",
      error
        ? "border-destructive"
        : "border-[rgba(11,12,10,0.16)] hover:border-[rgba(11,12,10,0.3)]",
    ),
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-ink t-sm font-medium">
        {label}
        {/* Requirement is in the label text, not signalled by colour alone. */}
        {required ? (
          <span className="text-ink-soft font-normal"> (required)</span>
        ) : null}
        {optional ? (
          <span className="text-ink-soft font-normal"> (optional)</span>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="text-ink-soft t-xs">
          {hint}
        </p>
      ) : null}

      {multiline ? (
        <textarea {...shared} rows={5} />
      ) : (
        <input {...shared} type={type} />
      )}

      {error ? (
        <p
          id={errorId}
          className="text-destructive flex items-start gap-1.5 t-xs"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  optional,
}: {
  label: string;
  name: keyof ContactPayload;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-ink t-sm font-medium">
        {label}
        {optional ? (
          <span className="text-ink-soft font-normal"> (optional)</span>
        ) : null}
      </label>
      {/* A native select on purpose: it is keyboard and screen-reader correct
          everywhere, and uses the platform picker on mobile. */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-ink h-[46px] w-full cursor-pointer rounded-xl border border-[rgba(11,12,10,0.16)] bg-white px-4 t-base transition-colors duration-200 ease-out hover:border-[rgba(11,12,10,0.3)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
