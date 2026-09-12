import { cn } from "@/lib/utils";

type SectionSurface = "canvas" | "white";

interface SectionProps extends React.ComponentPropsWithoutRef<"section"> {
  surface?: SectionSurface;
  /** Tighter vertical rhythm — used by the denser pages. */
  dense?: boolean;
  contained?: boolean;
}

const surfaceClass: Record<SectionSurface, string> = {
  canvas: "bg-canvas",
  white: "bg-white",
};

export function Section({
  surface = "canvas",
  dense = false,
  contained = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        surfaceClass[surface],
        dense ? "section-dense" : "section",
        className,
      )}
      {...props}
    >
      {contained ? <div className="container-tl">{children}</div> : children}
    </section>
  );
}

/** Small uppercase mono label that sits above a section heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("label-mono text-ink-soft", className)}>{children}</p>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
  onDark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  align = "left",
  className,
  onDark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn("label-mono", onDark ? "text-lime" : "text-ink-soft")}>
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={cn("type-h2", onDark ? "text-white" : "text-ink")}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "measure t-lead",
            onDark ? "text-white/70" : "text-ink-soft",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
