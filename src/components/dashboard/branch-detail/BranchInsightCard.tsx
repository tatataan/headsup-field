import { Card } from "@/components/ui/card";
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Target } from "lucide-react";

interface BranchInsightCardProps {
  title: string;
  insights: string[];
  recommendation: string;
  status?: "positive" | "warning" | "neutral";
}

export const BranchInsightCard = ({ 
  title, 
  insights, 
  recommendation, 
  status = "neutral" 
}: BranchInsightCardProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "positive":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Target className="w-4 h-4 text-accent" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "positive":
        return "border-success/20 bg-success/5";
      case "warning":
        return "border-warning/20 bg-warning/5";
      default:
        return "border-accent/20 bg-accent/5";
    }
  };

  return (
    <Card className={`p-4 border ${getStatusColor()} animate-fade-in`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-accent/20 rounded-lg">
          <Brain className="w-4 h-4 text-accent" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <Sparkles className="w-3 h-3 text-accent ml-auto" />
      </div>
      
      <div className="space-y-2 mb-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2">
            <TrendingUp className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
      
      <div className={`p-3 border rounded-lg ${getStatusColor()}`}>
        <div className="flex items-start gap-2">
          {getStatusIcon()}
          <div>
            <p className="text-xs font-medium text-foreground mb-1">推奨アクション</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{recommendation}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
