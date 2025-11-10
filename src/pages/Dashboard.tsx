import { KPICard } from "@/components/dashboard/KPICard";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { AgencyList } from "@/components/dashboard/AgencyList";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { KPIDetailModal } from "@/components/dashboard/KPIDetailModal";
import { ProductCompositionChart } from "@/components/dashboard/ProductCompositionChart";
import { RegionalHeatmap } from "@/components/dashboard/RegionalHeatmap";
import { AgencyRankingChart } from "@/components/dashboard/AgencyRankingChart";
import { ActivityScatterChart } from "@/components/dashboard/ActivityScatterChart";
import { PredictiveTrendChart } from "@/components/dashboard/PredictiveTrendChart";
import { BranchPerformanceChart } from "@/components/dashboard/BranchPerformanceChart";
import { BranchContractChart } from "@/components/dashboard/BranchContractChart";
import { DashboardCustomizer, DashboardConfig } from "@/components/dashboard/DashboardCustomizer";
import { PillButton } from "@/components/ui/pill-button";
import { useState, useMemo } from "react";

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("month");
  const [selectedKPI, setSelectedKPI] = useState<{
    title: string;
    value: string;
    data: { month: string; value: number }[];
  } | null>(null);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    showKPIs: true,
    showBranchPerformance: true,
    showMonthlyTrend: true,
    showProductComposition: true,
    showRegionalHeatmap: true,
    showAgencyRanking: true,
    showActivityScatter: true,
    showPredictiveTrend: true,
    showAIInsights: true,
    showAgencyList: true,
  });

  // サンプル月次データ
  const anpMonthlyData = [
    { month: "1月", value: 420 },
    { month: "2月", value: 445 },
    { month: "3月", value: 478 },
    { month: "4月", value: 490 },
    { month: "5月", value: 502 },
    { month: "6月", value: 523.5 },
  ];

  const contractMonthlyData = [
    { month: "1月", value: 7.8 },
    { month: "2月", value: 7.9 },
    { month: "3月", value: 8.0 },
    { month: "4月", value: 8.05 },
    { month: "5月", value: 8.1 },
    { month: "6月", value: 8.2 },
  ];

  // サンプル商品構成データ
  const productData = [
    { name: "終身保険", value: 180, color: "hsl(var(--chart-1))" },
    { name: "医療保険", value: 150, color: "hsl(var(--chart-2))" },
    { name: "がん保険", value: 95, color: "hsl(var(--chart-3))" },
    { name: "年金保険", value: 70, color: "hsl(var(--chart-4))" },
    { name: "その他", value: 28.5, color: "hsl(var(--chart-5))" },
  ];

  // サンプル地域データ（ANP達成率）
  const regionalAnpData = [
    { name: "関東", achievement: 105 },
    { name: "関西", achievement: 92 },
    { name: "中部", achievement: 88 },
    { name: "九州", achievement: 95 },
    { name: "東北", achievement: 78 },
    { name: "北海道", achievement: 85 },
  ];

  // サンプル地域データ（契約件数達成率）
  const regionalContractData = [
    { name: "関東", achievement: 98 },
    { name: "関西", achievement: 88 },
    { name: "中部", achievement: 94 },
    { name: "九州", achievement: 102 },
    { name: "東北", achievement: 85 },
    { name: "北海道", achievement: 91 },
  ];

  // サンプル支社ランキングデータ
  const branchRankingData = [
    { id: "1", branchName: "東京支社", anp: 185.5, achievement: 108 },
    { id: "2", branchName: "大阪支社", anp: 142.3, achievement: 95 },
    { id: "3", branchName: "名古屋支社", anp: 98.7, achievement: 102 },
    { id: "4", branchName: "福岡支社", anp: 76.4, achievement: 89 },
    { id: "5", branchName: "仙台支社", anp: 54.2, achievement: 92 },
    { id: "6", branchName: "札幌支社", anp: 48.9, achievement: 78 },
  ];

  // サンプル活動量データ（支社別）
  const branchActivityData = [
    { id: "1", branchName: "東京支社", visits: 850, anp: 185.5, achievement: 108 },
    { id: "2", branchName: "大阪支社", visits: 720, anp: 142.3, achievement: 95 },
    { id: "3", branchName: "名古屋支社", visits: 580, anp: 98.7, achievement: 102 },
    { id: "4", branchName: "福岡支社", visits: 490, anp: 76.4, achievement: 89 },
    { id: "5", branchName: "仙台支社", visits: 420, anp: 54.2, achievement: 92 },
    { id: "6", branchName: "札幌支社", visits: 380, anp: 48.9, achievement: 78 },
  ];

  // 支社別パフォーマンスデータ
  const branchPerformanceData = [
    { branchName: "東京支社", anp: 185.5, achievementRate: 108 },
    { branchName: "大阪支社", anp: 142.3, achievementRate: 95 },
    { branchName: "名古屋支社", anp: 98.7, achievementRate: 102 },
    { branchName: "福岡支社", anp: 76.4, achievementRate: 89 },
    { branchName: "仙台支社", anp: 54.2, achievementRate: 92 },
    { branchName: "札幌支社", anp: 48.9, achievementRate: 78 },
  ];

  // 支社別保有契約数データ
  const branchContractData = [
    { branchName: "東京支社", contractCount: 2850, achievementRate: 105 },
    { branchName: "大阪支社", contractCount: 2150, achievementRate: 98 },
    { branchName: "名古屋支社", contractCount: 1580, achievementRate: 103 },
    { branchName: "福岡支社", contractCount: 1220, achievementRate: 92 },
    { branchName: "仙台支社", contractCount: 890, achievementRate: 88 },
    { branchName: "札幌支社", contractCount: 780, achievementRate: 85 },
  ];

  // サンプル予測データ
  const historicalTrendData = [
    { month: "1月", value: 420, type: "actual" as const },
    { month: "2月", value: 445, type: "actual" as const },
    { month: "3月", value: 478, type: "actual" as const },
    { month: "4月", value: 490, type: "actual" as const },
    { month: "5月", value: 502, type: "actual" as const },
    { month: "6月", value: 523.5, type: "actual" as const },
  ];

  const predictedTrendData = [
    { month: "7月", value: 540, type: "predicted" as const },
    { month: "8月", value: 558, type: "predicted" as const },
    { month: "9月", value: 575, type: "predicted" as const },
    { month: "10月", value: 590, type: "predicted" as const },
    { month: "11月", value: 605, type: "predicted" as const },
    { month: "12月", value: 620, type: "predicted" as const },
  ];

  const handleKPIClick = (title: string, value: string, data: { month: string; value: number }[]) => {
    setSelectedKPI({ title, value, data });
  };

  // 期間フィルターに基づくデータ生成
  const filteredData = useMemo(() => {
    switch (activeFilter) {
      case "month": // 今月のみ
        return {
          anpValue: "¥606.0M",
          anpChange: "+12.5% vs 前月",
          anpAchievement: "91.5%",
          anpAchievementChange: "+2.3%",
          contractValue: "¥9.5B",
          contractChange: "+5.2% vs 前月",
          contractAchievement: "94.2%",
          contractAchievementChange: "+1.7%",
          anpMonthly: anpMonthlyData.slice(-1),
          contractMonthly: contractMonthlyData.slice(-1),
          productData: productData.map(p => ({ ...p, value: p.value / 6 })),
          regionalAnpData,
          regionalContractData,
          branchRanking: branchRankingData,
          branchActivity: branchActivityData,
          branchPerformance: branchPerformanceData,
          branchContract: branchContractData,
          historicalTrend: historicalTrendData.slice(-1),
          predictedTrend: predictedTrendData.slice(0, 1),
        };
      case "quarter": // Q2（4-6月）
        return {
          anpValue: "¥1,818.0M",
          anpChange: "+11.8% vs 前四半期",
          anpAchievement: "88.7%",
          anpAchievementChange: "-0.5%",
          contractValue: "¥9.5B",
          contractChange: "+3.9% vs 前四半期",
          contractAchievement: "91.8%",
          contractAchievementChange: "+0.8%",
          anpMonthly: anpMonthlyData.slice(-3),
          contractMonthly: contractMonthlyData.slice(-3),
          productData: productData.map(p => ({ ...p, value: p.value / 2 })),
          regionalAnpData,
          regionalContractData,
          branchRanking: branchRankingData.map(a => ({ ...a, anp: a.anp * 3 })),
          branchActivity: branchActivityData.map(a => ({ ...a, visits: a.visits * 3, anp: a.anp * 3 })),
          branchPerformance: branchPerformanceData.map(b => ({ ...b, anp: b.anp * 3 })),
          branchContract: branchContractData.map(b => ({ ...b, contractCount: b.contractCount * 3 })),
          historicalTrend: historicalTrendData.slice(-3),
          predictedTrend: predictedTrendData.slice(0, 3),
        };
      case "year": // 年間予測
        return {
          anpValue: "¥7,272M",
          anpChange: "+15.2% vs 前年",
          anpAchievement: "90.5%",
          anpAchievementChange: "+1.3%",
          contractValue: "¥11.4B",
          contractChange: "+18.5% vs 前年",
          contractAchievement: "93.0%",
          contractAchievementChange: "+0.5%",
          anpMonthly: anpMonthlyData,
          contractMonthly: contractMonthlyData,
          productData: productData.map(p => ({ ...p, value: p.value * 2 })),
          regionalAnpData,
          regionalContractData,
          branchRanking: branchRankingData.map(a => ({ ...a, anp: a.anp * 12 })),
          branchActivity: branchActivityData.map(a => ({ ...a, visits: a.visits * 12, anp: a.anp * 12 })),
          branchPerformance: branchPerformanceData.map(b => ({ ...b, anp: b.anp * 12 })),
          branchContract: branchContractData.map(b => ({ ...b, contractCount: b.contractCount * 12 })),
          historicalTrend: historicalTrendData,
          predictedTrend: predictedTrendData,
        };
      default: // 全体（6ヶ月累計）
        return {
          anpValue: "¥3,636M",
          anpChange: "+12.5% vs 前月",
          anpAchievement: "89.2%",
          anpAchievementChange: "-3.1%",
          contractValue: "¥9.5B",
          contractChange: "+5.2% vs 前月",
          contractAchievement: "92.5%",
          contractAchievementChange: "+1.8%",
          anpMonthly: anpMonthlyData,
          contractMonthly: contractMonthlyData,
          productData,
          regionalAnpData,
          regionalContractData,
          branchRanking: branchRankingData.map(a => ({ ...a, anp: a.anp * 6 })),
          branchActivity: branchActivityData.map(a => ({ ...a, visits: a.visits * 6, anp: a.anp * 6 })),
          branchPerformance: branchPerformanceData.map(b => ({ ...b, anp: b.anp * 6 })),
          branchContract: branchContractData.map(b => ({ ...b, contractCount: b.contractCount * 6 })),
          historicalTrend: historicalTrendData,
          predictedTrend: predictedTrendData,
        };
    }
  }, [activeFilter, anpMonthlyData, contractMonthlyData, productData, regionalAnpData, regionalContractData, branchRankingData, branchActivityData, branchPerformanceData, branchContractData, historicalTrendData, predictedTrendData]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">ダッシュボード</h1>
            <p className="text-muted-foreground">チャネル全体のパフォーマンスと課題を確認</p>
          </div>
          <DashboardCustomizer config={dashboardConfig} onConfigChange={setDashboardConfig} />
        </div>

        <div className="flex gap-2 mb-8">
          <PillButton 
            active={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            全体
          </PillButton>
          <PillButton 
            active={activeFilter === "month"}
            onClick={() => setActiveFilter("month")}
          >
            今月
          </PillButton>
          <PillButton 
            active={activeFilter === "quarter"}
            onClick={() => setActiveFilter("quarter")}
          >
            四半期
          </PillButton>
          <PillButton 
            active={activeFilter === "year"}
            onClick={() => setActiveFilter("year")}
          >
            年間
          </PillButton>
        </div>

        {dashboardConfig.showKPIs && (
          <>
            {/* 上段：主要指標3つ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <KPICard
                title="全社ANP進捗"
                value={filteredData.anpValue}
                change={filteredData.anpChange}
                changeType="positive"
                onClick={() => handleKPIClick("全社ANP進捗", filteredData.anpValue, filteredData.anpMonthly)}
              />
              <KPICard
                title="保有契約高"
                value={filteredData.contractValue}
                change={filteredData.contractChange}
                changeType="positive"
                onClick={() => handleKPIClick("保有契約高", filteredData.contractValue, filteredData.contractMonthly)}
              />
              <KPICard
                title="活動支社数"
                value="6支社"
                change="前月と同じ"
                changeType="neutral"
              />
            </div>

            {/* 下段：目標達成率2つ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <KPICard
                title="ANP目標達成率"
                value={filteredData.anpAchievement}
                change={`${filteredData.anpAchievementChange} vs 前月`}
                changeType={filteredData.anpAchievementChange.startsWith('-') ? 'negative' : 'positive'}
              />
              <KPICard
                title="契約件数目標達成率"
                value={filteredData.contractAchievement}
                change={`${filteredData.contractAchievementChange} vs 前月`}
                changeType={filteredData.contractAchievementChange.startsWith('-') ? 'negative' : 'positive'}
              />
            </div>
          </>
        )}

        {/* 支社別パフォーマンスチャート */}
        {dashboardConfig.showBranchPerformance && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BranchPerformanceChart data={filteredData.branchPerformance} />
            <BranchContractChart data={filteredData.branchContract} />
          </div>
        )}

        {dashboardConfig.showMonthlyTrend && (
          <div className="mb-8">
            <MonthlyTrendChart
              title="月次ANP推移"
              data={filteredData.anpMonthly}
            />
          </div>
        )}

        {dashboardConfig.showPredictiveTrend && (
          <div className="mb-8">
            <PredictiveTrendChart
              title="ANP予測トレンド"
              historicalData={filteredData.historicalTrend}
              predictedData={filteredData.predictedTrend}
              targetValue={600}
            />
          </div>
        )}

        {/* 商品構成チャート */}
        {dashboardConfig.showProductComposition && (
          <div className="mb-8">
            <ProductCompositionChart data={filteredData.productData} />
          </div>
        )}

        {/* 地域ヒートマップ - ANPと契約件数を並列表示 */}
        {dashboardConfig.showRegionalHeatmap && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RegionalHeatmap 
              title="地域別ANP達成率"
              data={filteredData.regionalAnpData} 
            />
            <RegionalHeatmap 
              title="地域別契約件数達成率"
              data={filteredData.regionalContractData} 
            />
          </div>
        )}

        {dashboardConfig.showAgencyRanking && (
          <div className="mb-8">
            <AgencyRankingChart data={filteredData.branchRanking} />
          </div>
        )}

        {dashboardConfig.showActivityScatter && (
          <div className="mb-8">
            <ActivityScatterChart data={filteredData.branchActivity} />
          </div>
        )}

        {(dashboardConfig.showAIInsights || dashboardConfig.showAgencyList) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {dashboardConfig.showAIInsights && <AIInsightsCard />}
            {dashboardConfig.showAgencyList && <AgencyList />}
          </div>
        )}

        <KPIDetailModal
          open={selectedKPI !== null}
          onOpenChange={(open) => !open && setSelectedKPI(null)}
          title={selectedKPI?.title || ""}
          currentValue={selectedKPI?.value || ""}
          monthlyData={selectedKPI?.data || []}
        />
      </div>
    </div>
  );
};

export default Dashboard;
