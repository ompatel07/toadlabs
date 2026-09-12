import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Brand actions. Everything is a pill.
 *
 * Ink is the primary action colour; lime is the highlight, used for the one
 * action per screen that should catch the eye. Contrast is verified in the
 * audit script, not assumed.
 */
const actionVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-250 ease-out disabled:pointer-events-none disabled:opacity-55 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Solid black pill. The default call to action. */
        primary: "btn-liquid btn-liquid-ink bg-ink text-white",
        /** Lime pill with ink text — the highlight action. */
        lime: "btn-liquid btn-liquid-lime bg-lime text-ink",
        /** Quiet pill on the canvas. */
        ghost:
          "border border-[rgba(11,12,10,0.14)] bg-transparent text-ink hover:border-[rgba(11,12,10,0.3)] hover:bg-white/60",
        /** White pill, for use on top of imagery or dark slabs. */
        white: "bg-white text-ink hover:bg-white/90",
        /** Outline pill on a dark slab. */
        onDark:
          "border border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10",
        /** Inline text action. */
        text: "rounded-sm text-ink underline decoration-1 underline-offset-4 hover:decoration-2",
      },
      size: {
        /** 44px — minimum comfortable tap target. */
        default: "h-11 px-5 t-base",
        lg: "h-13 px-7 text-base",
        sm: "h-9 px-4 text-sm",
        inline: "h-auto p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type ActionVariants = VariantProps<typeof actionVariants>;

interface ActionLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">,
    ActionVariants {
  className?: string;
}

export function ActionLink({
  variant,
  size,
  className,
  ...props
}: ActionLinkProps) {
  return (
    <Link
      className={cn(actionVariants({ variant, size }), className)}
      {...props}
    />
  );
}

interface ActionButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    ActionVariants {}

export function ActionButton({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(actionVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { actionVariants };
