import { useState } from "react";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BranchDetailModal } from "./branch-detail/BranchDetailModal";
import { generateBranchDetailData } from "@/data/sample-data-generator";
import { getBranchById } from "@/data/branches";

interface DepartmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DepartmentDetailData;
  periodType: PeriodType;
}

export const DepartmentDetailModal = ({ open, onOpenChange, data, periodType }: DepartmentDetailModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "anp" | "contracts" | "continuation">("anp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

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

  const getAchievementColor = (rate: number) => {
    if (rate >= 100) return "#10b981";
    if (rate >= 90) return "#f59e0b";
    return "#ef4444";
  };

  const chartDataANP = filteredBranches.slice(0, 10).map(branch => ({
    name: branch.branchName.length > 6 ? branch.branchName.substring(0, 6) + "..." : branch.branchName,
    achievementRate: branch.newANP.achievementRate,
    fullName: branch.branchName
  }));

  const chartDataContracts = filteredBranches.slice(0, 10).map(branch => ({
    name: branch.branchName.length > 6 ? branch.branchName.substring(0, 6) + "..." : branch.branchName,
    achievementRate: branch.newContractCount.achievementRate,
    fullName: branch.branchName
  }));

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleBranchClick = (branchId: string) => {
    setSelectedBranchId(branchId);
  };

  const selectedBranchData = selectedBranchId ? (() => {
    const branch = getBranchById(selectedBranchId);
    if (!branch) return null;
    return generateBranchDetailData(branch, periodType);
  })() : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              {data.departmentName} - 詳細分析
            </DialogTitle>
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

              {/* 支社別新規ANP達成率グラフ */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">支社別新規ANP達成率 (上位10支社)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDataANP} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 150]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-lg">
                                <p className="font-semibold">{payload[0].payload.fullName}</p>
                                <p className="text-sm">達成率: {payload[0].value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="achievementRate" radius={[0, 4, 4, 0]}>
                        {chartDataANP.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getAchievementColor(entry.achievementRate)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* 支社別新規契約数達成率グラフ */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">支社別新規契約数達成率 (上位10支社)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDataContracts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 150]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-lg">
                                <p className="font-semibold">{payload[0].payload.fullName}</p>
                                <p className="text-sm">達成率: {payload[0].value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="achievementRate" radius={[0, 4, 4, 0]}>
                        {chartDataContracts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getAchievementColor(entry.achievementRate)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

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

      {selectedBranchData && (
        <BranchDetailModal
          open={!!selectedBranchData}
          onOpenChange={(open) => !open && setSelectedBranchId(null)}
          data={selectedBranchData}
        />
      )}
    </>
  );
};
