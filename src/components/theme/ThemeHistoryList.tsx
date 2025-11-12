import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, TrendingUp, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

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
}

export const ThemeHistoryList = () => {
  const navigate = useNavigate();

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

  const getCompletionRate = (distributionId: string) => {
    if (!responsesData) return 0;
    
    // Count unique agencies that responded
    const responses = responsesData.filter(
      (r) => r.distribution_id === distributionId
    );
    const uniqueAgencies = new Set(responses.map((r) => r.agency_id));
    
    // For demo purposes, assume total target is 100 agencies
    // In production, calculate based on target_ids
    const totalTargets = 100;
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
      {distributions.map((dist) => {
        const completionRate = dist.is_required ? getCompletionRate(dist.id) : null;

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

                    <div className="flex gap-2 ml-auto">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Functionality will be added in Phase 3
                              }}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              データシミュレート
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              ダミーデータを生成して対応済割合をシミュレートします（既存データは削除されます）
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

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
