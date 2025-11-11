import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DepartmentDetailData } from "@/types/department";
import { PeriodType } from "@/types/kpi";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Building2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchBox } from "./SearchBox";
import { PeriodSelector } from "./PeriodSelector";
import { BranchANPChart } from "./department-detail/BranchANPChart";
import { BranchContractChart } from "./department-detail/BranchContractChart";
import { BranchContinuationRateChart } from "./department-detail/BranchContinuationRateChart";

interface DepartmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DepartmentDetailData;
  periodType: PeriodType;
}

export const DepartmentDetailModal = ({ open, onOpenChange, data, periodType: initialPeriodType }: DepartmentDetailModalProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "anp" | "contracts" | "continuation">("anp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [periodType, setPeriodType] = useState<PeriodType>(initialPeriodType);

  const filteredBranches = data.branches
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
    onOpenChange(false);
    navigate(`/branch/${branchId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                {data.departmentName} - 詳細分析
              </DialogTitle>
              <PeriodSelector value={periodType} onChange={setPeriodType} />
            </div>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-100px)] pr-4">
            <div className="space-y-6">
              {/* KPIカード */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 新規ANP */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">新規ANP</p>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">{formatCurrency(data.totalMetrics.newANP.actual)}</span>
                          <span className="text-sm text-muted-foreground">/ {formatCurrency(data.totalMetrics.newANP.plan)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${data.totalMetrics.newANP.achievementRate >= 100 ? 'text-success' : 'text-warning'}`}>
                            達成率 {data.totalMetrics.newANP.achievementRate}%
                          </span>
                          {data.totalMetrics.newANP.achievementRate >= 100 ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-warning" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 新規契約数 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">新規契約数</p>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">{data.totalMetrics.newContractCount.actual}件</span>
                          <span className="text-sm text-muted-foreground">/ {data.totalMetrics.newContractCount.plan}件</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${data.totalMetrics.newContractCount.achievementRate >= 100 ? 'text-success' : 'text-warning'}`}>
                            達成率 {data.totalMetrics.newContractCount.achievementRate}%
                          </span>
                          {data.totalMetrics.newContractCount.achievementRate >= 100 ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-warning" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 継続率 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">継続率</p>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">{data.totalMetrics.continuationRate.actual}%</span>
                          <span className="text-sm text-muted-foreground">/ {data.totalMetrics.continuationRate.plan}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${data.totalMetrics.continuationRate.achievementRate >= 100 ? 'text-success' : 'text-warning'}`}>
                            達成率 {data.totalMetrics.continuationRate.achievementRate}%
                          </span>
                          {data.totalMetrics.continuationRate.achievementRate >= 100 ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-warning" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

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
                  plan: 95.0 // デフォルト計画値
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
                                {branch.newANP.achievementRate}%
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <span className={`font-semibold ${branch.newContractCount.achievementRate >= 100 ? 'text-success' : branch.newContractCount.achievementRate >= 90 ? 'text-warning' : 'text-destructive'}`}>
                                {branch.newContractCount.achievementRate}%
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <span className="font-semibold">{branch.continuationRate}%</span>
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
          </ScrollArea>
        </DialogContent>
      </Dialog>
  );
};
