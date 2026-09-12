import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-medium transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-comet disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-comet text-cream hover:bg-comet-deep",
        night: "bg-night text-cream hover:bg-night-2",
        cream: "bg-cream text-ink border border-line hover:bg-paper-2",
        ghost: "bg-transparent text-ink hover:bg-paper-2",
        nightGhost: "bg-white/8 text-cream hover:bg-white/14 border border-white/10",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
