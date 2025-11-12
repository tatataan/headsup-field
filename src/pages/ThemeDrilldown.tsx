import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { departments } from "@/data/departments";
import { branches } from "@/data/branches";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

export default function ThemeDrilldown() {
  const { distributionId } = useParams();
  const navigate = useNavigate();

  const { data: distribution, isLoading: isLoadingDist } = useQuery({
    queryKey: ["theme-distribution", distributionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_distributions")
        .select("*")
        .eq("id", distributionId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: responses, isLoading: isLoadingResponses } = useQuery({
    queryKey: ["theme-responses", distributionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_responses")
        .select("*")
        .eq("distribution_id", distributionId);

      if (error) throw error;
      return data;
    },
  });

  const getDepartmentStats = () => {
    if (!responses) return [];

    const stats = departments.map((dept) => {
      const deptBranches = branches.filter((b) =>
        dept.branchIds.includes(b.id)
      );

      const branchStats = deptBranches.map((branch) => {
        const totalAgencies = branch.agentCount;
        
        // Count UNIQUE agencies (not total response records)
        const uniqueAgencies = new Set(
          responses
            .filter((r) => r.branch_id === branch.id)
            .map((r) => r.agency_id)
        );
        const respondedAgencies = uniqueAgencies.size;
        
        const rate =
          totalAgencies > 0
            ? Math.round((respondedAgencies / totalAgencies) * 100)
            : 0;

        return {
          branchId: branch.id,
          branchName: branch.name,
          totalAgencies,
          respondedAgencies,
          rate,
        };
      });

      const totalAgencies = branchStats.reduce((sum, b) => sum + b.totalAgencies, 0);
      const totalResponded = branchStats.reduce(
        (sum, b) => sum + b.respondedAgencies,
        0
      );
      const overallRate =
        totalAgencies > 0
          ? Math.round((totalResponded / totalAgencies) * 100)
          : 0;

      return {
        deptId: dept.id,
        deptName: dept.name,
        totalAgencies,
        respondedAgencies: totalResponded,
        rate: overallRate,
        branches: branchStats,
      };
    });

    return stats.sort((a, b) => b.rate - a.rate);
  };

  const departmentStats = getDepartmentStats();

  const overallStats = departmentStats.reduce(
    (acc, dept) => ({
      total: acc.total + dept.totalAgencies,
      responded: acc.responded + dept.respondedAgencies,
    }),
    { total: 0, responded: 0 }
  );

  const overallRate =
    overallStats.total > 0
      ? Math.round((overallStats.responded / overallStats.total) * 100)
      : 0;

  if (isLoadingDist || isLoadingResponses) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!distribution) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <p className="text-muted-foreground">データが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/topics/new?tab=history")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          配信履歴に戻る
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {distribution.title}
          </h1>
          <p className="text-muted-foreground">
            統括部・支社別の対応済割合
          </p>
        </div>

        {/* Overall Summary */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">全社対応状況</h3>
              <span className="text-3xl font-bold text-primary">
                {overallRate}%
              </span>
            </div>
            <Progress value={overallRate} className="h-3" />
            <p className="text-sm text-muted-foreground">
              対応済: {overallStats.responded} / 対象: {overallStats.total} 代理店
            </p>
          </div>
        </Card>

        {/* Department Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">統括部別詳細</h3>
          <Accordion type="multiple" className="w-full">
            {departmentStats.map((dept) => (
              <AccordionItem key={dept.deptId} value={dept.deptId}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium">{dept.deptName}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {dept.respondedAgencies} / {dept.totalAgencies} 代理店
                      </span>
                      <span className="text-lg font-bold text-primary min-w-[60px] text-right">
                        {dept.rate}%
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-4">
                    {dept.branches.map((branch) => (
                      <div
                        key={branch.branchId}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <span className="text-sm">{branch.branchName}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {branch.respondedAgencies} / {branch.totalAgencies}
                          </span>
                          <div className="w-24">
                            <Progress value={branch.rate} className="h-2" />
                          </div>
                          <span className="text-sm font-semibold min-w-[50px] text-right">
                            {branch.rate}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
