import { KPICard } from "@/components/dashboard/KPICard";
import { DepartmentList } from "@/components/dashboard/DepartmentList";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { PeriodType } from "@/types/kpi";
import { useState as useStateReact } from "react";
import { KPIDetailModal } from "@/components/dashboard/KPIDetailModal";
import { BranchPerformanceChart } from "@/components/dashboard/BranchPerformanceChart";
import { BranchContractChart } from "@/components/dashboard/BranchContractChart";
import { DashboardCustomizer, DashboardConfig } from "@/components/dashboard/DashboardCustomizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const Dashboard = () => {
  const [selectedKPI, setSelectedKPI] = useState<{
    title: string;
    value: string;
    data: { month: string; value: number }[];
  } | null>(null);
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
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
    { branchName: "東京支社", anp: 185.5, target: 171.8 },
    { branchName: "大阪支社", anp: 142.3, target: 149.8 },
    { branchName: "名古屋支社", anp: 98.7, target: 96.8 },
    { branchName: "福岡支社", anp: 76.4, target: 85.8 },
    { branchName: "仙台支社", anp: 54.2, target: 58.9 },
    { branchName: "札幌支社", anp: 48.9, target: 62.7 },
  ];

  // 支社別保有契約数データ
  const branchContractData = [
    { branchName: "東京支社", contractCount: 2850, contractValue: 185.5, targetCount: 2714, targetValue: 171.8 },
    { branchName: "大阪支社", contractCount: 2150, contractValue: 142.3, targetCount: 2194, targetValue: 149.8 },
    { branchName: "名古屋支社", contractCount: 1580, contractValue: 98.7, targetCount: 1534, targetValue: 96.8 },
    { branchName: "福岡支社", contractCount: 1220, contractValue: 76.4, targetCount: 1326, targetValue: 85.8 },
    { branchName: "仙台支社", contractCount: 890, contractValue: 54.2, targetCount: 1011, targetValue: 58.9 },
    { branchName: "札幌支社", contractCount: 780, contractValue: 48.9, targetCount: 918, targetValue: 62.7 },
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
          <div className="flex items-center gap-4">
            <PeriodSelector value={periodType} onChange={setPeriodType} />
            <DashboardCustomizer config={dashboardConfig} onConfigChange={setDashboardConfig} />
          </div>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="performance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              パフォーマンス
            </TabsTrigger>
            <TabsTrigger value="issues" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              経営課題
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-8">
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
                      title="保有契約数"
                      value="8,470件"
                      change="+3.8% vs 前月"
                      changeType="positive"
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
                  <DepartmentList periodType={periodType} />
                </div>
              )}
            </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            {/* 低パフォーマンス支社 */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-destructive">要注意支社（達成率90%未満）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {branchPerformanceData
                    .filter(branch => (branch.anp / branch.target * 100) < 90)
                    .sort((a, b) => (a.anp / a.target * 100) - (b.anp / b.target * 100))
                    .map(branch => {
                      const achievementRate = Math.round(branch.anp / branch.target * 100);
                      return (
                        <div key={branch.branchName} className="flex items-center justify-between p-4 bg-muted/50 rounded border border-border">
                          <div>
                            <h4 className="font-semibold text-foreground">{branch.branchName}</h4>
                            <p className="text-sm text-muted-foreground">ANP: ¥{branch.anp}M / 目標: ¥{branch.target}M</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-destructive">{achievementRate}%</p>
                            <p className="text-sm text-muted-foreground">目標未達</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* 課題分析 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">主要課題</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded border border-border">
                      <h5 className="font-semibold text-foreground mb-1">1. 地方支社の低迷</h5>
                      <p className="text-sm text-muted-foreground">札幌、仙台支社の達成率が80%台で推移</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded border border-border">
                      <h5 className="font-semibold text-foreground mb-1">2. 新規契約獲得の鈍化</h5>
                      <p className="text-sm text-muted-foreground">前四半期比で訪問数が15%減少</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded border border-border">
                      <h5 className="font-semibold text-foreground mb-1">3. 商品構成の偏り</h5>
                      <p className="text-sm text-muted-foreground">医療保険への依存度が高く、リスク分散が必要</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">改善アクション</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 rounded border border-primary/20">
                      <h5 className="font-semibold text-foreground mb-1">短期施策（1-3ヶ月）</h5>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>札幌・仙台支社への営業強化研修実施</li>
                        <li>訪問数増加キャンペーンの展開</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-primary/10 rounded border border-primary/20">
                      <h5 className="font-semibold text-foreground mb-1">中期施策（3-6ヶ月）</h5>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>年金保険・がん保険の販売強化</li>
                        <li>デジタルマーケティングの導入</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 支社別課題サマリー */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">支社別課題サマリー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {branchPerformanceData.map(branch => {
                    const achievementRate = Math.round(branch.anp / branch.target * 100);
                    return (
                      <div key={branch.branchName} className="flex items-start gap-4 p-4 bg-muted/30 rounded border border-border">
                        <div className="flex-1">
                          <h5 className="font-semibold text-foreground">{branch.branchName}</h5>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievementRate >= 100 
                              ? "目標達成。引き続き高水準の維持を期待"
                              : achievementRate >= 90
                              ? "目標達成まであと僅か。営業活動の強化が必要"
                              : "目標未達。テコ入れが急務。営業戦略の見直しを推奨"}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded text-sm font-semibold ${
                          achievementRate >= 100
                            ? "bg-success/20 text-success"
                            : achievementRate >= 90
                            ? "bg-warning/20 text-warning"
                            : "bg-destructive/20 text-destructive"
                        }`}>
                          {achievementRate}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
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
