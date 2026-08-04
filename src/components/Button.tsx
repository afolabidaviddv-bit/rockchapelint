import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:shadow-lift",
        gold: "bg-gold text-navy shadow-soft hover:-translate-y-0.5 hover:shadow-gold",
        outline:
          "border border-navy/20 bg-transparent text-foreground hover:border-gold hover:text-navy hover:-translate-y-0.5",
        ghost: "text-foreground hover:bg-muted",
        onDark:
          "border border-primary-foreground/25 text-primary-foreground hover:border-gold hover:text-gold hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
