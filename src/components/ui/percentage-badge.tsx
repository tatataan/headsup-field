import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PercentageBadgeProps {
  value: number;
  className?: string;
}

export const PercentageBadge = ({ value, className }: PercentageBadgeProps) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        isPositive && "bg-success/20 text-success",
        isNegative && "bg-destructive/20 text-destructive",
        !isPositive && !isNegative && "bg-muted text-muted-foreground",
        className
      )}
    >
      {isPositive && <TrendingUp className="w-3 h-3" />}
      {isNegative && <TrendingDown className="w-3 h-3" />}
      <span>{isPositive ? "+" : ""}{value.toFixed(1)}%</span>
    </div>
  );
};
