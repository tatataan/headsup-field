import { KPICard } from "@/components/dashboard/KPICard";
import { AgencyList } from "@/components/dashboard/AgencyList";
import { KPIDetailModal } from "@/components/dashboard/KPIDetailModal";
import { BranchPerformanceChart } from "@/components/dashboard/BranchPerformanceChart";
import { BranchContractChart } from "@/components/dashboard/BranchContractChart";
import { DashboardCustomizer, DashboardConfig } from "@/components/dashboard/DashboardCustomizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Dashboard = () => {
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

  // 今月のデータ（固定）
  const currentData = {
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
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">経営ダッシュボード</h1>
            <p className="text-sm text-muted-foreground">今月のパフォーマンス概要</p>
          </div>
          <DashboardCustomizer config={dashboardConfig} onConfigChange={setDashboardConfig} />
        </div>

        <Tabs defaultValue="performance" orientation="vertical" className="flex gap-6">
          <TabsList className="flex flex-col h-fit w-48 bg-card border border-border">
            <TabsTrigger value="performance" className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              パフォーマンス
            </TabsTrigger>
            <TabsTrigger value="issues" className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              経営課題
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="performance" className="m-0">
              {dashboardConfig.showKPIs && (
                <>
                  {/* 上段：主要指標3つ */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <KPICard
                      title="全社ANP進捗"
                      value={currentData.anpValue}
                      change={currentData.anpChange}
                      changeType="positive"
                      onClick={() => handleKPIClick("全社ANP進捗", currentData.anpValue, currentData.anpMonthly)}
                    />
                    <KPICard
                      title="保有契約高"
                      value={currentData.contractValue}
                      change={currentData.contractChange}
                      changeType="positive"
                      onClick={() => handleKPIClick("保有契約高", currentData.contractValue, currentData.contractMonthly)}
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
                      value={currentData.anpAchievement}
                      change={`${currentData.anpAchievementChange} vs 前月`}
                      changeType={currentData.anpAchievementChange.startsWith('-') ? 'negative' : 'positive'}
                    />
                    <KPICard
                      title="契約件数目標達成率"
                      value={currentData.contractAchievement}
                      change={`${currentData.contractAchievementChange} vs 前月`}
                      changeType={currentData.contractAchievementChange.startsWith('-') ? 'negative' : 'positive'}
                    />
                  </div>
                </>
              )}

              {/* 支社別パフォーマンスチャート */}
              {dashboardConfig.showBranchPerformance && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <BranchPerformanceChart data={branchPerformanceData} />
                  <BranchContractChart data={branchContractData} />
                </div>
              )}

              {dashboardConfig.showAgencyList && (
                <div className="mb-8">
                  <AgencyList />
                </div>
              )}
            </TabsContent>

            <TabsContent value="issues" className="m-0">
              <div className="space-y-6">
                <div className="p-8 bg-card border border-border rounded-lg text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">経営課題ダッシュボード</h3>
                  <p className="text-muted-foreground">課題分析と改善提案を表示します</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

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
