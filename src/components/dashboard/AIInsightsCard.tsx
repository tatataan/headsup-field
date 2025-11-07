import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InsightItem {
  label: string;
  count: number;
  total: number;
  percentage: number;
}

export const AIInsightsCard = () => {
  const insights: InsightItem[] = [
    { label: "事業承継：未着手", count: 2, total: 5, percentage: 40 },
    { label: "人材育成：スキル不足", count: 3, total: 5, percentage: 60 },
    { label: "業務効率化：システム未導入", count: 1, total: 5, percentage: 20 },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">AIによるチャネル課題サマリー</h3>
      </div>
      
      <div className="space-y-6">
        {insights.map((insight) => (
          <div key={insight.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">{insight.label}</span>
              <span className="text-sm text-muted-foreground">
                {insight.count}/{insight.total} 代理店
              </span>
            </div>
            <Progress value={insight.percentage} className="h-2" />
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-accent rounded-lg">
        <p className="text-sm text-accent-foreground">
          <strong>推奨アクション：</strong> 事業承継の未着手代理店に対して、税理士連携セミナーの案内を配信することを推奨します。
        </p>
      </div>
    </Card>
  );
};
