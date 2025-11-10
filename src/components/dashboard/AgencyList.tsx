import { Card } from "@/components/ui/card";
import { Building2, TrendingUp, Info } from "lucide-react";
import { CircleButton } from "@/components/ui/circle-button";
import { BranchTrendModal } from "./BranchTrendModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface Branch {
  id: string;
  name: string;
  area: string;
  status: string;
  anp: string;
}

export const AgencyList = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  
  const branches: Branch[] = [
    { id: "1", name: "東京支社", area: "関東エリア", status: "良好", anp: "¥185.5M" },
    { id: "2", name: "大阪支社", area: "関西エリア", status: "注意", anp: "¥142.3M" },
    { id: "3", name: "名古屋支社", area: "中部エリア", status: "良好", anp: "¥98.7M" },
    { id: "4", name: "福岡支社", area: "九州エリア", status: "要対応", anp: "¥76.4M" },
    { id: "5", name: "仙台支社", area: "東北エリア", status: "注意", anp: "¥54.2M" },
    { id: "6", name: "札幌支社", area: "北海道エリア", status: "要対応", anp: "¥48.9M" },
  ];

  // サンプル月次データ（各支社用）
  const getMonthlyData = (branchId: string) => {
    const baseData = {
      "1": [
        { month: "1月", anp: 28.5, contractCount: 450 },
        { month: "2月", anp: 29.8, contractCount: 465 },
        { month: "3月", anp: 30.2, contractCount: 472 },
        { month: "4月", anp: 30.5, contractCount: 478 },
        { month: "5月", anp: 30.8, contractCount: 482 },
        { month: "6月", anp: 31.2, contractCount: 485 },
      ],
      "2": [
        { month: "1月", anp: 22.1, contractCount: 345 },
        { month: "2月", anp: 22.8, contractCount: 352 },
        { month: "3月", anp: 23.2, contractCount: 358 },
        { month: "4月", anp: 23.5, contractCount: 362 },
        { month: "5月", anp: 23.7, contractCount: 365 },
        { month: "6月", anp: 23.9, contractCount: 368 },
      ],
      "3": [
        { month: "1月", anp: 15.2, contractCount: 252 },
        { month: "2月", anp: 15.8, contractCount: 258 },
        { month: "3月", anp: 16.1, contractCount: 262 },
        { month: "4月", anp: 16.3, contractCount: 265 },
        { month: "5月", anp: 16.5, contractCount: 268 },
        { month: "6月", anp: 16.8, contractCount: 270 },
      ],
      "4": [
        { month: "1月", anp: 11.8, contractCount: 195 },
        { month: "2月", anp: 12.2, contractCount: 200 },
        { month: "3月", anp: 12.5, contractCount: 203 },
        { month: "4月", anp: 12.7, contractCount: 206 },
        { month: "5月", anp: 12.9, contractCount: 208 },
        { month: "6月", anp: 13.1, contractCount: 210 },
      ],
      "5": [
        { month: "1月", anp: 8.5, contractCount: 142 },
        { month: "2月", anp: 8.8, contractCount: 145 },
        { month: "3月", anp: 9.0, contractCount: 148 },
        { month: "4月", anp: 9.1, contractCount: 150 },
        { month: "5月", anp: 9.2, contractCount: 152 },
        { month: "6月", anp: 9.4, contractCount: 153 },
      ],
      "6": [
        { month: "1月", anp: 7.8, contractCount: 125 },
        { month: "2月", anp: 8.0, contractCount: 128 },
        { month: "3月", anp: 8.1, contractCount: 130 },
        { month: "4月", anp: 8.2, contractCount: 131 },
        { month: "5月", anp: 8.3, contractCount: 132 },
        { month: "6月", anp: 8.4, contractCount: 133 },
      ],
    };
    return baseData[branchId as keyof typeof baseData] || [];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "良好":
        return "text-success";
      case "注意":
        return "text-warning";
      case "要対応":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "良好":
        return "達成率100%以上。目標を順調に達成しています。";
      case "注意":
        return "達成率90-99%。目標達成まであと僅かです。";
      case "要対応":
        return "達成率90%未満。早急な対応が必要です。";
      default:
        return "";
    }
  };

  return (
    <Card className="glass-effect p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Building2 className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">支社一覧</h3>
        </div>
        <span className="text-sm text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
          {branches.length}支社
        </span>
      </div>

      {/* ステータス定義の説明 */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p><span className="text-success font-semibold">良好</span>: 達成率100%以上 | <span className="text-warning font-semibold">注意</span>: 達成率90-99% | <span className="text-destructive font-semibold">要対応</span>: 達成率90%未満</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {branches.map((branch, index) => (
          <TooltipProvider key={branch.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200 group cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {branch.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className={getStatusColor(branch.status)}>
                        ● {branch.status}
                      </span>
                      {" • "}{branch.area}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-base font-semibold text-foreground">{branch.anp}</p>
                      <p className="text-xs text-muted-foreground">今月ANP</p>
                    </div>
                    <CircleButton 
                      size="sm" 
                      onClick={() => setSelectedBranch(branch)}
                    >
                      <TrendingUp className="w-4 h-4" />
                    </CircleButton>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="font-semibold mb-1">{branch.name}</p>
                <p className="text-sm">{getStatusDescription(branch.status)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <BranchTrendModal
        open={selectedBranch !== null}
        onOpenChange={(open) => !open && setSelectedBranch(null)}
        branchName={selectedBranch?.name || ""}
        monthlyData={selectedBranch ? getMonthlyData(selectedBranch.id) : []}
      />
    </Card>
  );
};
