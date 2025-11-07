import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export const KPICard = ({ title, value, change, changeType, icon: Icon }: KPICardProps) => {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          <p className={`text-sm font-medium ${changeColor}`}>{change}</p>
        </div>
        <div className="p-3 bg-accent rounded-lg">
          <Icon className="w-6 h-6 text-accent-foreground" />
        </div>
      </div>
    </Card>
  );
};
