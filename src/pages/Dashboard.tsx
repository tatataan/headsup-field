import { KPICard } from "@/components/dashboard/KPICard";
import { DepartmentList } from "@/components/dashboard/DepartmentList";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { PeriodType } from "@/types/kpi";
import { useState as useStateReact } from "react";
import { KPIDetailModal } from "@/components/dashboard/KPIDetailModal";
import { DepartmentANPChart } from "@/components/dashboard/DepartmentANPChart";
import { DepartmentContractChart } from "@/components/dashboard/DepartmentContractChart";
import { DepartmentContinuationRateChart } from "@/components/dashboard/DepartmentContinuationRateChart";
import { DashboardCustomizer, DashboardConfig } from "@/components/dashboard/DashboardCustomizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { departments } from "@/data/departments";
import { getBranchesByDepartmentId } from "@/data/branches";
import { generatePeriodData } from "@/data/sample-data-generator";

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

  // 全社KPIデータを統括部から集計
  const companyKPI = useMemo(() => {
    let totalPlanANP = 0;
    let totalActualANP = 0;
    let totalPlanContracts = 0;
    let totalActualContracts = 0;
    let totalContinuationRatePlan = 0;
    let totalContinuationRateActual = 0;

    departments.forEach(dept => {
      const deptBranches = getBranchesByDepartmentId(dept.id);
      deptBranches.forEach(branch => {
        const periodData = generatePeriodData(branch, periodType, 0);
        totalPlanANP += periodData.metrics.newANP.plan;
        totalActualANP += periodData.metrics.newANP.actual;
        totalPlanContracts += periodData.metrics.newContractCount.plan;
        totalActualContracts += periodData.metrics.newContractCount.actual;
        totalContinuationRatePlan += periodData.metrics.continuationRate.plan;
        totalContinuationRateActual += periodData.metrics.continuationRate.actual;
      });
    });

    const totalBranches = departments.reduce((sum, dept) => sum + getBranchesByDepartmentId(dept.id).length, 0);
    const avgContinuationRatePlan = totalBranches > 0 ? totalContinuationRatePlan / totalBranches : 0;
    const avgContinuationRateActual = totalBranches > 0 ? totalContinuationRateActual / totalBranches : 0;

    return {
      newANP: {
        plan: totalPlanANP,
        actual: totalActualANP,
        achievementRate: totalPlanANP > 0 ? (totalActualANP / totalPlanANP) * 100 : 0
      },
      newContractCount: {
        plan: totalPlanContracts,
        actual: totalActualContracts,
        achievementRate: totalPlanContracts > 0 ? (totalActualContracts / totalPlanContracts) * 100 : 0
      },
      continuationRate: {
        plan: avgContinuationRatePlan,
        actual: avgContinuationRateActual,
        achievementRate: avgContinuationRatePlan > 0 ? (avgContinuationRateActual / avgContinuationRatePlan) * 100 : 0
      }
    };
  }, [periodType]);

  // 統括部別グラフデータ
  const departmentChartData = useMemo(() => {
    return departments.map(dept => {
      const deptBranches = getBranchesByDepartmentId(dept.id);
      
      let totalPlanANP = 0;
      let totalActualANP = 0;
      let totalPlanContracts = 0;
      let totalActualContracts = 0;
      let totalContinuationRatePlan = 0;
      let totalContinuationRateActual = 0;

      deptBranches.forEach(branch => {
        const periodData = generatePeriodData(branch, periodType, 0);
        totalPlanANP += periodData.metrics.newANP.plan;
        totalActualANP += periodData.metrics.newANP.actual;
        totalPlanContracts += periodData.metrics.newContractCount.plan;
        totalActualContracts += periodData.metrics.newContractCount.actual;
        totalContinuationRatePlan += periodData.metrics.continuationRate.plan;
        totalContinuationRateActual += periodData.metrics.continuationRate.actual;
      });

      const avgContinuationRatePlan = deptBranches.length > 0 ? totalContinuationRatePlan / deptBranches.length : 0;
      const avgContinuationRateActual = deptBranches.length > 0 ? totalContinuationRateActual / deptBranches.length : 0;

      return {
        departmentName: dept.name,
        anp: { actual: totalActualANP, plan: totalPlanANP },
        contracts: { actual: totalActualContracts, plan: totalPlanContracts },
        continuationRate: { actual: avgContinuationRateActual, plan: avgContinuationRatePlan }
      };
    });
  }, [periodType]);



  const handleKPIClick = (title: string, value: string) => {
    setSelectedKPI({ title, value, data: [] });
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
                  {/* 全社KPIカード */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <KPICard
                      title="全社新規ANP"
                      value={`¥${(companyKPI.newANP.actual / 1000000).toFixed(0)}M`}
                      change={`計画: ¥${(companyKPI.newANP.plan / 1000000).toFixed(0)}M`}
                      changeType={companyKPI.newANP.achievementRate >= 100 ? "positive" : "negative"}
                      onClick={() => {}}
                    />
                    <KPICard
                      title="全社新規契約数"
                      value={`${companyKPI.newContractCount.actual.toLocaleString()}件`}
                      change={`計画: ${companyKPI.newContractCount.plan.toLocaleString()}件`}
                      changeType={companyKPI.newContractCount.achievementRate >= 100 ? "positive" : "negative"}
                      onClick={() => {}}
                    />
                    <KPICard
                      title="全社継続率"
                      value={`${companyKPI.continuationRate.actual.toFixed(1)}%`}
                      change={`計画: ${companyKPI.continuationRate.plan.toFixed(1)}%`}
                      changeType={companyKPI.continuationRate.achievementRate >= 100 ? "positive" : "negative"}
                      onClick={() => {}}
                    />
                  </div>

                  {/* 達成率表示 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <KPICard
                      title="新規ANP達成率"
                      value={`${companyKPI.newANP.achievementRate.toFixed(1)}%`}
                      change=""
                      changeType={companyKPI.newANP.achievementRate >= 100 ? "positive" : "negative"}
                    />
                    <KPICard
                      title="新規契約数達成率"
                      value={`${companyKPI.newContractCount.achievementRate.toFixed(1)}%`}
                      change=""
                      changeType={companyKPI.newContractCount.achievementRate >= 100 ? "positive" : "negative"}
                    />
                    <KPICard
                      title="継続率達成率"
                      value={`${companyKPI.continuationRate.achievementRate.toFixed(1)}%`}
                      change=""
                      changeType={companyKPI.continuationRate.achievementRate >= 100 ? "positive" : "negative"}
                    />
                  </div>
                </>
              )}

              {/* 統括部別グラフ */}
              {dashboardConfig.showBranchPerformance && (
                <div className="space-y-6 mb-8">
                  <DepartmentANPChart 
                    data={departmentChartData.map(d => ({
                      departmentName: d.departmentName,
                      actual: d.anp.actual,
                      plan: d.anp.plan
                    }))} 
                  />
                  <DepartmentContractChart 
                    data={departmentChartData.map(d => ({
                      departmentName: d.departmentName,
                      actual: d.contracts.actual,
                      plan: d.contracts.plan
                    }))} 
                  />
                  <DepartmentContinuationRateChart 
                    data={departmentChartData.map(d => ({
                      departmentName: d.departmentName,
                      actual: d.continuationRate.actual,
                      plan: d.continuationRate.plan
                    }))} 
                  />
                </div>
              )}

              {dashboardConfig.showAgencyList && (
                <div className="mb-8">
                  <DepartmentList periodType={periodType} />
                </div>
              )}
            </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            {/* 経営課題 */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">経営課題分析</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">統括部・支社別の詳細な課題分析を表示します。</p>
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
