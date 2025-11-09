import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "bg-accent text-accent-foreground shadow-lg glow-accent"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PillButton.displayName = "PillButton";
