import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, TrendingUp, TrendingDown } from "lucide-react";
import { departments } from "@/data/departments";
import { getBranchesByDepartmentId } from "@/data/branches";
import { generatePeriodData } from "@/data/sample-data-generator";
import { PeriodType } from "@/types/kpi";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBox } from "@/components/dashboard/SearchBox";
import { BranchANPChart } from "@/components/dashboard/department-detail/BranchANPChart";
import { BranchContractChart } from "@/components/dashboard/department-detail/BranchContractChart";
import { BranchContinuationRateChart } from "@/components/dashboard/department-detail/BranchContinuationRateChart";
import { AchievementLegend } from "@/components/ui/achievement-legend";
import { EnhancedKPICards } from "@/components/dashboard/EnhancedKPICards";
import { generateHistoricalTrendData } from "@/data/sample-data-generator";

const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [periodType, setPeriodType] = useState<PeriodType>('monthly');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "anp" | "contracts" | "continuation">("anp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const department = departments.find(dept => dept.id === id);
  const branches = id ? getBranchesByDepartmentId(id) : [];

  // 統括部の総合KPIを計算
  const totalMetrics = useMemo(() => {
    let totalPlanANP = 0;
    let totalActualANP = 0;
    let totalPlanContracts = 0;
    let totalActualContracts = 0;
    let totalContinuationRatePlan = 0;
    let totalContinuationRateActual = 0;

    branches.forEach(branch => {
      const periodData = generatePeriodData(branch, periodType, 0);
      totalPlanANP += periodData.metrics.newANP.plan;
      totalActualANP += periodData.metrics.newANP.actual;
      totalPlanContracts += periodData.metrics.newContractCount.plan;
      totalActualContracts += periodData.metrics.newContractCount.actual;
      totalContinuationRatePlan += periodData.metrics.continuationRate.plan;
      totalContinuationRateActual += periodData.metrics.continuationRate.actual;
    });

    const avgContinuationRatePlan = branches.length > 0 ? totalContinuationRatePlan / branches.length : 0;
    const avgContinuationRateActual = branches.length > 0 ? totalContinuationRateActual / branches.length : 0;

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
  }, [branches, periodType]);

  // 統括部の履歴トレンドデータ
  const departmentHistoricalData = useMemo(() => {
    return {
      monthly: generateHistoricalTrendData(branches, 'monthly', 12),
      quarterly: generateHistoricalTrendData(branches, 'quarterly', 8),
      yearly: generateHistoricalTrendData(branches, 'yearly', 5)
    };
  }, [branches]);

  // 支社別データの生成
  const branchData = useMemo(() => {
    return branches.map(branch => {
      const periodData = generatePeriodData(branch, periodType, 0);
      return {
        branchId: branch.id,
        branchName: branch.name,
        branchCode: branch.code,
        newANP: periodData.metrics.newANP,
        newContractCount: periodData.metrics.newContractCount,
        continuationRate: periodData.metrics.continuationRate.actual,
        agentCount: branch.agentCount
      };
    });
  }, [branches, periodType]);

  const filteredBranches = branchData
    .filter(branch =>
      branch.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.branchCode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.branchName.localeCompare(b.branchName);
          break;
        case "anp":
          comparison = a.newANP.achievementRate - b.newANP.achievementRate;
          break;
        case "contracts":
          comparison = a.newContractCount.achievementRate - b.newContractCount.achievementRate;
          break;
        case "continuation":
          comparison = a.continuationRate - b.continuationRate;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const formatCurrency = (value: number) => {
    return `¥${(value / 1000000).toFixed(0)}M`;
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleBranchClick = (branchId: string) => {
    navigate(`/branch/${branchId}`);
  };

  if (!department) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <div className="text-center">
          <p className="text-muted-foreground">統括部が見つかりませんでした</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              {department.name} - 詳細分析
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {department.code} | {branches.length}支社
            </p>
          </div>
          <AchievementLegend />
          <PeriodSelector value={periodType} onChange={setPeriodType} />
        </div>

        <div className="space-y-6">
          {/* KPIカード */}
          <EnhancedKPICards
            kpis={[
              {
                title: "新規ANP",
                value: `¥${(totalMetrics.newANP.actual / 1000000).toFixed(0)}M`,
                achievementRate: totalMetrics.newANP.achievementRate,
                changeType: totalMetrics.newANP.achievementRate >= 100 ? "positive" : totalMetrics.newANP.achievementRate >= 90 ? "neutral" : "negative"
              },
              {
                title: "新規契約数",
                value: `${totalMetrics.newContractCount.actual.toLocaleString()}件`,
                achievementRate: totalMetrics.newContractCount.achievementRate,
                changeType: totalMetrics.newContractCount.achievementRate >= 100 ? "positive" : totalMetrics.newContractCount.achievementRate >= 90 ? "neutral" : "negative"
              },
              {
                title: "継続率",
                value: `${totalMetrics.continuationRate.actual.toFixed(1)}%`,
                achievementRate: totalMetrics.continuationRate.achievementRate,
                changeType: totalMetrics.continuationRate.achievementRate >= 100 ? "positive" : totalMetrics.continuationRate.achievementRate >= 90 ? "neutral" : "negative"
              }
            ]}
            historicalData={departmentHistoricalData}
          />

          {/* 支社別新規ANP及び目標達成率グラフ */}
          <BranchANPChart 
            data={filteredBranches.map(branch => ({
              branchName: branch.branchName,
              actual: branch.newANP.actual,
              plan: branch.newANP.plan
            }))}
          />

          {/* 支社別新規契約数及び目標達成率グラフ */}
          <BranchContractChart 
            data={filteredBranches.map(branch => ({
              branchName: branch.branchName,
              actual: branch.newContractCount.actual,
              plan: branch.newContractCount.plan
            }))}
          />

          {/* 支社別継続率及び目標達成率グラフ */}
          <BranchContinuationRateChart 
            data={filteredBranches.map(branch => ({
              branchName: branch.branchName,
              actual: branch.continuationRate,
              plan: 95.0
            }))}
          />

          {/* 支社別実績一覧 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">支社別実績一覧</h3>
                <div className="w-64">
                  <SearchBox
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="支社名で検索"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-semibold cursor-pointer hover:text-primary" onClick={() => handleSort("name")}>
                        支社名 {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="pb-3 font-semibold text-right cursor-pointer hover:text-primary" onClick={() => handleSort("anp")}>
                        新規ANP達成率 {sortBy === "anp" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="pb-3 font-semibold text-right cursor-pointer hover:text-primary" onClick={() => handleSort("contracts")}>
                        新規契約数達成率 {sortBy === "contracts" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="pb-3 font-semibold text-right cursor-pointer hover:text-primary" onClick={() => handleSort("continuation")}>
                        継続率 {sortBy === "continuation" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="pb-3 font-semibold text-center">営業社員数</th>
                      <th className="pb-3 font-semibold text-center">詳細</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBranches.map((branch) => (
                      <tr key={branch.branchId} className="border-b hover:bg-muted/50">
                        <td className="py-3">{branch.branchName}</td>
                        <td className="py-3 text-right">
                          <span className={`font-semibold ${branch.newANP.achievementRate >= 100 ? 'text-success' : branch.newANP.achievementRate >= 90 ? 'text-warning' : 'text-destructive'}`}>
                            {branch.newANP.achievementRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`font-semibold ${branch.newContractCount.achievementRate >= 100 ? 'text-success' : branch.newContractCount.achievementRate >= 90 ? 'text-warning' : 'text-destructive'}`}>
                            {branch.newContractCount.achievementRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-semibold">{branch.continuationRate.toFixed(1)}%</span>
                        </td>
                        <td className="py-3 text-center">{branch.agentCount}名</td>
                        <td className="py-3 text-center">
                          <button
                            className="text-primary hover:underline text-sm"
                            onClick={() => handleBranchClick(branch.branchId)}
                          >
                            詳細
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBranches.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  検索条件に一致する支社が見つかりませんでした
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
