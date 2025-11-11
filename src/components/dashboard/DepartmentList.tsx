import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, TrendingDown } from "lucide-react";
import { SearchBox } from "./SearchBox";
import { Department, DepartmentDetailData } from "@/types/department";
import { departments } from "@/data/departments";
import { branches, getBranchesByDepartmentId } from "@/data/branches";
import { generatePeriodData } from "@/data/sample-data-generator";
import { PeriodType } from "@/types/kpi";
import { DepartmentDetailModal } from "./DepartmentDetailModal";

interface DepartmentListProps {
  periodType: PeriodType;
}

export const DepartmentList = ({ periodType }: DepartmentListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDetailData | null>(null);

  // 検索フィルタリング
  const filteredDepartments = useMemo(() => {
    if (!searchQuery) return departments;
    const query = searchQuery.toLowerCase();
    return departments.filter(dept =>
      dept.name.toLowerCase().includes(query) ||
      dept.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 統括部データの生成
  const departmentData = useMemo(() => {
    return filteredDepartments.map(dept => {
      const deptBranches = getBranchesByDepartmentId(dept.id);
      
      // 各支社のKPIを合算
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
      const continuationRateAchievement = avgContinuationRatePlan > 0 ? (avgContinuationRateActual / avgContinuationRatePlan) * 100 : 0;

      const anpAchievementRate = totalPlanANP > 0 ? (totalActualANP / totalPlanANP) * 100 : 0;
      const contractAchievementRate = totalPlanContracts > 0 ? (totalActualContracts / totalPlanContracts) * 100 : 0;

      return {
        ...dept,
        metrics: {
          newANP: {
            plan: totalPlanANP,
            actual: totalActualANP,
            achievementRate: parseFloat(anpAchievementRate.toFixed(1))
          },
          newContractCount: {
            plan: totalPlanContracts,
            actual: totalActualContracts,
            achievementRate: parseFloat(contractAchievementRate.toFixed(1))
          },
          continuationRate: {
            plan: parseFloat(avgContinuationRatePlan.toFixed(1)),
            actual: parseFloat(avgContinuationRateActual.toFixed(1)),
            achievementRate: parseFloat(continuationRateAchievement.toFixed(1))
          }
        },
        branchCount: deptBranches.length
      };
    });
  }, [filteredDepartments, periodType]);

  const formatCurrency = (value: number) => {
    return `¥${(value / 1000000).toFixed(0)}M`;
  };

  const getAchievementColor = (rate: number) => {
    if (rate >= 100) return "text-success";
    if (rate >= 90) return "text-warning";
    return "text-destructive";
  };

  const handleDepartmentClick = (dept: typeof departmentData[0]) => {
    const deptBranches = getBranchesByDepartmentId(dept.id);
    const currentPeriod = generatePeriodData(deptBranches[0], periodType, 0);
    
    // 履歴データ生成（簡易版）
    const historicalData = Array.from({ length: 6 }, (_, i) => {
      let totalANP = 0;
      let totalContracts = 0;
      let totalContinuation = 0;

      deptBranches.forEach(branch => {
        const periodData = generatePeriodData(branch, periodType, i);
        totalANP += periodData.metrics.newANP.actual;
        totalContracts += periodData.metrics.newContractCount.actual;
        totalContinuation += periodData.metrics.continuationRate.actual;
      });

      return {
        period: generatePeriodData(deptBranches[0], periodType, i).period,
        newANP: totalANP,
        newContractCount: totalContracts,
        continuationRate: totalContinuation / deptBranches.length
      };
    }).reverse();

    // 支社サマリー生成
    const branchSummaries = deptBranches.map(branch => {
      const branchPeriod = generatePeriodData(branch, periodType, 0);
      return {
        branchId: branch.id,
        branchName: branch.name,
        branchCode: branch.code,
        newANP: branchPeriod.metrics.newANP,
        newContractCount: branchPeriod.metrics.newContractCount,
        continuationRate: branchPeriod.metrics.continuationRate.actual,
        agentCount: branch.agentCount
      };
    });

    setSelectedDepartment({
      departmentId: dept.id,
      departmentName: dept.name,
      departmentCode: dept.code,
      currentPeriod: {
        period: currentPeriod.period,
        periodType,
        metrics: {
          newANP: dept.metrics.newANP,
          newContractCount: dept.metrics.newContractCount,
          continuationRate: dept.metrics.continuationRate
        }
      },
      historicalData: historicalData.map(h => ({
        period: h.period,
        periodType,
        metrics: {
          newANP: { plan: 0, actual: h.newANP, achievementRate: 0 },
          newContractCount: { plan: 0, actual: h.newContractCount, achievementRate: 0 },
          continuationRate: { plan: 95, actual: h.continuationRate, achievementRate: (h.continuationRate / 95) * 100 }
        }
      })),
      branches: branchSummaries,
      totalMetrics: {
        newANP: dept.metrics.newANP,
        newContractCount: dept.metrics.newContractCount,
        continuationRate: dept.metrics.continuationRate
      }
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">営業部別実績</h2>
          <div className="w-64">
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="営業部名またはコードで検索"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentData.map((dept) => (
            <Card
              key={dept.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleDepartmentClick(dept)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {dept.name}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">{dept.code}</span>
                </div>
                <p className="text-xs text-muted-foreground">{dept.branchCount}支社</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 新規ANP */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>新規ANP</span>
                    <span className={getAchievementColor(dept.metrics.newANP.achievementRate)}>
                      {dept.metrics.newANP.achievementRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{formatCurrency(dept.metrics.newANP.actual)}</span>
                    <span className="text-xs text-muted-foreground">/ {formatCurrency(dept.metrics.newANP.plan)}</span>
                  </div>
                </div>

                {/* 新規契約数 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>新規契約数</span>
                    <span className={getAchievementColor(dept.metrics.newContractCount.achievementRate)}>
                      {dept.metrics.newContractCount.achievementRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{dept.metrics.newContractCount.actual}件</span>
                    <span className="text-xs text-muted-foreground">/ {dept.metrics.newContractCount.plan}件</span>
                  </div>
                </div>

                {/* 継続率 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>継続率</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{dept.metrics.continuationRate.actual}%</span>
                      <span className="text-xs text-muted-foreground">/ {dept.metrics.continuationRate.plan}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs ${getAchievementColor(dept.metrics.continuationRate.achievementRate)}`}>
                        達成率: {dept.metrics.continuationRate.achievementRate}%
                      </span>
                      {dept.metrics.continuationRate.achievementRate >= 100 ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-warning" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            検索条件に一致する営業部が見つかりませんでした
          </div>
        )}
      </div>

      {selectedDepartment && (
        <DepartmentDetailModal
          open={!!selectedDepartment}
          onOpenChange={(open) => !open && setSelectedDepartment(null)}
          data={selectedDepartment}
          periodType={periodType}
        />
      )}
    </>
  );
};
