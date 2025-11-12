import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHearingHistoryByBranch } from "@/hooks/useHearingHistory";
import { branches } from "@/data/branches";
import { ThemeDistributionChart } from "./ThemeDistributionChart";
import { ThemeTimeline } from "./ThemeTimeline";
import { useMemo } from "react";
import { ListChecks, Users, Building, Calendar } from "lucide-react";

interface BranchIssuesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId: string | null;
}

export const BranchIssuesModal = ({
  open,
  onOpenChange,
  branchId,
}: BranchIssuesModalProps) => {
  const { data: hearingHistory, isLoading } = useHearingHistoryByBranch(branchId);
  const branch = branches.find(b => b.id === branchId);

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

  const agencyBreakdown = useMemo(() => {
    if (!hearingHistory) return [];

    const agencyCount = new Map<string, { count: number; themes: Set<string> }>();
    hearingHistory.forEach(h => {
      if (!agencyCount.has(h.agency_id)) {
        agencyCount.set(h.agency_id, { count: 0, themes: new Set() });
      }

      const data = agencyCount.get(h.agency_id)!;
      data.count++;
      data.themes.add(h.major_theme);
    });

    return Array.from(agencyCount.entries())
      .map(([agencyId, data]) => ({
        agencyId,
        count: data.count,
        themes: Array.from(data.themes),
      }))
      .sort((a, b) => b.count - a.count);
  }, [hearingHistory]);

  const staffBreakdown = useMemo(() => {
    if (!hearingHistory) return [];

    const staffCount = new Map<string, number>();
    hearingHistory.forEach(h => {
      staffCount.set(h.staff_name, (staffCount.get(h.staff_name) || 0) + 1);
    });

    return Array.from(staffCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [hearingHistory]);

  const uniqueThemes = useMemo(() => {
    if (!hearingHistory) return 0;
    return new Set(hearingHistory.map(h => h.major_theme)).size;
  }, [hearingHistory]);

  if (!branch) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{branch.name} - 詳細分析</DialogTitle>
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
                      <div className="text-2xl font-bold">{agencyBreakdown.length}</div>
                      <div className="text-sm text-muted-foreground">対象代理店数</div>
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

            {/* Agency and Staff Breakdown */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">代理店別内訳</h3>
                  <div className="space-y-2">
                    {agencyBreakdown.map(agency => (
                      <div
                        key={agency.agencyId}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{agency.agencyId}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {agency.themes.map(theme => (
                              <Badge key={theme} variant="outline" className="text-xs">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge>{agency.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">担当者別内訳</h3>
                  <div className="space-y-2">
                    {staffBreakdown.map(staff => (
                      <div
                        key={staff.name}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                      >
                        <span className="font-medium text-sm">{staff.name}</span>
                        <Badge>{staff.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            {hearingHistory && hearingHistory.length > 0 && (
              <ThemeTimeline hearingHistory={hearingHistory} />
            )}

            {/* All Hearings */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">全ヒアリング記録</h3>
                <div className="space-y-3">
                  {hearingHistory?.map(hearing => (
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
