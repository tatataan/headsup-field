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
import { 
  useHearingHistory, 
  useThemeAnalysis, 
  useEnrichedHearingHistory,
  useDepartmentComparison,
  useBranchComparison,
  useDepartmentRanking,
  useBranchRanking
} from "@/hooks/useHearingHistory";
import { ThemeDistributionChart } from "@/components/dashboard/issues/ThemeDistributionChart";
import { CommonIssuesSummary } from "@/components/dashboard/issues/CommonIssuesSummary";
import { QualitativeInsights } from "@/components/dashboard/issues/QualitativeInsights";
import { ThemeTimeline } from "@/components/dashboard/issues/ThemeTimeline";
import { ThemeDrillDownModal } from "@/components/dashboard/issues/ThemeDrillDownModal";
import { OrganizationSelector, ViewMode } from "@/components/dashboard/issues/OrganizationSelector";
import { DepartmentComparisonChart } from "@/components/dashboard/issues/DepartmentComparisonChart";
import { BranchComparisonChart } from "@/components/dashboard/issues/BranchComparisonChart";
import { OrganizationRankingTable } from "@/components/dashboard/issues/OrganizationRankingTable";
import { DepartmentIssuesModal } from "@/components/dashboard/issues/DepartmentIssuesModal";
import { BranchIssuesModal } from "@/components/dashboard/issues/BranchIssuesModal";

const Dashboard = () => {
  const [selectedKPI, setSelectedKPI] = useState<{
    title: string;
    value: string;
    data: { month: string; value: number }[];
  } | null>(null);
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [activeTab, setActiveTab] = useState<'performance' | 'issues'>('performance');
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    showKPIs: true,
    showDepartmentCharts: true,
    showDepartmentList: true,
  });

  // Hearing history data and organization filters
  const { data: hearingHistory = [] } = useHearingHistory();
  const { data: enrichedHistory = [] } = useEnrichedHearingHistory();
  const { data: themeAnalysis } = useThemeAnalysis();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedMiddleTheme, setSelectedMiddleTheme] = useState<string | undefined>(undefined);
  
  // Organization filters
  const [viewMode, setViewMode] = useState<ViewMode>('company');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [drillDownDepartmentId, setDrillDownDepartmentId] = useState<string | null>(null);
  const [drillDownBranchId, setDrillDownBranchId] = useState<string | null>(null);

  // Comparison and ranking data
  const departmentComparison = useDepartmentComparison();
  const branchComparison = useBranchComparison(selectedDepartmentId);
  const departmentRanking = useDepartmentRanking();
  const branchRanking = useBranchRanking(selectedDepartmentId);

  // Filtered data based on view mode
  const filteredHearingHistory = useMemo(() => {
    if (viewMode === 'company') return enrichedHistory;
    
    if (viewMode === 'department' && selectedDepartmentId) {
      return enrichedHistory.filter(h => (h as any).enrichedDepartmentId === selectedDepartmentId);
    }
    
    if (viewMode === 'branch' && selectedBranchId) {
      return enrichedHistory.filter(h => (h as any).enrichedBranchId === selectedBranchId);
    }
    
    if (viewMode === 'branch' && selectedDepartmentId && !selectedBranchId) {
      return enrichedHistory.filter(h => (h as any).enrichedDepartmentId === selectedDepartmentId);
    }
    
    return enrichedHistory;
  }, [enrichedHistory, viewMode, selectedDepartmentId, selectedBranchId]);

  // Recalculate theme analysis for filtered data
  const filteredThemeAnalysis = useMemo(() => {
    if (!filteredHearingHistory.length) return null;

    const themeCount: Record<string, number> = {};
    const middleThemeCount: Record<string, Record<string, number>> = {};

    filteredHearingHistory.forEach((record) => {
      themeCount[record.major_theme] = (themeCount[record.major_theme] || 0) + 1;

      if (!middleThemeCount[record.major_theme]) {
        middleThemeCount[record.major_theme] = {};
      }
      middleThemeCount[record.major_theme][record.middle_theme] = 
        (middleThemeCount[record.major_theme][record.middle_theme] || 0) + 1;
    });

    return {
      themeCount,
      middleThemeCount,
      totalHearings: filteredHearingHistory.length,
      uniqueThemes: Object.keys(themeCount).length,
    };
  }, [filteredHearingHistory]);

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
            {activeTab === 'performance' && (
              <p className="text-sm text-muted-foreground mt-1">{getPeriodLabel()}のパフォーマンス概要</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'performance' && <AchievementLegend />}
            {activeTab === 'performance' && (
              <DashboardCustomizer config={dashboardConfig} onConfigChange={setDashboardConfig} />
            )}
            <PeriodSelector value={periodType} onChange={setPeriodType} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'performance' | 'issues')} className="space-y-6">
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
            {/* Organization Selector */}
            <OrganizationSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedDepartmentId={selectedDepartmentId}
              onDepartmentChange={setSelectedDepartmentId}
              selectedBranchId={selectedBranchId}
              onBranchChange={setSelectedBranchId}
            />

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">総ヒアリング数</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{filteredThemeAnalysis?.totalHearings || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">識別された課題テーマ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{filteredThemeAnalysis?.uniqueThemes || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">最多課題</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {filteredThemeAnalysis && Object.entries(filteredThemeAnalysis.themeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Charts based on view mode */}
            {viewMode === 'department' && !selectedDepartmentId && departmentComparison.length > 0 && (
              <DepartmentComparisonChart
                data={departmentComparison.map(d => ({
                  departmentId: d.departmentId,
                  themes: d.themes,
                  total: d.total
                }))}
                onDepartmentClick={setDrillDownDepartmentId}
              />
            )}

            {viewMode === 'branch' && branchComparison.length > 0 && (
              <BranchComparisonChart
                data={branchComparison.map(b => ({
                  branchId: b.branchId,
                  themes: b.themes,
                  total: b.total
                }))}
                onBranchClick={setDrillDownBranchId}
                topN={15}
              />
            )}

            {/* Ranking Tables */}
            {viewMode === 'department' && !selectedDepartmentId && departmentRanking.length > 0 && (
              <OrganizationRankingTable
                data={departmentRanking.map(d => ({ id: d.departmentId, themes: d.themes, total: d.total }))}
                type="department"
                onDrillDown={setDrillDownDepartmentId}
              />
            )}

            {viewMode === 'branch' && branchRanking.length > 0 && (
              <OrganizationRankingTable
                data={branchRanking.map(b => ({ id: b.branchId, themes: b.themes, total: b.total }))}
                type="branch"
                onDrillDown={setDrillDownBranchId}
              />
            )}

            {/* Theme Distribution Chart */}
            {filteredThemeAnalysis && (
              <ThemeDistributionChart
                data={Object.entries(filteredThemeAnalysis.themeCount).map(([theme, count]) => ({
                  theme,
                  count,
                  percentage: (count / filteredThemeAnalysis.totalHearings) * 100
                })).sort((a, b) => b.count - a.count)}
                onThemeClick={(theme) => {
                  setSelectedTheme(theme);
                  setSelectedMiddleTheme(undefined);
                }}
              />
            )}

            {/* Common Issues Summary */}
            {filteredThemeAnalysis && (
              <CommonIssuesSummary
                issues={
                  Object.entries(filteredThemeAnalysis.middleThemeCount)
                    .flatMap(([majorTheme, middleThemes]) =>
                      Object.entries(middleThemes).map(([middleTheme, count]) => {
                        const sampleRecord = filteredHearingHistory.find(
                          h => h.major_theme === majorTheme && h.middle_theme === middleTheme
                        );
                        return {
                          theme: majorTheme,
                          middleTheme,
                          count,
                          percentage: (count / filteredThemeAnalysis.totalHearings) * 100,
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
            <ThemeTimeline hearingHistory={filteredHearingHistory} />

            {/* Qualitative Insights */}
            <QualitativeInsights hearingHistory={filteredHearingHistory} />

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
              hearingHistory={filteredHearingHistory}
            />

            {/* Department Issues Modal */}
            <DepartmentIssuesModal
              open={drillDownDepartmentId !== null}
              onOpenChange={(open) => !open && setDrillDownDepartmentId(null)}
              departmentId={drillDownDepartmentId}
              onBranchClick={setDrillDownBranchId}
            />

            {/* Branch Issues Modal */}
            <BranchIssuesModal
              open={drillDownBranchId !== null}
              onOpenChange={(open) => !open && setDrillDownBranchId(null)}
              branchId={drillDownBranchId}
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
