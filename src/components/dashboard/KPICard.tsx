import { Card } from "@/components/ui/card";
import { PercentageBadge } from "@/components/ui/percentage-badge";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  onClick?: () => void;
  applyColorToValue?: boolean;
}

export const KPICard = ({ title, value, change, changeType, onClick, applyColorToValue = false }: KPICardProps) => {
  // Extract percentage from change string
  const percentageMatch = change.match(/([+-]?\d+\.?\d*)%/);
  const percentageValue = percentageMatch ? parseFloat(percentageMatch[1]) : 0;

  const getValueColor = () => {
    if (!applyColorToValue) return "text-foreground";
    if (changeType === "positive") return "text-success";
    if (changeType === "neutral") return "text-warning";
    if (changeType === "negative") return "text-destructive";
    return "text-foreground";
  };

  return (
    <Card 
      className={`glass-effect p-6 hover:border-accent/50 transition-all duration-300 group ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
          {percentageValue !== 0 && (
            <PercentageBadge value={percentageValue} />
          )}
        </div>
        <p className={`text-4xl md:text-5xl font-bold ${getValueColor()} animate-count-up group-hover:text-accent transition-colors`}>
          {value}
        </p>
        {change && <p className="text-sm text-muted-foreground">{change}</p>}
      </div>
    </Card>
  );
};
