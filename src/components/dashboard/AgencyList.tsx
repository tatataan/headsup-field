import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleButton } from "@/components/ui/circle-button";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { BranchDetailModal } from "./branch-detail/BranchDetailModal";
import { BranchDetailData } from "@/types/branch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Branch {
  id: string;
  name: string;
  area: string;
  status: string;
  anp: number;
}

export const AgencyList = () => {
  const [selectedBranch, setSelectedBranch] = useState<BranchDetailData | null>(null);

  const branches: Branch[] = [
    { id: "1", name: "東京第一支社", area: "東京", status: "excellent", anp: 185.5 },
    { id: "2", name: "大阪支社", area: "大阪", status: "good", anp: 156.2 },
    { id: "3", name: "名古屋支社", area: "愛知", status: "attention", anp: 98.7 },
    { id: "4", name: "福岡支社", area: "福岡", status: "good", anp: 145.3 },
    { id: "5", name: "札幌支社", area: "北海道", status: "excellent", anp: 122.8 },
    { id: "6", name: "仙台支社", area: "宮城", status: "attention", anp: 87.5 },
  ];

  const getBranchDetailData = (branchId: string): BranchDetailData => {
    const branch = branches.find((b) => b.id === branchId)!;
    
    // KPIデータ
    const kpi = {
      newANP: {
        plan: branch.anp / 1.08,
        actual: branch.anp,
        achievementRate: 108,
      },
      newContractCount: {
        plan: Math.floor(branch.anp * 12.8),
        actual: Math.floor(branch.anp * 13.2),
        achievementRate: 103,
      },
      continuationRate: {
        plan: 95.0,
        actual: 96.5,
        achievementRate: 101.6,
      },
      activeAgents: Math.floor(branch.anp / 4.5),
      totalAgents: Math.floor(branch.anp / 4.1),
    };

    // 月次データ
    const contractCount = kpi.newContractCount.actual;
    const monthlyData = [
      { month: "10月", anp: branch.anp * 0.85, contractCount: contractCount * 0.85 },
      { month: "11月", anp: branch.anp * 0.88, contractCount: contractCount * 0.88 },
      { month: "12月", anp: branch.anp * 0.91, contractCount: contractCount * 0.91 },
      { month: "1月", anp: branch.anp * 0.94, contractCount: contractCount * 0.94 },
      { month: "2月", anp: branch.anp * 0.97, contractCount: contractCount * 0.97 },
      { month: "3月", anp: branch.anp, contractCount: contractCount },
    ];

    // エージェントデータ
    const agents = Array.from({ length: 8 }, (_, i) => ({
      id: `agent-${i + 1}`,
      name: `エージェント ${String.fromCharCode(65 + i)}`,
      anp: Number((branch.anp / 8 * (1 + (Math.random() - 0.5) * 0.4)).toFixed(1)),
      contractCount: Math.floor(contractCount / 8 * (1 + (Math.random() - 0.5) * 0.4)),
      achievementRate: Math.floor(90 + Math.random() * 25),
      trend: monthlyData.map((m) => ({
        month: m.month,
        anp: Number((branch.anp / 8 * (1 + (Math.random() - 0.5) * 0.4) * (monthlyData.indexOf(m) + 1) / 6).toFixed(1)),
      })),
    })).sort((a, b) => b.achievementRate - a.achievementRate);

    // 商品データ
    const productMix = [
      {
        productName: "終身保険",
        anp: Number((branch.anp * 0.35).toFixed(1)),
        contractCount: Math.floor(contractCount * 0.30),
        avgContractValue: Number((branch.anp * 0.35 / (contractCount * 0.30)).toFixed(2)),
        previousMonthAnp: Number((branch.anp * 0.34).toFixed(1)),
        trend: monthlyData.map((m) => ({
          month: m.month,
          anp: Number((m.anp * 0.35).toFixed(1)),
          contractCount: Math.floor(m.contractCount * 0.30),
        })),
      },
      {
        productName: "医療保険",
        anp: Number((branch.anp * 0.28).toFixed(1)),
        contractCount: Math.floor(contractCount * 0.35),
        avgContractValue: Number((branch.anp * 0.28 / (contractCount * 0.35)).toFixed(2)),
        previousMonthAnp: Number((branch.anp * 0.27).toFixed(1)),
        trend: monthlyData.map((m) => ({
          month: m.month,
          anp: Number((m.anp * 0.28).toFixed(1)),
          contractCount: Math.floor(m.contractCount * 0.35),
        })),
      },
      {
        productName: "がん保険",
        anp: Number((branch.anp * 0.18).toFixed(1)),
        contractCount: Math.floor(contractCount * 0.15),
        avgContractValue: Number((branch.anp * 0.18 / (contractCount * 0.15)).toFixed(2)),
        previousMonthAnp: Number((branch.anp * 0.19).toFixed(1)),
        trend: monthlyData.map((m) => ({
          month: m.month,
          anp: Number((m.anp * 0.18).toFixed(1)),
          contractCount: Math.floor(m.contractCount * 0.15),
        })),
      },
      {
        productName: "年金保険",
        anp: Number((branch.anp * 0.12).toFixed(1)),
        contractCount: Math.floor(contractCount * 0.12),
        avgContractValue: Number((branch.anp * 0.12 / (contractCount * 0.12)).toFixed(2)),
        previousMonthAnp: Number((branch.anp * 0.13).toFixed(1)),
        trend: monthlyData.map((m) => ({
          month: m.month,
          anp: Number((m.anp * 0.12).toFixed(1)),
          contractCount: Math.floor(m.contractCount * 0.12),
        })),
      },
      {
        productName: "その他",
        anp: Number((branch.anp * 0.07).toFixed(1)),
        contractCount: Math.floor(contractCount * 0.08),
        avgContractValue: Number((branch.anp * 0.07 / (contractCount * 0.08)).toFixed(2)),
        previousMonthAnp: Number((branch.anp * 0.07).toFixed(1)),
        trend: monthlyData.map((m) => ({
          month: m.month,
          anp: Number((m.anp * 0.07).toFixed(1)),
          contractCount: Math.floor(m.contractCount * 0.08),
        })),
      },
    ];

    // 契約内訳データ
    const contractBreakdown = {
      newContracts: Math.floor(contractCount * 0.08),
      prevNewContracts: Math.floor(contractCount * 0.075),
      cancellations: Math.floor(contractCount * 0.045),
      prevCancellations: Math.floor(contractCount * 0.05),
      netIncrease: Math.floor(contractCount * 0.035),
      prevNetIncrease: Math.floor(contractCount * 0.025),
      cancellationRate: 4.5,
      monthlyTrend: monthlyData.map((m, i) => ({
        month: m.month,
        new: Math.floor(m.contractCount * (0.07 + i * 0.002)),
        cancel: Math.floor(m.contractCount * (0.05 - i * 0.001)),
        net: Math.floor(m.contractCount * (0.02 + i * 0.003)),
        cancelRate: Number((5.0 - i * 0.1).toFixed(1)),
      })),
      acquisitionChannels: [
        { channel: "紹介", count: Math.floor(contractCount * 0.035), percentage: 43.8 },
        { channel: "新規営業", count: Math.floor(contractCount * 0.025), percentage: 31.2 },
        { channel: "キャンペーン", count: Math.floor(contractCount * 0.012), percentage: 15.0 },
        { channel: "デジタル", count: Math.floor(contractCount * 0.006), percentage: 7.5 },
        { channel: "その他", count: Math.floor(contractCount * 0.002), percentage: 2.5 },
      ],
    };

    // 顧客セグメントデータ
    const customerSegments = {
      ageSegments: [
        { ageRange: "20代", contractCount: Math.floor(contractCount * 0.12), anp: Number((branch.anp * 0.10).toFixed(1)), percentage: 12.0 },
        { ageRange: "30代", contractCount: Math.floor(contractCount * 0.28), anp: Number((branch.anp * 0.26).toFixed(1)), percentage: 28.0 },
        { ageRange: "40代", contractCount: Math.floor(contractCount * 0.32), anp: Number((branch.anp * 0.35).toFixed(1)), percentage: 32.0 },
        { ageRange: "50代", contractCount: Math.floor(contractCount * 0.20), anp: Number((branch.anp * 0.22).toFixed(1)), percentage: 20.0 },
        { ageRange: "60代以上", contractCount: Math.floor(contractCount * 0.08), anp: Number((branch.anp * 0.07).toFixed(1)), percentage: 8.0 },
      ],
      genderSegments: [
        { gender: "男性", contractCount: Math.floor(contractCount * 0.58), anp: Number((branch.anp * 0.60).toFixed(1)), percentage: 58.0 },
        { gender: "女性", contractCount: Math.floor(contractCount * 0.42), anp: Number((branch.anp * 0.40).toFixed(1)), percentage: 42.0 },
      ],
      contractDurationSegments: [
        { duration: "新規1年未満", contractCount: Math.floor(contractCount * 0.15), anp: Number((branch.anp * 0.12).toFixed(1)), percentage: 15.0 },
        { duration: "1-3年", contractCount: Math.floor(contractCount * 0.25), anp: Number((branch.anp * 0.23).toFixed(1)), percentage: 25.0 },
        { duration: "3-5年", contractCount: Math.floor(contractCount * 0.28), anp: Number((branch.anp * 0.30).toFixed(1)), percentage: 28.0 },
        { duration: "5年以上", contractCount: Math.floor(contractCount * 0.32), anp: Number((branch.anp * 0.35).toFixed(1)), percentage: 32.0 },
      ],
    };

    return {
      branchId: branch.id,
      branchName: branch.name,
      kpi,
      agents,
      productMix,
      contractBreakdown,
      customerSegments,
      monthlyData,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-success";
      case "good":
        return "text-primary";
      case "attention":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "excellent":
        return "目標を大幅に達成";
      case "good":
        return "順調に推移";
      case "attention":
        return "要改善";
      default:
        return "標準";
    }
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">支社別実績</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-accent/50 transition-all duration-300 bg-card/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">{branch.name}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className={`text-xs font-medium ${getStatusColor(branch.status)}`}>
                          ●
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getStatusDescription(branch.status)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{branch.area}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">¥{branch.anp}M</p>
                  <p className="text-xs text-muted-foreground">ANP</p>
                </div>
                <CircleButton
                  onClick={() => setSelectedBranch(getBranchDetailData(branch.id))}
                  className="hover:border-accent"
                >
                  <TrendingUp className="w-4 h-4" />
                </CircleButton>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {selectedBranch && (
        <BranchDetailModal
          open={!!selectedBranch}
          onOpenChange={(open) => !open && setSelectedBranch(null)}
          data={selectedBranch}
        />
      )}
    </Card>
  );
};
