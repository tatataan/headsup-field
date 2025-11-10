import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings2 } from "lucide-react";

export interface DashboardConfig {
  showKPIs: boolean;
  showMonthlyTrend: boolean;
  showProductComposition: boolean;
  showRegionalHeatmap: boolean;
  showAgencyRanking: boolean;
  showActivityScatter: boolean;
  showPredictiveTrend: boolean;
  showAIInsights: boolean;
  showAgencyList: boolean;
}

interface DashboardCustomizerProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

export const DashboardCustomizer = ({ config, onConfigChange }: DashboardCustomizerProps) => {
  const updateConfig = (key: keyof DashboardConfig, value: boolean) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          カスタマイズ
        </Button>
      </SheetTrigger>
      <SheetContent className="glass-effect w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="gradient-text">ダッシュボードのカスタマイズ</SheetTitle>
          <SheetDescription>
            表示するウィジェットを選択してください
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">基本指標</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="kpis" className="text-sm">KPIカード</Label>
              <Switch
                id="kpis"
                checked={config.showKPIs}
                onCheckedChange={(checked) => updateConfig('showKPIs', checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">トレンド分析</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="monthly-trend" className="text-sm">月次推移</Label>
              <Switch
                id="monthly-trend"
                checked={config.showMonthlyTrend}
                onCheckedChange={(checked) => updateConfig('showMonthlyTrend', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="predictive-trend" className="text-sm">予測トレンド</Label>
              <Switch
                id="predictive-trend"
                checked={config.showPredictiveTrend}
                onCheckedChange={(checked) => updateConfig('showPredictiveTrend', checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">詳細分析</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="product-composition" className="text-sm">商品構成比</Label>
              <Switch
                id="product-composition"
                checked={config.showProductComposition}
                onCheckedChange={(checked) => updateConfig('showProductComposition', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="regional-heatmap" className="text-sm">地域別ヒートマップ</Label>
              <Switch
                id="regional-heatmap"
                checked={config.showRegionalHeatmap}
                onCheckedChange={(checked) => updateConfig('showRegionalHeatmap', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="agency-ranking" className="text-sm">代理店ランキング</Label>
              <Switch
                id="agency-ranking"
                checked={config.showAgencyRanking}
                onCheckedChange={(checked) => updateConfig('showAgencyRanking', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="activity-scatter" className="text-sm">活動量vs成果分析</Label>
              <Switch
                id="activity-scatter"
                checked={config.showActivityScatter}
                onCheckedChange={(checked) => updateConfig('showActivityScatter', checked)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">インサイト</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-insights" className="text-sm">AIインサイト</Label>
              <Switch
                id="ai-insights"
                checked={config.showAIInsights}
                onCheckedChange={(checked) => updateConfig('showAIInsights', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="agency-list" className="text-sm">課題代理店リスト</Label>
              <Switch
                id="agency-list"
                checked={config.showAgencyList}
                onCheckedChange={(checked) => updateConfig('showAgencyList', checked)}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};