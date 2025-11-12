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
import { EnhancedKPICards } from "@/components/dashboard/EnhancedKPICards";
import { generateHistoricalTrendData } from "@/data/sample-data-generator";
import { useHearingHistory, useThemeAnalysis } from "@/hooks/useHearingHistory";
import { ThemeDistributionChart } from "@/components/dashboard/issues/ThemeDistributionChart";
import { CommonIssuesSummary } from "@/components/dashboard/issues/CommonIssuesSummary";
import { QualitativeInsights } from "@/components/dashboard/issues/QualitativeInsights";
import { ThemeTimeline } from "@/components/dashboard/issues/ThemeTimeline";
import { ThemeDrillDownModal } from "@/components/dashboard/issues/ThemeDrillDownModal";

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

  // Hearing history data
  const { data: hearingHistory = [] } = useHearingHistory();
  const { data: themeAnalysis } = useThemeAnalysis();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedMiddleTheme, setSelectedMiddleTheme] = useState<string | undefined>(undefined);

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

  // 全社の履歴トレンドデータ
  const companyHistoricalData = useMemo(() => {
    const allBranches = departments.flatMap(dept => getBranchesByDepartmentId(dept.id));
    
    return {
      monthly: generateHistoricalTrendData(allBranches, 'monthly', 12),
      quarterly: generateHistoricalTrendData(allBranches, 'quarterly', 8),
      yearly: generateHistoricalTrendData(allBranches, 'yearly', 5)
    };
  }, []);

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
                <EnhancedKPICards
                  kpis={[
                    {
                      title: `全社新規ANP（${getPeriodLabel()}）`,
                      value: `¥${(companyKPI.newANP.actual / 1000000).toFixed(0)}M`,
                      achievementRate: companyKPI.newANP.achievementRate,
                      changeType: companyKPI.newANP.achievementRate >= 100 ? "positive" : companyKPI.newANP.achievementRate >= 90 ? "neutral" : "negative"
                    },
                    {
                      title: `全社新規契約数（${getPeriodLabel()}）`,
                      value: `${companyKPI.newContractCount.actual.toLocaleString()}件`,
                      achievementRate: companyKPI.newContractCount.achievementRate,
                      changeType: companyKPI.newContractCount.achievementRate >= 100 ? "positive" : companyKPI.newContractCount.achievementRate >= 90 ? "neutral" : "negative"
                    },
                    {
                      title: `全社継続率（${getPeriodLabel()}）`,
                      value: `${companyKPI.continuationRate.actual.toFixed(1)}%`,
                      achievementRate: companyKPI.continuationRate.achievementRate,
                      changeType: companyKPI.continuationRate.achievementRate >= 100 ? "positive" : companyKPI.continuationRate.achievementRate >= 90 ? "neutral" : "negative"
                    }
                  ]}
                  historicalData={companyHistoricalData}
                />
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
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">総ヒアリング数</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{themeAnalysis?.totalHearings || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">識別された課題テーマ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{themeAnalysis?.uniqueThemes || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">最多課題</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {themeAnalysis && Object.entries(themeAnalysis.themeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Theme Distribution Chart */}
            {themeAnalysis && (
              <ThemeDistributionChart
                data={Object.entries(themeAnalysis.themeCount).map(([theme, count]) => ({
                  theme,
                  count,
                  percentage: (count / themeAnalysis.totalHearings) * 100
                })).sort((a, b) => b.count - a.count)}
                onThemeClick={(theme) => {
                  setSelectedTheme(theme);
                  setSelectedMiddleTheme(undefined);
                }}
              />
            )}

            {/* Common Issues Summary */}
            {themeAnalysis && (
              <CommonIssuesSummary
                issues={
                  Object.entries(themeAnalysis.middleThemeCount)
                    .flatMap(([majorTheme, middleThemes]) =>
                      Object.entries(middleThemes).map(([middleTheme, count]) => {
                        const sampleRecord = hearingHistory.find(
                          h => h.major_theme === majorTheme && h.middle_theme === middleTheme
                        );
                        return {
                          theme: majorTheme,
                          middleTheme,
                          count,
                          percentage: (count / themeAnalysis.totalHearings) * 100,
                          trend: "stable" as const,
                          sampleContent: sampleRecord?.content || ""
                        };
                      })
                    )
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10)
                }
                onIssueClick={(theme, middleTheme) => {
                  setSelectedTheme(theme);
                  setSelectedMiddleTheme(middleTheme);
                }}
              />
            )}

            {/* Theme Timeline */}
            <ThemeTimeline hearingHistory={hearingHistory} />

            {/* Qualitative Insights */}
            <QualitativeInsights hearingHistory={hearingHistory} />

            {/* Theme Drill Down Modal */}
            <ThemeDrillDownModal
              open={selectedTheme !== null}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedTheme(null);
                  setSelectedMiddleTheme(undefined);
                }
              }}
              theme={selectedTheme}
              middleTheme={selectedMiddleTheme}
              hearingHistory={hearingHistory}
            />
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
