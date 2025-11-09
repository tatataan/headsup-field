import { Card } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import { BarChartCustom } from "@/components/ui/bar-chart-custom";

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
    <Card className="glass-effect p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-accent/20 rounded-lg">
          <Brain className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">AIによるチャネル課題サマリー</h3>
        <Sparkles className="w-4 h-4 text-accent ml-auto" />
      </div>
      
      <div className="space-y-6">
        {insights.map((insight) => (
          <div key={insight.label} className="group">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                {insight.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {insight.count}/{insight.total} 代理店
              </span>
            </div>
            <BarChartCustom 
              data={[
                { value: insight.percentage },
                { value: 100 - insight.percentage }
              ]}
              maxValue={100}
              height={40}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-xl">
        <p className="text-sm text-foreground">
          <strong className="text-accent">推奨アクション：</strong> 事業承継の未着手代理店に対して、税理士連携セミナーの案内を配信することを推奨します。
        </p>
      </div>
    </Card>
  );
};
