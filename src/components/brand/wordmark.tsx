import { cn } from "@/lib/utils";

/** Compact geometric mark plus wordmark. Abstract by choice — no mascot. */
export function Wordmark({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-center gap-2 t-base font-700 whitespace-nowrap",
        onDark ? "text-ink" : "text-ink",
        className,
      )}
      style={{ fontWeight: 700 }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-[7px]",
          onDark ? "bg-[var(--surface)]" : "bg-ink",
        )}
      >
        <span className="bg-lime block size-2 rounded-full" />
      </span>
      Toad Labs
    </span>
  );
}
