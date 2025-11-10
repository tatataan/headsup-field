import { Card } from "@/components/ui/card";
import { PercentageBadge } from "@/components/ui/percentage-badge";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  onClick?: () => void;
}

export const KPICard = ({ title, value, change, changeType, onClick }: KPICardProps) => {
  // Extract percentage from change string
  const percentageMatch = change.match(/([+-]?\d+\.?\d*)%/);
  const percentageValue = percentageMatch ? parseFloat(percentageMatch[1]) : 0;

  return (
    <Card 
      className="glass-effect p-6 hover:border-accent/50 transition-all duration-300 group cursor-pointer" 
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
          {percentageValue !== 0 && (
            <PercentageBadge value={percentageValue} />
          )}
        </div>
        <p className="text-4xl md:text-5xl font-bold text-foreground animate-count-up group-hover:text-accent transition-colors">
          {value}
        </p>
        <p className="text-sm text-muted-foreground">{change}</p>
      </div>
    </Card>
  );
};
