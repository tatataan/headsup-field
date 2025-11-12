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
import { AchievementLegend } from "@/components/ui/achievement-legend";

const Dashboard = () => {
  const [selectedKPI, setSelectedKPI] = useState<{
    title: string;
    value: string;
    data: { month: string; value: number }[];
  } | null>(null);
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    showKPIs: true,
    showDepartmentCharts: true,
    showDepartmentList: true,
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



  // 期間ラベルを取得
  const getPeriodLabel = () => {
    switch (periodType) {
      case 'monthly': return '今月';
      case 'quarterly': return '今四半期';
      case 'yearly': return '今年度';
      default: return '今月';
    }
  };

  const handleKPIClick = (title: string, value: string) => {
    setSelectedKPI({ title, value, data: [] });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">営業ダッシュボード</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('ja-JP', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })} 現在
            </p>
            <p className="text-sm text-muted-foreground mt-1">{getPeriodLabel()}のパフォーマンス概要</p>
          </div>
          <div className="flex items-center gap-4">
            <AchievementLegend />
            <DashboardCustomizer config={dashboardConfig} onConfigChange={setDashboardConfig} />
            <PeriodSelector value={periodType} onChange={setPeriodType} />
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
                      title={`全社新規ANP（${getPeriodLabel()}）`}
                      value={`¥${(companyKPI.newANP.actual / 1000000).toFixed(0)}M`}
                      change=""
                      changeType={companyKPI.newANP.achievementRate >= 100 ? "positive" : companyKPI.newANP.achievementRate >= 90 ? "neutral" : "negative"}
                      onClick={() => {}}
                    />
                    <KPICard
                      title={`全社新規契約数（${getPeriodLabel()}）`}
                      value={`${companyKPI.newContractCount.actual.toLocaleString()}件`}
                      change=""
                      changeType={companyKPI.newContractCount.achievementRate >= 100 ? "positive" : companyKPI.newContractCount.achievementRate >= 90 ? "neutral" : "negative"}
                      onClick={() => {}}
                    />
                    <KPICard
                      title={`全社継続率（${getPeriodLabel()}）`}
                      value={`${companyKPI.continuationRate.actual.toFixed(1)}%`}
                      change=""
                      changeType={companyKPI.continuationRate.achievementRate >= 100 ? "positive" : companyKPI.continuationRate.achievementRate >= 90 ? "neutral" : "negative"}
                      onClick={() => {}}
                    />
                  </div>

                  {/* 達成率表示 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <KPICard
                      title="新規ANP達成率"
                      value={`${companyKPI.newANP.achievementRate.toFixed(1)}%`}
                      change=""
                      changeType={companyKPI.newANP.achievementRate >= 100 ? "positive" : companyKPI.newANP.achievementRate >= 90 ? "neutral" : "negative"}
                      applyColorToValue={true}
                    />
                    <KPICard
                      title="新規契約数達成率"
                      value={`${companyKPI.newContractCount.achievementRate.toFixed(1)}%`}
                      change=""
                      changeType={companyKPI.newContractCount.achievementRate >= 100 ? "positive" : companyKPI.newContractCount.achievementRate >= 90 ? "neutral" : "negative"}
                      applyColorToValue={true}
                    />
                    <KPICard
                      title="継続率達成率"
                      value={`${companyKPI.continuationRate.achievementRate.toFixed(1)}%`}
                      change=""
                      changeType={companyKPI.continuationRate.achievementRate >= 100 ? "positive" : companyKPI.continuationRate.achievementRate >= 90 ? "neutral" : "negative"}
                      applyColorToValue={true}
                    />
                  </div>
                </>
              )}

              {/* 統括部別グラフ */}
              {dashboardConfig.showDepartmentCharts && (
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

              {dashboardConfig.showDepartmentList && (
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

            {/* 統括部別実績サマリー */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">統括部別実績サマリー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentChartData.map(dept => {
                    const anpAchievementRate = dept.anp.plan > 0 ? Math.round((dept.anp.actual / dept.anp.plan) * 100) : 0;
                    const contractAchievementRate = dept.contracts.plan > 0 ? Math.round((dept.contracts.actual / dept.contracts.plan) * 100) : 0;
                    const continuationAchievementRate = dept.continuationRate.plan > 0 ? Math.round((dept.continuationRate.actual / dept.continuationRate.plan) * 100) : 0;
                    
                    return (
                      <div key={dept.departmentName} className="p-4 bg-muted/30 rounded border border-border">
                        <h5 className="font-semibold text-foreground mb-3">{dept.departmentName}</h5>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">新規ANP達成率</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${
                                anpAchievementRate >= 100 ? "text-success" : 
                                anpAchievementRate >= 90 ? "text-warning" : "text-destructive"
                              }`}>
                                {anpAchievementRate}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">新規契約数達成率</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${
                                contractAchievementRate >= 100 ? "text-success" : 
                                contractAchievementRate >= 90 ? "text-warning" : "text-destructive"
                              }`}>
                                {contractAchievementRate}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">継続率達成率</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${
                                continuationAchievementRate >= 100 ? "text-success" : 
                                continuationAchievementRate >= 90 ? "text-warning" : "text-destructive"
                              }`}>
                                {continuationAchievementRate}%
                              </span>
                            </div>
                          </div>
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
