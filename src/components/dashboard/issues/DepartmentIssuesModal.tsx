import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHearingHistoryByDepartment } from "@/hooks/useHearingHistory";
import { departments } from "@/data/departments";
import { branches } from "@/data/branches";
import { ThemeDistributionChart } from "./ThemeDistributionChart";
import { ThemeTimeline } from "./ThemeTimeline";
import { useMemo } from "react";
import { Building, ListChecks, Users, Calendar } from "lucide-react";

interface DepartmentIssuesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string | null;
  onBranchClick?: (branchId: string) => void;
}

export const DepartmentIssuesModal = ({
  open,
  onOpenChange,
  departmentId,
  onBranchClick,
}: DepartmentIssuesModalProps) => {
  const { data: hearingHistory, isLoading } = useHearingHistoryByDepartment(departmentId);
  const department = departments.find(d => d.id === departmentId);

  const themeDistribution = useMemo(() => {
    if (!hearingHistory) return [];

    const themeCount = new Map<string, number>();
    hearingHistory.forEach(h => {
      themeCount.set(h.major_theme, (themeCount.get(h.major_theme) || 0) + 1);
    });

    const total = hearingHistory.length;
    return Array.from(themeCount.entries()).map(([theme, count]) => ({
      theme,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  }, [hearingHistory]);

  const branchBreakdown = useMemo(() => {
    if (!hearingHistory) return [];

    const branchCount = new Map<string, { count: number; themes: Set<string> }>();
    hearingHistory.forEach(h => {
      const branchId = (h as any).enrichedBranchId || h.branch_id;
      if (!branchId) return;

      if (!branchCount.has(branchId)) {
        branchCount.set(branchId, { count: 0, themes: new Set() });
      }

      const data = branchCount.get(branchId)!;
      data.count++;
      data.themes.add(h.major_theme);
    });

    return Array.from(branchCount.entries())
      .map(([branchId, data]) => ({
        branchId,
        branchName: branches.find(b => b.id === branchId)?.name || branchId,
        count: data.count,
        themes: Array.from(data.themes),
      }))
      .sort((a, b) => b.count - a.count);
  }, [hearingHistory]);

  const uniqueThemes = useMemo(() => {
    if (!hearingHistory) return 0;
    return new Set(hearingHistory.map(h => h.major_theme)).size;
  }, [hearingHistory]);

  if (!department) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{department.name} - 詳細分析</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="space-y-6 p-1">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{hearingHistory?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">総課題数</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{uniqueThemes}</div>
                      <div className="text-sm text-muted-foreground">課題種類</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{branchBreakdown.length}</div>
                      <div className="text-sm text-muted-foreground">対象支社数</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">
                        {hearingHistory?.[0]?.date.substring(0, 7) || '-'}
                      </div>
                      <div className="text-sm text-muted-foreground">最新</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Theme Distribution */}
            {themeDistribution.length > 0 && (
              <ThemeDistributionChart data={themeDistribution} />
            )}

            {/* Branch Breakdown */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">支社別内訳</h3>
                <div className="space-y-3">
                  {branchBreakdown.map(branch => (
                    <div
                      key={branch.branchId}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => onBranchClick?.(branch.branchId)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{branch.branchName}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {branch.themes.map(theme => (
                            <Badge key={theme} variant="outline" className="text-xs">
                              {theme}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className="ml-4">{branch.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            {hearingHistory && hearingHistory.length > 0 && (
              <ThemeTimeline hearingHistory={hearingHistory} />
            )}

            {/* Recent Hearings */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">最新のヒアリング記録</h3>
                <div className="space-y-3">
                  {hearingHistory?.slice(0, 10).map(hearing => (
                    <div key={hearing.id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-2">
                          <Badge variant="secondary">{hearing.major_theme}</Badge>
                          <Badge variant="outline">{hearing.middle_theme}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{hearing.date}</span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{hearing.content}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>担当: {hearing.staff_name}</span>
                        <span>代理店: {hearing.agency_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
