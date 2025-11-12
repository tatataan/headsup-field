import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp, RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { branches } from "@/data/branches";
import { getDepartmentByBranchId } from "@/data/departments";

interface ThemeDistribution {
  id: string;
  title: string;
  major_theme: string;
  middle_theme: string;
  detail_theme: string;
  distribution_start_date: string;
  distribution_end_date: string;
  is_required: boolean;
  created_at: string;
  target_type: string;
  target_ids: string[] | null;
}

// Helper function to generate dummy responses
const generateDummyResponses = (
  distributionId: string,
  startDate: string,
  endDate: string
) => {
  const responses: any[] = [];
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  
  const responseNotes = [
    "対応完了しました",
    "顧客への説明を実施しました",
    "資料を配布し、説明を行いました",
    "全営業担当者に周知済みです",
    "朝礼で共有し、理解を深めました",
  ];

  branches.forEach((branch) => {
    const department = getDepartmentByBranchId(branch.id);
    if (!department) return;

    // Randomly select 40-60% of agencies to respond
    const responseRate = 0.4 + Math.random() * 0.2; // 40-60%
    const respondingAgencies = Math.floor(branch.agentCount * responseRate);

    for (let i = 0; i < respondingAgencies; i++) {
      // Generate unique agency_id
      const agencyNumber = String(i + 1).padStart(3, "0");
      const agencyId = `AGY-${branch.code}-${agencyNumber}`;

      // Generate random responded_at within distribution period
      const randomTime = startTime + Math.random() * (endTime - startTime);
      const respondedAt = new Date(randomTime).toISOString();

      // 30% get a response_note
      const hasNote = Math.random() < 0.3;
      const responseNote = hasNote
        ? responseNotes[Math.floor(Math.random() * responseNotes.length)]
        : null;

      responses.push({
        distribution_id: distributionId,
        agency_id: agencyId,
        branch_id: branch.id,
        department_id: department.id,
        responded_at: respondedAt,
        response_note: responseNote,
      });
    }
  });

  return responses;
};

export const ThemeHistoryList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  const { data: distributions, isLoading } = useQuery({
    queryKey: ["theme-distributions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_distributions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ThemeDistribution[];
    },
  });

  const { data: responsesData } = useQuery({
    queryKey: ["theme-responses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("theme_responses")
        .select("distribution_id, agency_id");

      if (error) throw error;
      return data;
    },
  });

  // Mutation for simulating data
  const simulateMutation = useMutation({
    mutationFn: async (dist: ThemeDistribution) => {
      // Step 1: DELETE all existing responses for this distribution
      const { error: deleteError } = await supabase
        .from("theme_responses")
        .delete()
        .eq("distribution_id", dist.id);

      if (deleteError) throw deleteError;

      // Step 2: Generate and INSERT new dummy data
      const dummyData = generateDummyResponses(
        dist.id,
        dist.distribution_start_date,
        dist.distribution_end_date
      );

      const { error: insertError } = await supabase
        .from("theme_responses")
        .insert(dummyData);

      if (insertError) throw insertError;

      return dummyData.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["theme-responses"] });
      toast({
        title: "データシミュレート完了",
        description: `${count}件の対応データを生成しました`,
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: "データ生成に失敗しました",
        variant: "destructive",
      });
      console.error("Simulation error:", error);
    },
  });

  const getCompletionRate = (distribution: ThemeDistribution) => {
    if (!responsesData) return 0;
    
    // Count unique agencies that responded
    const responses = responsesData.filter(
      (r) => r.distribution_id === distribution.id
    );
    const uniqueAgencies = new Set(responses.map((r) => r.agency_id));
    
    // Calculate actual total targets based on target_type
    let totalTargets = 0;
    
    if (distribution.target_type === "all") {
      // Sum all agencies from all branches
      totalTargets = branches.reduce((sum, branch) => sum + branch.agentCount, 0);
    } else if (distribution.target_type === "department" && distribution.target_ids) {
      // Sum agencies from specific departments
      const targetDeptIds = distribution.target_ids;
      branches.forEach(branch => {
        const dept = getDepartmentByBranchId(branch.id);
        if (dept && targetDeptIds.includes(dept.id)) {
          totalTargets += branch.agentCount;
        }
      });
    } else if (distribution.target_type === "branch" && distribution.target_ids) {
      // Sum agencies from specific branches
      const targetBranchIds = distribution.target_ids;
      branches.forEach(branch => {
        if (targetBranchIds.includes(branch.id)) {
          totalTargets += branch.agentCount;
        }
      });
    }
    
    if (totalTargets === 0) return 0;
    
    const rate = (uniqueAgencies.size / totalTargets) * 100;
    return Math.round(rate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!distributions || distributions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">まだテーマが配信されていません</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Development Tools Panel */}
      <Card className="border-dashed border-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20">
        <div className="p-4">
          <button
            onClick={() => setDevToolsOpen(!devToolsOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              <span className="font-mono font-bold text-amber-900 dark:text-amber-100">
                DEV TOOLS - 開発用ツール
              </span>
              <Badge 
                variant="outline" 
                className="border-amber-600 text-amber-700 dark:border-amber-500 dark:text-amber-400"
              >
                本番環境では非表示
              </Badge>
            </div>
            {devToolsOpen ? (
              <ChevronUp className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            )}
          </button>
          
          {devToolsOpen && (
            <div className="mt-4 space-y-3 border-t border-amber-300 dark:border-amber-700 pt-4">
              <p className="text-sm text-amber-700 dark:text-amber-300 font-mono">
                ※このパネルはダミーデータ生成用です。各テーマの対応データをシミュレートできます。
              </p>
              
              {distributions
                .filter(d => d.is_required)
                .map(dist => {
                  const completionRate = getCompletionRate(dist);
                  return (
                    <div 
                      key={dist.id} 
                      className="flex items-center justify-between p-3 bg-background rounded border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{dist.title}</p>
                        <p className="text-xs text-muted-foreground">
                          現在の対応率: {completionRate}%
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => simulateMutation.mutate(dist)}
                        disabled={simulateMutation.isPending}
                        className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-950/50"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${simulateMutation.isPending ? 'animate-spin' : ''}`} />
                        シミュレート
                      </Button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </Card>

      {/* Theme Distribution Cards */}
      {distributions.map((dist) => {
        const completionRate = dist.is_required ? getCompletionRate(dist) : null;

        return (
          <Card key={dist.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-foreground">
                    {dist.title}
                  </h3>
                  {dist.is_required && (
                    <Badge variant="destructive">必須対応</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span className="font-medium">{dist.major_theme}</span>
                  <span>→</span>
                  <span className="font-medium">{dist.middle_theme}</span>
                  <span>→</span>
                  <span className="font-medium">{dist.detail_theme}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    配信期間: {format(new Date(dist.distribution_start_date), "PP", { locale: ja })} 〜{" "}
                    {format(new Date(dist.distribution_end_date), "PP", { locale: ja })}
                  </span>
                </div>

                {dist.is_required && completionRate !== null && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">対応済割合:</span>
                      <span className="text-lg font-bold text-primary">
                        {completionRate}%
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              この割合は代理店単位で計算されています。
                              対応済み代理店数 ÷ 対象代理店総数
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/topics/history/${dist.id}/drilldown`)}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        割合ドリルダウン
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
