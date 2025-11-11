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
  showDepartmentCharts: boolean;
  showDepartmentList: boolean;
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
            <h4 className="text-sm font-semibold text-foreground">表示項目</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="kpis" className="text-sm">全社KPIカード</Label>
              <Switch
                id="kpis"
                checked={config.showKPIs}
                onCheckedChange={(checked) => updateConfig('showKPIs', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="dept-charts" className="text-sm">統括部別グラフ</Label>
              <Switch
                id="dept-charts"
                checked={config.showDepartmentCharts}
                onCheckedChange={(checked) => updateConfig('showDepartmentCharts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="dept-list" className="text-sm">統括部リスト</Label>
              <Switch
                id="dept-list"
                checked={config.showDepartmentList}
                onCheckedChange={(checked) => updateConfig('showDepartmentList', checked)}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};